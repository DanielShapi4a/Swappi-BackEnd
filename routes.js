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

/**
 * @swagger
 *  tags:
 *    name: Routes.js FILE
 *    description: root endpoints.
 * 
 * /categories:
 *   get:
 *     tags: [Routes.js FILE]
 *     summary: Route to categories.
 *     description: Route to display all categories.
 */
router.use("/categories", categoryController);

/**
 * @swagger
 *  tags:
 *    name: Routes.js FILE
 *    description: root endpoints.
 * 
 * /auth:
 *   get:
 *     tags: [Routes.js FILE]
 *     summary: Auth route
 *     description: Authentication to the website.
 */
router.use("/auth", authController);

/**
 * @swagger
 *   tags:
 *    name: Routes.js FILE
 *    description: root endpoints.
 * 
 * /tickets:
 *   get:
 *     tags: [Routes.js FILE]
 *     summary: All tickets page router.
 *     description: All tickets page router.
 */
router.use("/tickets", ticketController);

/**
 * @swagger
 *  tags:
 *    name: Routes.js FILE
 *    description: root endpoints.
 *  
 * /users:
 *   get:
 *     tags: [Routes.js FILE]
 *     summary: User router for requests.
 *     description: User router for requests.
 */
router.use("/users", userController);

/**
 * @swagger
 *  tags:
 *    name: Routes.js FILE
 *    description: root endpoints.
 * 
 * /messages:
 *   get:
 *     tags: [Routes.js FILE]
 *     summary: Messages page router.
 *     description: Messages page router.
 */
router.use("/messages", messageController);

module.exports = router;