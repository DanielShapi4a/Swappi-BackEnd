const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.query);
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
});


// Login and generate JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.query;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h", // Token expiration time
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;





// const router = require("express").Router();
// const authService = require("../services/authService");
// // const isAuth = require('../middlewares/isAuth');
// // const isGuest = require('../middlewares/isGuest');
// const { SECRET, COOKIE_NAME } = require("../config/config");
// const jwt = require("jsonwebtoken");

// router.post("/register", async (req, res) => {
//   try {
//     let createdUser = await authService.registerUser(req.body);
//     res.status(201).json({ _id: createdUser._id });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ error: error.message });
//   }
// });

// router.post("/login", (req, res) => {
//   authService
//     .loginUser(req.body)
//     .then((token) => {
//       jwt.verify(token, SECRET, (err, decoded) => {
//         if (err) {
//           res.clearCookie(COOKIE_NAME);
//         } else {
//           req.user = decoded;
//           res.status(200).cookie(COOKIE_NAME, token, { sameSite: "none", secure: true, httpOnly: true }).json({ user: decoded });
//         }
//       });
//     })
//     .catch((error) => res.status(500).json({ error: error }));
// });

// router.get("/logout", (req, res) => {
//   res.clearCookie(COOKIE_NAME);
//   res.status(200).json({ message: "Successfully logged out" });
// });

// router.get("/getUser", async (req, res) => {
//   if (req.user) {
//     let user = await authService.getUser(req.user._id);
//     res.status(200).json({
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         createdSells: user.createdSells.length,
//         avatar: user.avatar,
//         admin: user.admin,
//       },
//     });
//   } else {
//     res.status(200).json({ message: "Not logged in" });
//   }
// });

// module.exports = router;
