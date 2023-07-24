const express = require("express");
const mongoose = require("mongoose")
const userRouter = require("./routes/user")

const app = express();
app.use(express.json());
app.use("/api", userRouter);

app.get("/", (req, res) => {
    res.send("<h1> hello i am from your backend server</h1>")
})


mongoose
.connect("mongodb+srv://nektariostsagkaris:12345@imdb.kjh7xol.mongodb.net/IMDB?retryWrites=true&w=majority")
    .catch((error) => console.log(error))
app.listen(8000, () => console.log("Server connected."))
