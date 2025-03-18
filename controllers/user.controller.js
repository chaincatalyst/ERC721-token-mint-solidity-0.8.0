let userSchema = require("../models/user.model");

const getAllUser = async (req, res) => {
  try {
    const users = await userSchema.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch Users Data Failed" });
  }
};

module.exports = { getAllUser };
