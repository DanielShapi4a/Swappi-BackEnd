const router = require("express").Router();
const authController = require("./src/controllers/authController");
const ticketController = require("./src/controllers/ticketController");
const userController = require("./src/controllers/userController");
const messageController = require("./src/controllers/messageController");
const categoryController = require("./src/controllers/categoryController");
const isAuth = require("./src/middlewares/isAuth");
const { getRandomProducts } = require("./src/services/ticketService");
const bcrypt = require('bcryptjs');

router.get("/", (req, res) => {
  res.send("Server is running ▶️");
});

router.get("/random", async (req, res) => {
  try {
    let ticket = await getRandomProducts();
    res.send(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/register', async (req, res) => {
  const { username, password, email, phoneNumber } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user to the database
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    phoneNumber
  });

  await newUser.save();

  res.json({ message: 'Registration successful' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Compare the passwords
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Generate JWT
  const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

  res.json({ token });
});

router.use("/categories", categoryController);
router.use("/auth", authController);
router.use("/tickets", ticketController);
router.use("/users", userController);
router.use("/messages", messageController);

module.exports = router;