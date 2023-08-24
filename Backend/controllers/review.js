const { isValidObjectId } = require("mongoose");
const { sendError, getAverageRatings } = require("../utils/helper");
const Movie = require("../models/movie")
const Review = require("../models/review");
const { populate } = require("../models/user");


//first of all we validate the movieId and if its not valid then we send the error response
//after we found the movie with the movieId and with the status public//
//if not found any movie inside in the database we send error
//and latest we find this review with this owner and parent movie and if we find this review inside the data base it means that this movie is already review
exports.addReview = async (req, res) => {
  const { movieId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;

  if(!req.user.isVerified) return sendError(res, "please verify your email") 
  if (!isValidObjectId(movieId)) return sendError(res, "invalid movie");

  const movie = await Movie.findOne({ _id: movieId, status: "public" })
  if (!movie) return sendError(res, "movie not found!", 404);

  const isAlreadyReviewed = await Review.findOne({
    owner: userId,
    parentMovie: movie._id
  })
  if (isAlreadyReviewed) return sendError(res, "review is is already their!");

  //create and update review.
  const newReview = new Review({
    owner: userId,
    parentMovie: movie._id,
    content,
    rating
  })
  // after we are adding this newReviewId inside the reviews and we saving the movie
  //updating review for movie
  movie.reviews.push(newReview._id);
  await movie.save();

  //saving new rating
  await newReview.save();

  const reviews = await getAverageRatings(movie._id)

  res.json({ message: "Your review has been added!", reviews })
};

//we use the reviewId to face this REview.findbyone but we want to find if this review belong to this owner if not we send error otherwise we updating the value and we are saving brand new review and send the response
exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "invalid reviewId");

  const review = await Review.findOne({ owner: userId, _id: reviewId })
  if (!review) return sendError(res, "review not found!", 404);

  review.content = content;
  review.rating = rating;

  await review.save()

  res.json({ message: "Your review has been updated!" })

};


//we check if this review id is valid or not
//after that we find this review with this owner and _id and if there is not review we sent error
//after we found the movie with the review .parent movie so we can find this movies when we find this movie we are updating the review and then we delete the review and then we saving the movie  and we send the response
//(when we want to compare two object ids you have to convert them to a string) so with this way we can delete the review from inside the movie
exports.removeReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "invalid review id");

  const review = await Review.findOne({ owner: userId, _id: reviewId });
  if (!review) return sendError(res, "invalid request, review not found!");

  const movie = await Movie.findById(review.parentMovie).select("reviews");
  movie.reviews = movie.reviews.filter((revId) => revId.toString() !== reviewId);

  await Review.findByIdAndDelete(reviewId);

  await movie.save();

  res.json({ message: "Review removed successfully." })

};

//fetcing the review from the movie data base

exports.getReviewsByMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie ID!");

  const movie = await Movie.findById(movieId)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
        select: "name",
      },
    })
    .select("reviews title");
  //we maping through the reviews and we tell the values that we want { owner, content, rating, _id: reviewId },{ name, _id: ownerId }
  //we fix the returning reviews v

  const reviews = movie.reviews.map((r) => {
    const { owner, content, rating, _id: reviewId } = r;
    const { name, _id: ownerId } = owner;

    return {
      id: reviewId,
      owner: {
        id: ownerId,
        name,
      },
      content,
      rating,
    };
  });

  res.json({ movie: { title: movie.title, reviews } });
};

