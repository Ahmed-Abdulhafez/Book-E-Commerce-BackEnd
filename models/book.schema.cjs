const mongoose = require("mongoose");
const schema = mongoose.Schema;

const bookSchema = new schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    // 👇 الحقلين الجداد 👇
    quantity: {
      type: Number,
      required: true,
      default: 0, // لو مدخلناش كمية، يبقى صفر
    },
    sold: {
      type: Number,
      default: 0, // لسه مفيش ولا نسخة اتباعت
    },
    // 👆 الحقلين الجداد 👆
    description: { type: String, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
