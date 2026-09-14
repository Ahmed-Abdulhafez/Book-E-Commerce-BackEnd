const express = require("express");
const router = express.Router();

const cartController = require("../controllers/carts.controllers.cjs");
const authMiddlware = require("../middlewares/auth.middleware.cjs");

// API Add book to cart
router.post("/api/carts", authMiddlware, cartController.addToCart);

// API Get My Cart
router.get("/api/carts", authMiddlware, cartController.getLoggedUserCart);

// API Clear entire cart
router.delete("/api/carts", authMiddlware, cartController.clearCart);

// API Update specific cart item quantity
router.put(
  "/api/carts/:itemId",
  authMiddlware,
  cartController.updateCartItemQuantity,
);

// API Remove specific item from cart
router.delete(
  "/api/carts/:itemId",
  authMiddlware,
  cartController.removeSpecificCartItem,
);

module.exports = router;
