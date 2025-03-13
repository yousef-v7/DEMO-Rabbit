const express = require("express");
const Subscriber = require("../models/Subscriber");

const router = express.Router();

// @route POST /api/subscribers
// @desc Create a new subscriber
// @access Public
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if the email is already subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: "Email is already subscribed" });
    }

    // Define normalizedEmail to fix the error
    const normalizedEmail = email;

    // Create a new subscriber with proper variable declaration
    subscriber = new Subscriber({ email: normalizedEmail });
    await subscriber.save();

    // Return a success response
    res
      .status(201)
      .json({ message: "Successfully subscribed to the newsletter!" });
  } catch (error) {
    console.error("Error checking subscription:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// @route GET /api/subscribers
// @desc Get all subscribers
// @access Private/Admin
// router.get("/", protect, admin, async (req, res) => {
//   try {
//     const subscribers = await Subscriber.find({});
//     res.json(subscribers);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// @route DELETE /api/subscribers/:id
// @desc Delete a subscriber
// @access Private/Admin
// router.delete("/:id", protect, admin, async (req, res) => {
//   try {
//     const subscriber = await Subscriber.findById(req.params.id);

//     if (!subscriber) {
//       return res.status(404).json({ message: "Subscriber not found" });
//     }

//     await subscriber.remove();
//     res.json({ message: "Subscriber removed" });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// });

module.exports = router;
