const express = require("express");
const userController = require("../controllers/users.controller.cjs");
const router = express.Router();
const authMiddlware = require("../middlewares/auth.middleware.cjs");
const { isAdmin } = require("../middlewares/isAdmin.middleware.cjs");

// API register
router.post("/api/users/register", userController.register);

// API login
router.post("/api/users/login", userController.login);

// API GET All Users
router.get("/api/users", authMiddlware, isAdmin, userController.getAllUsers);

// API GET Profile
router.get("/api/users/profile", authMiddlware, userController.getProfile);

// API Update Profile
router.put("/api/users/profile", authMiddlware, userController.updateProfile);

// API Get a user by ID
router.get("/api/users/:id", authMiddlware, isAdmin, userController.getUserById);

// API Delete User
router.delete("/api/users/:id", authMiddlware, isAdmin, userController.deleteUser);



module.exports = router;
