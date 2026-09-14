const cartModel = require("../models/cart.schema.cjs");
const bookModel = require("../models/book.schema.cjs");
const { calcTotalCartPrice } = require("../utils/cart.utils.cjs");

// Add book to cart
exports.addToCart = async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await bookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }
    let cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
      cart = await cartModel.create({
        user: req.user._id,
        cartItems: [{ book: book._id, price: book.price, quantity: 1 }],
        totalCartPrice: book.price,
      });
      return res
        .status(201)
        .json({ message: "Cart created and book added", cart: cart });
    }
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.book.toString() === bookId,
    );

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity += 1;
    } else {
      cart.cartItems.push({ book: book._id, price: book.price, quantity: 1 });
    }

    calcTotalCartPrice(cart);
    await cart.save();

    return res
      .status(200)
      .json({ message: "Book added to cart successfully", cart: cart });
  } catch (error) {
    console.log("Error adding to cart:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};


// Get logged user cart
exports.getLoggedUserCart = async (req, res) => {
  try {
    const cart = await cartModel
      .findOne({ user: req.user._id })
      .populate("cartItems.book");

    if (!cart) {
      return res
        .status(404)
        .json({ message: "There is no cart for this user" });
    }
    return res
      .status(200)
      .json({ message: "Cart retrieved successfully", cart: cart });
  } catch (error) {
    console.log("Error getting user cart:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


// Update specific cart item quantity
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // 2. نجيب سلة المستخدم
    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.book.toString() === itemId,
    );

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    calcTotalCartPrice(cart);
    await cart.save();

    return res.status(200).json({
      message: "Cart item quantity updated successfully",
      cart: cart,
    });
  } catch (error) {
    console.log("Error updating cart item:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};


// Remove specific item from cart
exports.removeSpecificCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    let cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => item.book.toString() !== itemId,
    );

    calcTotalCartPrice(cart);
    await cart.save();

    return res.status(200).json({
      message: "Item removed successfully",
      cart: cart,
    });
  } catch (error) {
    console.log("Error removing item from cart:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};


// Clear logged user cart
exports.clearCart = async (req, res) => {
  try {
    await cartModel.findOneAndDelete({ user: req.user._id });

    return res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.log("Error clearing cart:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
