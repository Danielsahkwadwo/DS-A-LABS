const { createJWT } = require("../utils/createTokens");
const User = require("./../models/users");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }
    if (password !== confirmPassword) throw new Error("passwords do not match");
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("user already exist");
    const newUser = await User.create(req.body);
    if (!newUser) throw new Error("an error occurred while creating user");

    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("all fields are required");

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("provide valid email or password");
    }
    //confirm password
    const confirmPassword = await bcrypt.compare(password, user.password);
    if (!confirmPassword) throw new Error("invalid credentials");

    const token = createJWT(user._id);
    //storing the JWT in session
    req.session.jwt = token;

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        throw new Error("an error occurred while loggin out");
      } else {
        res.redirect("/login");
      }
    });
  } catch (error) {
    next(error);
  }
};
