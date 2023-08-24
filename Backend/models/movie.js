const mongoose = require("mongoose");
const genres = require("../utils/genres");


const movieSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    storyLine: {
        type: String,
        trim: true,
        required: true,
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,//we store only the object id because we can use this objectid later if we want to fetch this director order
        ref: "Actor",
    },
    releaseDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["public", "private"]// we use enum because we want only accept one of this two values {everyone or admin}
    },
    type: {
        type: String,
        required: true,
    },
    genres: {
        type: [String],
        required: true,
        enum: genres,//we have the values of the array in genres
    },
    tags: {
        type: [String],
        required: true,
    },
    cast: [
        {
            actor: { type: mongoose.Schema.Types.ObjectId, ref: "Actor" },
            roleAs: String,
            leadActor: Boolean,
        },
    ],
    writers: [
        {
            type: mongoose.Schema.Types.ObjectId,
             ref: "Actor"

        }
    ],
    poster: {
        type: Object,//is object because inside we want store two things url and id
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        responsive: [URL],
        required: true
    },
    trailer: {
        type: Object,//is object because inside we want store two things url and id
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        required: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    language: {
        type: String,
        required: true
    },
},
 { timestamps: true });//whenever we want to fetch those latest movies or the latest uploads

module.exports = mongoose.model("Movie", movieSchema);

//cast = [{ actor: ObjectId("12345"), roleAs: "Ethen", leadActor: true }]//we use the leadActor with boolean because when we render single movie inside in the frontend app we will render leeadactor on the top //if we want see the profile of the actor(with objectid), we can use the objectid