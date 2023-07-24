const UserModel = require("../models/user");

const createUser =  async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = new UserModel({ name, email, password })

    await newUser.save()

    res.json({ user: newUser });
}

module.exports = createUser;


