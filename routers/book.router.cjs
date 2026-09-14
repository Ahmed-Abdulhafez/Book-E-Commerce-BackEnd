const express = require("express");
const router = express.Router();

const bookController = require("../controllers/books.controller.cjs");
const upload = require("../middlewares/upload.middleware.cjs");

const authMiddlware = require("../middlewares/auth.middleware.cjs");
const { isAdmin } = require("../middlewares/isAdmin.middleware.cjs");

// API get all books
router.get("/api/books", bookController.getAllBooks);

// Create a new book
router.post(
  "/api/books",
  authMiddlware,
  isAdmin,
  upload.array("images", 5),
  bookController.createBook,
);

// API get book by id
router.get("/api/books/:id", bookController.getBookById);

// API Update a book by ID
router.put(
  "/api/books/:id",
  authMiddlware,
  isAdmin,
  upload.array("images", 5),
  bookController.updateBook,
);

// API Delete a book by ID
router.delete(
  "/api/books/:id",
  authMiddlware,
  isAdmin,
  bookController.deleteBook,
);

module.exports = router;
