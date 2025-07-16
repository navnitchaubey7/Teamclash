
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require('../utils/sendEmail');

const generateRandomPassword = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};


exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, user: { name: user.name, email: user.email , user_id : user._id } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.forgetPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const newPassword = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await sendEmail(
      user.email,
      'Your Password has been reset',
      `Your new password is: ${newPassword}`
    );

    res.json({ message: "Password reset and email sent successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const newPassword = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await sendEmail(
      user.email,
      'Your Password has been reset',
      `Your new password is: ${newPassword}`
    );

    res.json({ message: "Password reset and email sent successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

exports.updatePassFinal = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

