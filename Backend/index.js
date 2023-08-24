const express = require("express");
const mongoose = require("mongoose")
const userRouter = require("./routes/user")
const actorRouter = require("./routes/actor")
const movieRouter = require("./routes/movie");
const reviewRouter = require("./routes/review");
const adminRouter = require("./routes/admin");
const { errorHandler } = require("./middlewares/error")
const cors = require("cors");
const { handleNotFound } = require("./utils/helper");
require("express-async-errors") // handle the errors with out try catch in node 
require("dotenv").config()

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);
app.use("/*", handleNotFound);
app.use(errorHandler);//function for error handling

// app.post("/sign-in",
//     (req, res, next) => {
//       const {email , password} = req.body;
//       if (!email || !password)
//       return res.json({msg:"email/password missing!"});
//         next();
//     },
//     (req, res) => {
//         res.send("<h1> hello i am from  about</h1>")
//     })


mongoose
    .connect("mongodb+srv://nektariostsagkaris:12345@imdb.kjh7xol.mongodb.net/IMDB?retryWrites=true&w=majority")
    .catch((error) => console.log(error))
app.listen(8000, () => console.log("Server connected."))
