const { sendError } = require("../utils/helper");
const cloudinary = require('cloudinary').v2;
const Movie = require("../models/movie");
const { isValidObjectId } = require("mongoose");

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
      res.status(201).json({ url , public_id});//send this url and public_id inside frontend
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

    // console.log(req.body);
    // console.log(typeof req.body.trailerInfo);
    // console.log(typeof req.body.cast);
    // console.log(typeof req.body.writers);
    // console.log(typeof req.body.tags);
    // console.log(typeof req.body.genres);

    // res.send("ok");

    const newMovie = new Movie({
        title,
        storyLine,
        releaseDate,
        status,
        type,
        genres,
        tags,
        cast,
        poster,
        trailer,
        language,
    })
    //manage the director because we havent director in the newMovie variable with id
    if (director) {
        if (isValidObjectId(director)) return sendError(res, "invalid director id!")
        newMovie.director = director
    }
    //manage the writers and we  use for loop because this writers will be in array
    if (writers) {
        for (let writerId of writers) {
            if (isValidObjectId(writerId)) return sendError(res, "invalid writer id!")
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

    if (isValidObjectId(movieId)) return sendError(res, "invalid Movie id")

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
        if (isValidObjectId(director)) return sendError(res, "invalid director id!")
        movie.director = director
    }
    //manage the writers and we  use for loop because this writers will be in array
    if (writers) {
        for (let writerId of writers) {
            if (isValidObjectId(writerId)) return sendError(res, "invalid writer id!")
        }
        movie.writers = writers;
    }

    await movie.save()

    res.json({ message: " Movie is updated", movie })

}

exports.updateMovieWithPoster = async (req, res) => {
    const { movieId } = req.params;

    if (isValidObjectId(movieId)) return sendError(res, "invalid Movie id");

    if (!req.file) return sendError(res, "Movie poster is missing!")

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
        if (isValidObjectId(director)) return sendError(res, "invalid director id!")
        movie.director = director
    }
    //manage the writers and we  use for loop because this writers will be in array
    if (writers) {
        for (let writerId of writers) {
            if (isValidObjectId(writerId)) return sendError(res, "invalid writer id!")
        }
        movie.writers = writers;
    }

    //update poster
    //removing poster from cloud if there is any
    const posterId = movie.poster?.public_id //? = optional
    if (posterId) {
        const { result } = cloudinary.uploader.destroy(posterId);
        if (result !== "ok") {
            return sendError(res, "Could not update poster at the moment!")
        }
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



    await movie.save();

    res.json({ message: " Movie is updated", movie });
};

exports.removeMovie = async (req, res) => {
    const { movieId } = req.params;

    if (isValidObjectId(movieId)) return sendError(res, "invalid Movie id");

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