const express = require("express");
const User = require("../models/User");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// Read the private key from the file
const privateKeyPath = path.join(__dirname, '..', 'keys', 'private_key.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication related endpoints.
 */



/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     description: Authenticates a user using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful, returns access and refresh tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token.
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials.
 */
// Login Method
router.post("/login", async (req, res) => {
  try { 
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Calculate expiration time for 12 hour from now
    const expiresInEightHour = Math.floor(Date.now() / 1000) + (12 * 60 * 60);

    // Generate JWT token
    const accessToken = jwt.sign({ userId: user._id }, privateKey, {
      algorithm: 'RS256',
      expiresIn: expiresInEightHour
    });

    // Generate refresh token
    const refreshToken = jwt.sign({ userId: user._id }, privateKey, {
      algorithm: 'RS256',
      expiresIn: expiresInEightHour
    });

    // Set tokenms in HTTP cookies (The cookie is not accessible via JavaScript)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + expiresInEightHour * 1000)
    });

    res.cookie('refreshToken',  refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + expiresInEightHour * 1000)
    });

    res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Password strength validation function
function isPasswordStrong(password) {
  // Ensuring the password is not too simple like '12345678'
    // At least one lowercase letter
    // At least one uppercase letter
    // At least one digit 
    // A minimum of 8 characters
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  return regex.test(password);
}

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Authentication]
 *     summary: User registration
 *     description: Registers a new user with name, email, password, and gender.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - gender
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: Password123!
 *               gender:
 *                 type: string
 *                 description: User's gender.
 *                 example: Male
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Password is not strong enough.
 *       409:
 *         description: Email already in use.
 */
// Register Method
router.post("/register", async (req, res) => {
  try {
      const { name, email, password, gender } = req.body;

      // Validate password strength
      if (!isPasswordStrong(password)) {
          return res.status(400).json({ error: "Password is not strong enough" });
      }

      // Check if email already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
          return res.status(409).json({ error: "Email already in use" });
      }

      // Create new user
      const user = new User({
          name,
          email,
          password,
          gender,
      });

      await user.save();

      res.status(201).json({ message: "User created successfully", userId: user._id });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;




    // For refresh token, you can use the same or a different private key
//     const refreshToken = jwt.sign({ userId: user._id }, privateKey, {
//       algorithm: 'RS256',
//       expiresIn: expiresInOneHour
//     });

//     res.status(200).json({ accessToken, refreshToken, user });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// daniel register function -> there is a bug with the schema i think because it cant find the existing
// router.post("/register", async (req, res) => {
//   try {
//     // Log the email received in the request body
//     console.log('Received email:', req.body.email);

//     // Check if the email already exists
//     const existingUser = await User.findOne({ email: req.body.email });
//     console.log('Existing user:', existingUser); // Log the existing user

//     if (existingUser) {
//       return res.status(400).json({ message: 'Email is already registered' });
//     }

//     // Email is not registered, proceed with creating the new user
//     const newUser = new User(req.body);
//     await newUser.save();
//     res.status(201).json({ message: 'User created successfully', user: newUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// });

//Login and generate JWT + Send User data 
// router.post("/login", async (req, res) => {
//   try { 
    
//     const { email, password } = req.body;
  
//     // Find user by email
//     const user = await User.findOne({ email });
//     // Check if user exists
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Check password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, "your_secret_key", {
//       expiresIn: "1h", // Token expiration time
//     });

//     const refreshToken = jwt.sign({ userId: user._id }, "your_refresh_key", {
//       expiresIn: "1d", // Token expiration time
//     });

//     res.status(200).json({ accessToken, refreshToken, user });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });






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