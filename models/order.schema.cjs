const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 1. مين صاحب الطلب؟
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },

    // 2. إيه هي الكتب اللي اشتراها؟ (هناخد نسخة من السلة)
    cartItems: [
      {
        book: {
          type: mongoose.Schema.ObjectId,
          ref: "Book",
        },
        quantity: Number,
        price: Number, // 💡 تريكة مهمة: بنسجل السعر هنا عشان لو سعر الكتاب اتغير بعدين، الفاتورة دي ماتتأثرش
      },
    ],

    // 3. عنوان الشحن ورقم التليفون
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
    },

    // 4. السعر الإجمالي للطلب
    totalOrderPrice: {
      type: Number,
    },

    // 5. طريقة الدفع (كاش عند الاستلام ولا فيزا)
    paymentMethodType: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },

    // 6. حالة الدفع
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date, // تاريخ الدفع

    // 7. حالة التوصيل
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date, // تاريخ التوصيل
  },
  { timestamps: true } // عشان يسجل تاريخ إنشاء الطلب (createdAt)
);

module.exports = mongoose.model("Order", orderSchema);