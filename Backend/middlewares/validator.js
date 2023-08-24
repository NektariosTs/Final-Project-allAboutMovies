const { check, validationResult } = require("express-validator");
const genres = require("../utils/genres");
const { isValidObjectId } = require("mongoose");

// using the module (express-validator) to validate the new users creation in backend API,
//below i used the check method to check all the inputs with some functions 
exports.userValidator = [
    check("name").trim().not().isEmpty().withMessage("Name is missing!"),
    check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
    check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is missing!")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be 8 to 20 characters long!"),
];
//the same with the newPassword
exports.validatePassword = [
    check("newPassword")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is missing!")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be 8 to 20 characters long!")
];
//for signIn
exports.signInValidator = [
    check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
    check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is missing!")

];

exports.actorInfoValidator = [
    check("name").trim().not().isEmpty().withMessage("Actor name is missing!"),
    check("about").trim().not().isEmpty().withMessage("about message is missing!"),
    check("gender").trim().not().isEmpty().withMessage("Gender is missing!"),
]

exports.validateMovie = [
    check("title").trim().not().isEmpty().withMessage("Movie title is missing!"),
    check("storyLine").trim().not().isEmpty().withMessage("StoryLine is important!"),
    check("language").trim().not().isEmpty().withMessage("Language is missing!"),
    check("releaseDate").isDate().withMessage("Release Date is missing!"),
    check("status").isIn(["public", "private"]).withMessage("Movie status must be public or private!"),//the status want to be one of these status (public , or private)
    check("type").trim().not().isEmpty().withMessage("Movie type is missing!"),
    check("genres").isArray().withMessage("Genres must be an array of strings")
        .custom((value) => {
            for (let gen of value) {
                if (!genres.includes(gen)) throw Error("invalid Genres")
            };//we use for loop here because if we have an array of genres and the in this movie genres we have some of this genres the loop its saves and works well.if there are not this movie genres inside our array it will throw the error message,and this condition will no go to the next logic!

            return true;//we will use return because we want to move in the next logic
        }),
    check("tags").isArray({ min: 1 }).withMessage("Tags must be ab array of strings!")
        .custom((tags) => {
            for (let tag of tags) {
                if (typeof tag !== "string") throw Error("Tags must be ab array of strings!")// if the tags are not stings throw an error so we use the typeof method
            }

            return true;
        }),
    check("cast").isArray().withMessage("Cast must be an array of strings")
        .custom((cast) => {
            for (let c of cast) {
                if (!isValidObjectId(c.actor)) throw Error("invalid cast id inside cast!")
                if (!c.roleAs?.trim()) throw Error("Role as is missing")
                if (typeof c.leadActor !== "boolean") throw Error("Only accepted boolean value inside leadActor inside cast!")
            };

            return true;
        }),
    // check("trailer").isObject().withMessage("trailer must be an object with url and public_id")
    //     .custom(({ url, public_id }) => {
    //         try {
    //             const result = new URL(url)
    //             if (!result.protocol.includes("http")) throw Error("Trailer url is invalid!");

    //             const arr = url.split("/")
    //             const publicId = arr[arr.length - 1].split(".")[0];

    //             if (public_id !== publicId) throw Error("trailer public_id is invalid!");

    //             return true;
    //         } catch (error) {
    //             throw Error("Trailer url is invalid!");
    // }//this is the method to validate the url if you go to the console and put new URL(url) will see an object with lot of things, if you search you will see the protocol:https or http! and with the public id we use the split method and to split the url with the "/" and after that inside the array we use the -1 to find the id of the trailer one more split method with the . because the last is mp4

    // }),
    // check("poster")
    //     .custom((_, { req }) => {
    //         if (!req.file) throw Error("poster file is missing!");

    //         return true;
    //     }),//Underscore can be used for ignoring function parameters. For example, you may define a function that requires parameters, but you don’t intend to use all of them at that time.
];

exports.validateTrailer = check("trailer")
    .isObject()
    .withMessage("trailer must be an object with url and public_id")
    .custom(({ url, public_id }) => {
        try {
            const result = new URL(url)
            if (!result.protocol.includes("http")) throw Error("Trailer url is invalid!");

            const arr = url.split("/")
            const publicId = arr[arr.length - 1].split(".")[0];

            if (public_id !== publicId) throw Error("trailer public_id is invalid!");

            return true;
        } catch (error) {
            throw Error("Trailer url is invalid!");
        };//this is the method to validate the url if you go to the console and put new URL(url) will see an object with lot of things, if you search you will see the protocol:https or http! and with the public id we use the split method and to split the url with the "/" and after that inside the array we use the -1 to find the id of the trailer one more split method with the . because the last is mp4

    }),

    exports.validateRatings = check(
        "rating",
        "Rating must be a number between one 0 and 10")
        .isFloat({ min: 0, max: 10 });

//use this middleware to see the result validation at postman
//validationResult creates a function that uses provided options as the defaults in the returned Result object
exports.validate = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length) {
        return res.json({ error: error[0].msg });
    }

    next();
};