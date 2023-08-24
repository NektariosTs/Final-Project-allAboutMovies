const { sendError, formatActor, averageRatingPipeline, relatedMovieAggregation, getAverageRatings, topRatedMoviesPipeline } = require("../utils/helper");
const cloudinary = require('cloudinary').v2;
const Movie = require("../models/movie");
const Review = require("../models/review");
const mongoose = require("mongoose")
const { isValidObjectId } = mongoose;



cloudinary.config({
  cloud_name: "dwtjkpgz0",
  api_key: "861961659874375",
  api_secret: "eGAaSobohLaRr0jtkk9ap2oL5KQ",
  secure: true,//when we upload files inside cloudinary it will create the url with https is more secure form http
});

exports.uploadTrailer = async (req, res) => {
  const { file } = req;
  if (!file) return sendError(res, "Video file is missing");//if there is no fie we send the error message
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      resource_type: "video",
    }
  );
  res.status(201).json({ url, public_id });//send this url and public_id inside frontend
};
//create movie
exports.createMovie = async (req, res) => {
  const { file, body } = req;
  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = body;

  const newMovie = new Movie({
    title,
    storyLine,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    trailer,
    language,
  });
  //manage the director because we havent director in the newMovie variable with id
  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    newMovie.director = director;
  }

  //manage the writers and we  use for loop because this writers will be in array

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    newMovie.writers = writers;
  }

  //uploading poster
  // cloudinary doc responsive breakpoints If true, create and keep the derived images of the selected breakpoints during the API call. If false, images generated during the analysis process are thrown away.
  if (file) {
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(file.path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });

    const finalPoster = { url, public_id, responsive: [] };

    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }
    newMovie.poster = finalPoster;
  }

  await newMovie.save();

  res.status(201).json({
    movie: {
      id: newMovie._id,
      title,
    },
  });
};

exports.updateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "invalid Movie id")

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "movie not found", (404))

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    movie.director = director;
  }
  //manage the writers and we  use for loop because this writers will be in array
  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    movie.writers = writers;
  }

  await movie.save()

  res.json({ message: " Movie is updated", movie })

}

exports.updateMovie = async (req, res) => {
  const { movieId } = req.params;
  const { file } = req

  if (!isValidObjectId(movieId)) return sendError(res, "invalid Movie id");

  // if (!req.file) return sendError(res, "Movie poster is missing!")

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "movie not found", (404))

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  movie.language = language;

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    movie.director = director;
  }
  //manage the writers and we  use for loop because this writers will be in array
  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    movie.writers = writers;
  }

  //update poster

  if (file) {
    //removing poster from cloud if there is any
    const posterID = movie.poster?.public_id; //? = optional
    if (posterID) {
      const { result } = await cloudinary.uploader.destroy(posterID);
      if (result !== "ok") {
        return sendError(res, "Could not update poster at the moment!")
      }


      const { secure_url: url, public_id, responsive_breakpoints } =
        await cloudinary.uploader.upload(
          req.file.path, {
          transformation: {
            width: 1280,
            height: 720
          },
          responsive_breakpoints: {
            create_derived: true,
            max_width: 640,
            max_images: 3
          }
        });

      const finalPoster = { url, public_id, responsive: [] }

      const { breakpoints } = responsive_breakpoints[0]
      if (breakpoints.length) {
        for (let imgObj of breakpoints) {
          const { secure_url } = imgObj;
          finalPoster.responsive.push(secure_url)
        }
      }

      movie.poster = finalPoster;
    }
  }

  await movie.save();

  res.json({
    message: "Movie is updated",
    movie: {
      id: movie._id,
      title: movie.title,
      poster: movie.poster?.url,
      genres: movie.genres,
      status: movie.status,
    },
  });
};

exports.removeMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "invalid Movie id");

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "movie not found", (404));

  //check if there is poster or not.
  //if yes then we need to remove that.


  const posterId = movie.poster?.public_id
  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);
    if (result !== "ok") return sendError(res, "could not remove poster form cloud!");
  }
  //removing trailer
  const trailerId = movie.trailer?.public_id;
  if (!trailerId) return sendError(res, "could not find trailer in the cloud!");
  const { result } = await cloudinary.uploader.destroy(trailerId, { resource_type: "video" });
  if (result !== "ok") return sendError(res, "could not remove trailer form cloud!");

  await Movie.findByIdAndDelete(movieId);

  res.json({ message: "movie removed successfully" })

}


exports.getMovies = async (req, res) => {
  const { pageNo = 0, limit = 10 } = req.query;//default value

  const movies = await Movie.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));


  const results = movies.map(movie => ({
    id: movie._id,
    title: movie.title,
    poster: movie.poster?.url,//? is optional thing the poster so if we don t put a poster we dont want to throw an error
    genres: movie.genres,
    status: movie.status
  }))

  res.json({ movies: results })
};


