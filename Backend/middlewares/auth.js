const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/helper");
const UserModel = require("../models/user");

exports.isAuth = async (req, res, next) => {
  const token = req.headers?.authorization;

  if (!token) return sendError(res, "Invalid token!");
  const jwtToken = token.split("Bearer ")[1];

  if (!jwtToken) return sendError(res, "Invalid token!");
  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const { userId } = decode;

  const user = await UserModel.findById(userId);
  if (!user) return sendError(res, "unauthorized access!");

  req.user = user;

  next();
};

// we have to know if the user is admin or not, so we check if the user is signed in or not 
exports.isAdmin = (req, res, next) => {
    const { user } = req;
    if (user.role !== "admin") return sendError(res, "unauthorized access!");//if the user.role is not equal to admin then send the error

    next();
}