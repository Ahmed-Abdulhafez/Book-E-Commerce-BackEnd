const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller.cjs");

const authMiddlware = require("../middlewares/auth.middleware.cjs");
const { isAdmin } = require("../middlewares/isAdmin.middleware.cjs");

// API GET All Category
router.get("/api/categorys", categoryController.getAllCategory);

// API Create Category
router.post("/api/categorys",authMiddlware, isAdmin, categoryController.createCategory);

// API Deleted Category
router.delete("/api/categorys/:id",authMiddlware, isAdmin, categoryController.deletedCategory);

// API update Category
router.put("/api/categorys/:id",authMiddlware, isAdmin, categoryController.updateCategory);

// GET Category By Id
router.get("/api/categorys/:id" , categoryController.getCategoryById);



module.exports = router;
