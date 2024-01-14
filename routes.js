const router = require("express").Router();
const authController = require("./src/controllers/authController");
const productController = require("./src/controllers/productController");
const userController = require("./src/controllers/userController");
const messageController = require("./src/controllers/messageController");
const isAuth = require("./src/middlewares/isAuth");
const { getRandomProducts } = require("./src/services/productService");

router.get("/", (req, res) => {
  res.send("Server is running ▶️");
});

router.get("/random", async (req, res) => {
  try {
    let products = await getRandomProducts();
    res.send(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.use("/auth", authController);
router.use("/products", productController);
router.use("/user", userController);
router.use("/messages", messageController);

module.exports = router;
