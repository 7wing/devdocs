const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// PATCH user profile (start verification)
router.patch("/", async (req, res) => {
  try {
    const { displayName, email } = req.body;

    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Save pending email + token
    await User.findByIdAndUpdate(req.user.id, {
      displayName,
      pendingEmail: email,
      emailVerificationToken: token,
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or SMTP provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyUrl = `https://yourapp.com/api/user/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      text: `Click this link to verify your email: ${verifyUrl}`,
    });

    res.status(200).json({ message: "Verification email sent." });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// GET verify email
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    console.error("Error verifying email:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
