const bcrypt = require('bcryptjs');
const router = require("express").Router();
const authController = require("./src/controllers/authController");
const ticketController = require("./src/controllers/ticketController");
const userController = require("./src/controllers/userController");
const messageController = require("./src/controllers/messageController");
const categoryController = require("./src/controllers/categoryController");
const isAuth = require("./src/middlewares/isAuth");
const { getRandomProducts } = require("./src/services/ticketService");


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

router.use("/categories", categoryController);
router.use("/auth", authController);
router.use("/tickets", ticketController);
router.use("/users", userController);
router.use("/messages", messageController);

module.exports = router;