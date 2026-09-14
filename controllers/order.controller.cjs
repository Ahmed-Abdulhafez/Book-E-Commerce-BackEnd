const orderModel = require("../models/order.schema.cjs");
const cartModel = require("../models/cart.schema.cjs");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Get All Orders (Admin Only)
exports.getAllOrder = async (req, res) => {
  try {
    const order = await orderModel.find();

    return res
      .status(200)
      .json({ message: "Order retrieved successfully", data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get User Orders
exports.getUserOrders = async (req, res) => {
  try {
    const userOrders = await orderModel.find({ user: req.user._id }).populate({
      path: "cartItems.book",
      select: "title price images",
    });
    if (!userOrders || userOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user!" });
    }
    return res.status(200).json({
      message: "Orders retrieved successfully",
      results: userOrders.length,
      data: userOrders,
    });
  } catch (error) {
    console.log("Error getting user orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Specific Order By ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderById = await orderModel.findById(id).populate({
      path: "cartItems.book",
      select: "title price images",
    });

    if (!orderById) {
      return res.status(404).json({ message: "Order not found!" });
    }

    if (
      orderById.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this order!",
      });
    }

    return res.status(200).json({
      message: "Order retrieved successfully",
      data: orderById,
    });
  } catch (error) {
    console.log("Error getting order by id:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create New Order
exports.createNewOrder = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { shippingAddress } = req.body;

    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found!" });
    }

    const newOrder = await orderModel.create({
      user: req.user._id,
      cartItems: cart.cartItems,
      shippingAddress: shippingAddress,
      totalOrderPrice: cart.totalCartPrice,
      paymentMethodType: "cash",
    });

    if (newOrder) {
      await cartModel.findByIdAndDelete(cartId);
    }
    return res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.log("Error creating order:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Order to Paid
exports.updateOrderToPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    return res.status(200).json({
      message: "Order payment status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.log("Error updating payment status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Order to Delivered
exports.updateOrderToDelivered = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    return res.status(200).json({
      message: "Order delivery status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.log("Error updating delivery status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Stripe Checkout

exports.createCheckoutSession = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found!" });
    }

    const totalOrderPrice = cart.totalCartPrice;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // نوع الدفع (فيزا/ماستركارد)
      mode: "payment",
      customer_email: req.user.email, // إيميل العميل (عشان توصله فاتورة)
      client_reference_id: cartId, // بنشيل الـ ID بتاع السلة هنا عشان هنحتاجه بعدين في الـ Webhook

      // بنحط عنوان الشحن في الـ metadata عشان منضيعهوش لما يروح لصفحة الدفع
      metadata: {
        shippingAddress: JSON.stringify(req.body.shippingAddress),
      },

      // تفاصيل الفاتورة اللي هتظهر للعميل في صفحة الدفع
      line_items: [
        {
          price_data: {
            currency: "egp", // العملة (ممكن تخليها usd)
            product_data: {
              name: `Order for User: ${req.user.name}`,
            },
            // Stripe بيتعامل بالـ قروش (Cents) مش بالجنيه الكامل، فلازم نضرب في 100
            unit_amount: totalOrderPrice * 100,
          },
          quantity: 1,
        },
      ],

      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/cart",
    });

    // 4. بنرد على الفرونت إند ببيانات الجلسة (وأهم حاجة رابط الدفع url)
    return res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    console.log("Error creating checkout session:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// دالة الـ Webhook (لاستقبال تأكيد الدفع من Stripe)
// ==========================================
exports.webhookCheckout = async (req, res) => {
  const stripeSignature = req.headers["stripe-signature"];
  let event;

  try {
    // 1. التأكد إن الطلب جاي من سترايب فعلاً (تشفير أمني)
    event = stripe.webhooks.constructEvent(
      req.body,
      stripeSignature,
      process.env.STRIPE_WEBHOOK_SECRET, // مفتاح سري جديد هنجيبه كمان شوية
    );
  } catch (err) {
    console.log(`⚠️ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. لو الدفع تم بنجاح
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // استخراج البيانات اللي كنا مخبينها في الجلسة
    const cartId = session.client_reference_id;
    const userEmail = session.customer_email;
    const shippingAddress = JSON.parse(session.metadata.shippingAddress);

    try {
      // جلب السلة واليوزر
      const cart = await cartModel.findById(cartId);
      const user = await userModel.findOne({ email: userEmail });

      if (cart && user) {
        // إنشاء الأوردر
        const newOrder = await orderModel.create({
          user: user._id,
          cartItems: cart.cartItems,
          shippingAddress: shippingAddress,
          totalOrderPrice: cart.totalCartPrice,
          paymentMethodType: "card", // دفع أونلاين
          isPaid: true, // مدفوع جاهز
          paidAt: Date.now(),
        });

        if (newOrder) {
          // تحديث المخزن (تقليل الكمية وزيادة المبيعات)
          const bulkOptions = cart.cartItems.map((item) => ({
            updateOne: {
              filter: { _id: item.book },
              update: {
                $inc: { quantity: -item.quantity, sold: +item.quantity },
              },
            },
          }));
          await bookModel.bulkWrite(bulkOptions);

          // مسح السلة
          await cartModel.findByIdAndDelete(cartId);
        }
      }
    } catch (error) {
      console.log("Error processing webhook order:", error);
    }
  }

  // 3. لازم نرد على سترايب بـ 200 عشان يعرف إننا استلمنا الرسالة وميبعتهاش تاني
  res.status(200).json({ received: true });
};
