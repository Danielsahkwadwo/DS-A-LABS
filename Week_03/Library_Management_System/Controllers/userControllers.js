const { createJWT, createCookie } = require("../Utils/createToken");
const userModel = require("./../Models/userModel");
const bcryptjs = require("bcryptjs");

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!email || !password || !name || !phone || !role) {
      throw new Error("All fields are required");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const result = await userModel.createNewUser(
      name,
      email,
      phone,
      role,
      hashedPassword,
      0
    );
    if (!result) throw new Error("an error occurred while created");
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await userModel.getAllUsers();
    if (!result) throw new Error("an error occurred while getting users");
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await userModel.login(email, password);
    if (user.length === 0)
      throw new Error("please enter a valid email or password");

    const correctPassword = await bcryptjs.compare(password, user[0].password);
    if (!correctPassword)
      throw new Error("please enter a valid email or password");

    const token = createJWT(user[0].userId);
    createCookie(res, token);

    res.status(200).json({
      status: "success",
      data: user[0],
      token: token,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("userInfo");
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
