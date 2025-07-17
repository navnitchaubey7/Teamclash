const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const {registerUser,loginUser,forgetPasswordOTP,updatePassFinal} = require("../controllers/authController");

const verifyToken = require("../middlewares/verifyToken");

// 🔓 Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgetpassotp", forgetPasswordOTP);
router.post("/verifyotp", loginUser); // TODO: Yeh actual verifyOTP function hona chahiye
router.post("/updatepassfinal", updatePassFinal);


// 🔐 Protected Route (JWT token check karega)
router.get("/navbar" , verifyToken , async(req , res)=>{
    try {
    const userId =req.user.userId; // decoded JWT me id aayi thi
    const user = await User.findOne({ _id: userId })

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Access granted",
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
})
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId =req.user.userId;
    const user = await User.findOne({ _id: userId })

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Access granted",
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// 🔗 Google Auth Start
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("https://teamclash.onrender.com/profile"); // ✅ Redirect to frontend
  }
);

module.exports = router;
