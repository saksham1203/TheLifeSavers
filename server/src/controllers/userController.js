const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const moment = require("moment");
const Review = require("../models/Review");
require("dotenv").config();

const { JWT_SECRET, EMAIL_USER, EMAIL_PASS, JWT_EXPIRES_IN = "1h" } = process.env;

// Setup Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Temporary store for OTPs
let otpStore = {};

// Register a new user
exports.registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
    bloodGroup,
    gender,
    availability,
    country,
    state,
    district,
    city,
    termsAccepted,
  } = req.body;

  if (!email || !password || !firstName || !lastName || !mobileNumber) {
    return res.status(400).json({ msg: "Required fields are missing." });
  }

  try {
    // Check if user already exists by email or mobile number
    let user = await User.findOne({ $or: [{ email }, { mobileNumber }] });

    if (user) {
      return res.status(400).json({ msg: "User already exists." });
    }

    // Create a new user instance
    user = new User({
      firstName,
      lastName,
      email,
      password,
      mobileNumber,
      bloodGroup,
      gender,
      availability,
      country,
      state,
      district,
      city,
      termsAccepted,
    });

    // Hash password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Respond with success message
    res.status(201).json({ msg: "User registered successfully." });
  } catch (err) {
    console.error("Error in registerUser:", err.message);
    res.status(500).send("Server error.");
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ msg: "Email/mobile number and password are required." });
  }

  try {
    // Check if user exists by email or mobile number
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobileNumber: identifier }],
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Create JWT token
    const payload = {
      user: { id: user.id },
    };

    // Return response with JWT and user data
    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, (err, token) => {
      if (err) throw err;
      res.json({ token, user });
    });
  } catch (err) {
    console.error("Error in loginUser:", err.message);
    res.status(500).send("Server error.");
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!updates) {
    return res.status(400).json({ msg: "Update fields are required." });
  }

  try {
    // Find user by ID and update their details
    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    res.json({ msg: "User updated successfully.", user });
  } catch (err) {
    console.error("Error in updateUser:", err.message);
    res.status(500).send("Server error.");
  }
};

// Verify user password
exports.verifyPassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;

  if (!password) {
    return res.status(400).json({ msg: "Password is required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    return res.json({ isValid: isMatch });
  } catch (err) {
    console.error("Error in verifyPassword:", err.message);
    res.status(500).send("Server error.");
  }
};

// Forgot password - Send OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User with this email does not exist." });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update user with OTP and expiration time
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = otpExpirationTime;
    await user.save();

    const expirationTimeFormatted = moment(otpExpirationTime).format("MMMM Do YYYY, h:mm:ss a");

    // Send OTP email
    const mailOptions = {
      to: user.email,
      from: EMAIL_USER,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fff;">
          <div style="text-align: center; padding: 20px 0;">
            <img src="https://e7.pngegg.com/pngimages/831/443/png-clipart-donate-blood-text-illustration-blood-donation-fo-guang-shan-singapore-blood-donation-of-medical-material-love-miscellaneous-thumbnail.png" alt="Logo" style="width: 100px; border-radius: 50%;">
            <h1 style="color: #d9534f;">Life Savers</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <h2 style="color: #d9534f; text-align: center;">Password Reset OTP</h2>
            <p style="font-size: 16px; color: #333;">Dear ${user.firstName},</p>
            <p style="font-size: 16px; color: #333;">You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
            <p style="font-size: 16px; color: #333;">Your OTP for password reset is:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="display: inline-block; padding: 10px 20px; font-size: 24px; color: #d9534f; border: 2px solid #d9534f; border-radius: 5px;">${otp}</span>
            </div>
            <p style="font-size: 16px; color: #333;">This OTP is valid until ${expirationTimeFormatted} (only for 10 minutes).</p>
            <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <p style="font-size: 16px; color: #333;">Thank you,</p>
            <p style="font-size: 16px; color: #333;">The Life Savers Team</p>
          </div>
          <div style="text-align: center; padding: 10px 0; color: #888; font-size: 12px;">
            <p>&copy; 2024 Blood Donor. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Error sending OTP email:", err);
        return res.status(500).send("Server error.");
      }
      res.status(200).json({ msg: "OTP sent to email." });
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err.message);
    res.status(500).send("Server error.");
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ msg: "All fields are required." });
  }

  try {
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired OTP." });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ msg: "New password cannot be the same as the current password." });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ msg: "Password has been reset." });
  } catch (err) {
    console.error("Error in resetPassword:", err.message);
    res.status(500).send("Server error.");
  }
};

// Filter users based on query parameters
exports.filterUsers = async (req, res) => {
  try {
    const { bloodGroup, country, state, district, city } = req.query;
    const query = {};

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (country) query.country = country;
    if (state) query.state = state;
    if (district) query.district = district;
    if (city) query.city = city;

    const users = await User.find(query);
    if (users.length === 0) {
      return res.status(404).json({ msg: "No users found with the specified details." });
    }

    res.json(users);
  } catch (err) {
    console.error("Error in filterUsers:", err.message);
    res.status(500).send("Server error.");
  }
};

// Send OTP for email verification
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required." });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpirationTime = Date.now() + 10 * 60 * 1000;

    otpStore[email] = { otp, expiresAt: otpExpirationTime };

    const expirationTimeFormatted = moment(otpExpirationTime).format("MMMM Do YYYY, h:mm:ss a");

    // Send OTP to email
    const mailOptions = {
      to: email,
      from: EMAIL_USER,
      subject: "Your Email OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fff;">
          <div style="text-align: center; padding: 20px 0;">
            <img src="https://e7.pngegg.com/pngimages/831/443/png-clipart-donate-blood-text-illustration-blood-donation-fo-guang-shan-singapore-blood-donation-of-medical-material-love-miscellaneous-thumbnail.png" alt="Logo" style="width: 100px; border-radius: 50%;">
            <h1 style="color: #d9534f;">Life Savers</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <h2 style="color: #d9534f; text-align: center;">Your Email Verification OTP</h2>
            <p style="font-size: 16px; color: #333;">Dear User,</p>
            <p style="font-size: 16px; color: #333;">You are receiving this OTP to verify your email address.</p>
            <p style="font-size: 16px; color: #333;">Your OTP for verification is:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="display: inline-block; padding: 10px 20px; font-size: 24px; color: #d9534f; border: 2px solid #d9534f; border-radius: 5px;">${otp}</span>
            </div>
            <p style="font-size: 16px; color: #333;">This OTP is valid until ${expirationTimeFormatted} (only for 10 minutes).</p>
            <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
            <p style="font-size: 16px; color: #333;">Thank you,</p>
            <p style="font-size: 16px; color: #333;">The Life Savers Team</p>
          </div>
          <div style="text-align: center; padding: 10px 0; color: #888; font-size: 12px;">
            <p>&copy; 2024 Blood Donor. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: "OTP sent to email." });
  } catch (err) {
    console.error("Error in sendOtp:", err.message);
    res.status(500).send("Server error.");
  }
};

// Verify OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ msg: "Email and OTP are required." });
  }

  const storedOtpData = otpStore[email];
  if (!storedOtpData || storedOtpData.otp !== otp || storedOtpData.expiresAt < Date.now()) {
    return res.status(400).json({ msg: "Invalid or expired OTP." });
  }

  // OTP is valid, remove it from store
  delete otpStore[email];
  res.status(200).json({ msg: "OTP verified successfully." });
};
