const userModel = require("../models/user.schema.cjs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Create new user
exports.register = async (req, res) => {
  try {
    const { phone, age, username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(String(password), 10);
    let newUser = new userModel({
      phone,
      age,
      username,
      email,
      password: hashedPassword,
    });

    let user = await newUser.save();
    return res.status(201).json({
      message: "User registered successfully",
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    console.log("Error in register controller", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    let user = await userModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      message: "User logged in successfully",
      user: { name: user.username, email: user.email, role: user.role },
      token: token,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// GET All Users
exports.getAllUsers = async (req, res) => {
  try {
    const useres = await userModel.find();
    return res
      .status(200)
      .json({ message: "Useres retrieved successfully", data: useres });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res.status(200).json({
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error getting profile:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { password, role, ...updateData } = req.body;

    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v != null)
    );

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id, 
      cleanedData,
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.log("Error updating profile:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res
      .status(200)
      .json({ message: "User retrieved successfully", user: user });
  } catch (error) {
    console.log("Error getting user by ID:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};
