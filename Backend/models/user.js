const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    role: {
        type: String,
        required: true,
        default: "user",
        enum: ["admin", "user"]//The enum validator is an array that will check if the value given is an item in the array. If the value is not in the array, Mongoose will throw a ValidationError when you try to save().
        //so user can be user only but he can be admin also
    },
});
//using the pre function on schema for saving to hash password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
});
//comparing the password
userSchema.methods.comparePassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;