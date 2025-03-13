const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  // Extract checkoutItems, shippingAddress, paymentMethod, and totalPrice from the request body.
  // We'll pass totalPrice as itemsPrice since the schema expects that field.
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "no items in checkout" });
  }
  try {
    // Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });

    console.log(`Checkout created for user: ${req.user._id}`);

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error("Error updating checkout payment status", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // If paidAt exists but ispaid is false, update ispaid to true.
    if (!checkout.ispaid && checkout.paidAt) {
      console.log("Updating checkout: marking ispaid as true because paidAt exists.");
      checkout.ispaid = true;
      await checkout.save();
    }

    if (checkout.ispaid && !checkout.isFinalized) {
      // Map checkout.checkoutItems to ensure each item has a quantity field.
      const orderItems = checkout.checkoutItems.map(item => {
        // If quantity is not provided, default to 1.
        return { ...item, quantity: item.quantity !== undefined ? item.quantity : 1 };
      });

      // Create final order based on the checkout details.
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.itemsPrice, // Ensure this matches your Checkout schema (itemsPrice vs. totalPrice)
        paidAt: checkout.paidAt,
        isPaid: true,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      // Mark the checkout as finalized.
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      // Delete the cart associated with the user.
      await Cart.findOneAndDelete({ user: checkout.user });
      return res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    } else {
      console.log("Checkout is not paid. Details:", {
        ispaid: checkout.ispaid,
        paidAt: checkout.paidAt,
        checkoutId: checkout._id,
      });
      return res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (error) {
    console.error("Error finalizing checkout", error);
    return res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