//Populate is used to enhance one-to-many or many-to-one data relationships in MongoDB. The populate() method in Mongoose is used to replace the specified paths in a document with another document from other collections.
exports.getMovieForUpdate = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Id is invalid!");

  const movie = await Movie.findById(movieId).populate("director writers cast.actor");

  res.json({
    movie: {
      id: movie._id,
      title: movie.title,
      storyLine: movie.storyLine,
      poster: movie.poster?.url,
      releaseDate: movie.releaseDate,
      status: movie.status,
      type: movie.type,
      language: movie.language,
      genres: movie.genres,
      tags: movie.tags,
      director: formatActor(movie.director),
      writers: movie.writers.map(w => formatActor(w)),
      cast: movie.cast.map(c => {
        return {
          id: c.id,
          profile: formatActor(c.actor),
          roleAs: c.roleAs,
          leadActor: c.leadActor
        }
      })
    }
  });
}

exports.searchMovies = async (req, res) => {
  const { title } = req.query;

  if (!title.trim()) return sendError(res, "invalid request!")

  const movies = await Movie.find({ title: { $regex: title, $options: "i" } })//just ignore this insensitive task
  res.json({
    results: movies.map(m => {
      return {
        id: m._id,
        title: m.title,
        poster: m.poster?.url,
        genres: m.genres,
        status: m.status
      }
    })
  })
}
// e using find method and we want to find those movies that are public and then we sorting them and we setting limit just 5 
//we are using the map method because we want to map through this results and we want to create brand new array so that we can have all this things inside the array and we send response to frontend
//we set the limit because we want to fetch 5 by default
exports.getLatestUploads = async (req, res) => {
  const { limit = 5 } = req.query;

  const results = await Movie.find({ status: "public" })
    .sort("-createdAt")
    .limit(parseInt(limit));
  const movies = results.map(m => {
    return {
      id: m._id,
      title: m.title,
      storyLine: m.storyLine,
      poster: m.poster?.url,
      trailer: m.trailer?.url,
    };
  });
  res.json({ movies });
};


//fetching the single movie with id
exports.getSingleMovie = async (req, res) => {
  const { movieId } = req.params;

  // mongoose.Types.ObjectId(movieId)

  if (!isValidObjectId(movieId)) return sendError(res, "Movie id is not valid");

  const movie = await Movie.findById(movieId).populate("director writers cast.actor");


  //inside the aggregate we can pass multiple oparations all of these are stages and these will pass pass the result to the next stage
  //inside the Review we are passing the stage of $lookup so we want to look up inside the Review and whenever we want to use this look up then you have to have all of your record inside in the same database so we passing the rating of the review and the id of our reviews and then we want to give the record ang rating that we produce after that we go to match and we want to match all the records that we have from upper stage and we want to only filter in this parent movieid and after we want to group all the data and we want only the rating avg and after that we are counting the number of reviews
  // const [aggregatedResponse] = await Review.aggregate(averageRatingPipeline(movie._id));
  // const reviews = {};

  // if (aggregatedResponse) {
  //   const { ratingAvg, reviewCount } = aggregatedResponse;
  //   reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
  //   reviews.reviewCount = reviewCount
  // }

  const reviews = await getAverageRatings(movie._id)


  const { _id: id,
    title,
    storyLine,
    cast,
    writers,
    director,
    releaseDate,
    genres, tags,
    language,
    poster,
    trailer,
    type
  } = movie;
  //the response that we want to take from fornt
  res.json({
    movie: {
      title,
      storyLine,
      releaseDate,
      genres,
      tags,
      language,
      type,
      poster: poster?.url,
      trailer: trailer?.url,
      cast: cast.map(c => ({
        id: c._id,
        profile: {
          id: c.actor._id,
          name: c.actor.name,
          avatar: c.actor?.avatar?.url,
        },
        leadActor: c.leadActor,
        roleAs: c.roleAs
      })),
      writers: writers.map(w => ({
        id: w.id,
        name: w.name
      })),
      director: {
        id: director._id,
        name: director.name,
      },
      reviews: { ...reviews },
    }
  });
};

//we finding all of these movie inside of the movie and we want only select localfields and we only caring only for the tags after we matching all of the record with the tags and we are cheking if this tags includes the tags of this movie but we dont want to select the movie with the same id so we use the ne(not equal)
//and we creating the porject we select only the title and the poster and we select the url and the we set the limit
exports.getRelatedMovies = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) return sendError(res, "invalid movie Id!")

  const movie = await Movie.findById(movieId);;

  const movies = await Movie.aggregate(
    relatedMovieAggregation(movie.tags, movie._id));

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id)
    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      reviews: { ...reviews }
    };
  }

  const relatedMovies = await Promise.all(movies.map(mapMovies)
  );

  res.json({ movies: relatedMovies });
};

exports.getTopRatedMovies = async (req, res) => {
  const { type = "Film" } = req.query;

  const movies = await Movie.aggregate(topRatedMoviesPipeline(type));

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePosters: m.responsivePosters,
      reviews: { ...reviews },
    };
  };

  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: topRatedMovies });
};


exports.searchPublicMovies = async (req, res) => {
  const { title } = req.query;

  if (!title.trim()) return sendError(res, "invalid request!")

  const movies = await Movie.find({
    title: { $regex: title, $options: "i" },
    status: "public"
  })//just ignore this insensitive task


  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster.url,
      responsivePosters: m.poster?.responsive,
      reviews: { ...reviews },
    };
  };

  const results = await Promise.all(movies.map(mapMovies));


  res.json({
    results
  });
};