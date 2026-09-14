const bookModel = require("../models/book.schema.cjs");
const cloudinary = require("cloudinary").v2;

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page, limit } = req.query;
    let queryArgs = {};
    if (search) {
      queryArgs.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      queryArgs.category = category;
    }

    if (minPrice || maxPrice) {
      queryArgs.price = {};
      if (minPrice) queryArgs.price.$gte = Number(minPrice);
      if (maxPrice) queryArgs.price.$lte = Number(maxPrice);
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const totalBooks = await bookModel.countDocuments(queryArgs);
    const totalPages = Math.ceil(totalBooks / limitNumber);

    const books = await bookModel
      .find(queryArgs)
      .populate("category", "name")
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      message: "Books fetched successfully",
      pagination: {
        totalBooks,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
      },
      results: books.length,
      data: books,
    });
  } catch (error) {
    console.log("Error fetching books:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
// Get a book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await bookModel
      .findById(req.params.id)
      .populate("category", "name");
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }
    return res.status(200).json({
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    console.log("Error getting book by ID:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image!" });
    }

    const uploadedImages = req.files.map((file) => {
      return {
        url: file.path,
        public_id: file.filename,
      };
    });

    const bookData = {
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      images: uploadedImages,
    };

    const newBook = new bookModel(bookData);
    const savedBook = await newBook.save();
    await savedBook.populate("category", "name");

    return res.status(201).json({
      message: "Book created successfully with images",
      data: savedBook,
    });
  } catch (error) {
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        await cloudinary.uploader.destroy(file.filename);
      }
      console.log(
        "Images removed from Cloudinary due to database save failure.",
      );
    }
    console.log("Error creating book:", error);

    return res.status(500).json({
      message: "Failed to save book",
      error: error.message,
    });
  }
};

// updat Books
exports.updateBook = async (req, res) => {
  try {
    let { title, author, price, description, category } = req.body;
    let updateData = { title, author, price, description, category };

    updateData = Object.fromEntries(
      Object.entries(updateData).filter(([key, value]) => value !== undefined),
    );

    if (req.files && req.files.length > 0) {
      const book = await bookModel.findById(req.params.id);

      if (!book) {
        return res.status(404).json({ message: "Book not found!" });
      }

      if (book.images && book.images.length > 0) {
        console.log("Starting to delete old images...");

        for (let image of book.images) {
          const result = await cloudinary.uploader.destroy(image.public_id);

          console.log(`Deletion result for image ${image.public_id}:`, result);
        }
      }

      updateData.images = req.files.map((file) => {
        return {
          url: file.path,
          public_id: file.filename,
        };
      });
    }

    const updatedBook = await bookModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" },
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found!" });
    }

    return res.status(200).json({
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.log("Error updating book:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete Book
exports.deleteBook = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    if (book.images && book.images.length > 0) {
      for (let image of book.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    await bookModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Book and all its images deleted successfully" });
  } catch (error) {
    console.log("Error deleting book:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
