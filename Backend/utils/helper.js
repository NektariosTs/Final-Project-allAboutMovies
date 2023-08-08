const crypto = require("crypto");
//Generates cryptographically strong pseudorandom data. The size argument is a number indicating the number of bytes to generate.
//i use crypto from nodejs because generates randomData or bytes to reset password token because the reset password token needs to be unique

exports.sendError = (res, error, statusCode = 401) =>
    res.status(statusCode).json({ error });

exports.generateRandomByte = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(30, (err, buff) => {
            if (err) reject(err);
            const buffString = buff.toString("hex")

            resolve(buffString)
        });
    });
};

exports.handleNotFound = (req, res) => {
    this.sendError(res, "Not found", 404);
};
//parse all the data if there is any data from these tags
exports.parseData = (req, res, next) => {
    const { trailer, cast, genres, tags, writers } = req.body
    if (trailer) req.body.trailer = JSON.parse(trailer);
    if (cast) req.body.cast = JSON.parse(cast);
    if (genres) req.body.genres = JSON.parse(genres);
    if (tags) req.body.tags = JSON.parse(tags);
    if (writers) req.body.writers = JSON.parse(writers);

    next();//will go to validator after that and validate this movie
};