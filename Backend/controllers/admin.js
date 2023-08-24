const Movie = require("../models/movie")
const Review = require("../models/review")
const UserModel = require("../models/user");
const { topRatedMoviesPipeline, getAverageRatings } = require("../utils/helper");


// we want the infos in our admin panel , so we made a function that simply returns the things that we want to saw
exports.getAppInfo = async (req, res) => {
    const movieCount = await Movie.countDocuments();
    const reviewCount = await Review.countDocuments();
    const userCount = await UserModel.countDocuments();


    res.json({ appInfo: { movieCount, reviewCount, userCount } })
}

exports.getMostRated = async (req, res) => {

    const movies = await Movie.aggregate(topRatedMoviesPipeline());

    const mapMovies = async (m) => {
        const reviews = await getAverageRatings(m._id);

        return {
            id: m._id,
            title: m.title,
            reviews: { ...reviews },
        };
    };

    const topRatedMovies = await Promise.all(movies.map(mapMovies));

    res.json({ movies: topRatedMovies })
}