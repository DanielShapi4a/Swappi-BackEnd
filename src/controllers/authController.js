const express = require("express");
const User = require("../models/User");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const NodeRSA = require('node-rsa');
const router = express.Router();

// Initialize cookie-parser middleware
router.use(cookieParser());

// Read the private key from the file
const privateKeyPath = path.join(__dirname, '..', 'keys', 'private_key.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

// Function to generate public key from private key
const getPublicKey = (privateKey) => {
    const key = new NodeRSA(privateKey);
    return key.exportKey('public');
};

const publicKeyString = getPublicKey(privateKey);

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
    const expiresInTwelveHour = Math.floor(Date.now() / 1000) + (12 * 60 * 60);
    // Calculate expiration time for a week from now
    const expiresInAWeek = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);

    // Generate JWT token
    const accessToken = jwt.sign({ userId: user._id }, privateKey, {
      algorithm: 'RS256',
      expiresIn: expiresInTwelveHour
    });

    // Generate refresh token
    const refreshToken = jwt.sign({ userId: user._id }, privateKey, {
      algorithm: 'RS256',
      expiresIn: expiresInAWeek
    });

    // Set tokenms in HTTP cookies (The cookie is not accessible via JavaScript)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + expiresInTwelveHour * 1000)
    });

    res.cookie('refreshToken',  refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + expiresInAWeek * 1000)
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

/**
 * @swagger
 * /logout:
 *   post:
 *     tags: [Authentication]
 *     summary: User logout
 *     description: Logout user and clear his cookies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - AccessToken
 *               - RefreshToken
 *     responses:
 *       200:
 *         description: User logged out successfully.
 */
// Logout Method
router.get("/logout", (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).send("Logged out successfully");  
});

// Middleware to validate token
const validateToken = async (req, res, next) => {
  try {
      const token = req.cookies.accessToken; // Extract the token from cookies
      if (!token) {
          return res.status(401).json({ message: 'Access token is required' });
      }

      // Verify the token using the public key
      const decoded = jwt.verify(token, publicKeyString, { algorithms: ['RS256'] });
      req.user = decoded;
      next();
  } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * @swagger
 * /getUser:
 *   post:
 *     tags: [Authentication]
 *     summary: Receive the cookie and return the relevant user object.
 *     description: Receive the cookie and return the relevant user object.
 *     requestBody: Cookies
 *       required: true
 *         application/json:
 *             type: object
 *             required:
 *               - AccessToken
 *               - RefreshToken
 *     responses:
 *       200:
 *         OK (with user object)
 *       404:
 *         User not found.
 *       500: 
 *         Error fetching user data.
 * 
 */
// GET endpoint to fetch user data
router.get('/getUser', validateToken, async (req, res) => {
  try {
      const userId = req.user.userId; // Or the relevant field from the token
      const user = await User.findById(userId).select('-password');

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user data' });
  }
});

module.exports = router;