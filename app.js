require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRouter = require("./routers/users.router.cjs");
const bookRouter = require("./routers/book.router.cjs");
const categoryRouter = require("./routers/category.router.cjs");
const reviewRouter = require("./routers/review.router.cjs");
const cartRouter = require("./routers/cart.router.cjs");
const orderRouter = require("./routers/order.router.cjs");

// 🚨 1. استدعاء الكنترولر الخاص بالأوردرات عشان نستخدم الدالة هنا
const orderController = require("./controllers/order.controller.cjs");

const app = express();

app.use(cors());
// ========================================================
// 🚨 2. مسار الـ Webhook (لازم يكون هنا فوووق قبل الـ bodyParser)
// بنستخدم express.raw عشان نحافظ على التشفير
// ========================================================
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  orderController.webhookCheckout,
);

// 3. أي مسار تاني تحت السطر ده هيتحول لـ JSON عادي جداً
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const url = process.env.MONGO_DB_URL;

const connectDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(url);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error, "Database Connection Failed");
    process.exit();
  }
};
connectDb();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/", userRouter);
app.use("/", bookRouter);
app.use("/", categoryRouter);
app.use("/", reviewRouter);
app.use("/", cartRouter);
app.use("/", orderRouter);

// صائد الأخطاء العام - بيصطاد أي مشكلة ويبعتها لـ Postman
app.use((err, req, res, next) => {
  console.log("Error details:", err);
  res.status(500).json({
    message: "Server Error",
    error: err.message || err,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = app;
