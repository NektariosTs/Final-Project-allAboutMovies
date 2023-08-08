//Cleaner Code
//i create this file because i want to save here the url("http://localhost:8000/api") one time and i don t want to write all this url every time that i use axios methods like get , post , delete etc.
//so every time that i will use the axios methods (for example i will replace the ("http://localhost:8000/api") with client.post("/user-create"))

import axios from "axios";

const client = axios.create({ baseURL: "http://localhost:8000/api" })

export default client;