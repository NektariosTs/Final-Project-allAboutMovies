const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const actorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    about: {
        type: String,
        trim: true,
        required: true,

    },
    gender: {
        type: String,
        trim: true,
        required: true,
    },
    avatar: {
        type: Object,//is object because inside we want store two things url and id
        url: String,
        public_id: String
    }
}, { timestamps: true });//mentain the time when we create or update an actor inside the database


actorSchema.index({ name: "text" });//this is the mongoose way to find a name //documantation mongoose indexes

const actorModel = mongoose.model("Actor", actorSchema);
module.exports = actorModel;