const { Router } = require("express");
const router = Router();
const { cloudinary } = require("../config/cloudinary");
const productService = require("../services/categoryService");
const Category = require("../models/Category"); 


/**
 * @swagger
 * /addCategory:
 *   post:
 *     tags: [Categories]
 *     summary: Add a new category
 *     description: Adds a new category to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_Name
 *               - image
 *               - path
 *             properties:
 *               category_Name:
 *                 type: string
 *                 description: Name of the category.
 *               image:
 *                 type: string
 *                 description: Image URL for the category.
 *               path:
 *                 type: string
 *                 description: Path for the category.
 *     responses:
 *       201:
 *         description: Category added successfully.
 *       500:
 *         description: Server error.
 */
// {Post} request for add new category.
router.post("/addCategory", async (req, res) => {
  try {
    const { category_Name, image, path } = req.query;
    const newCategory = new Category({
      category_Name,
      image,
      path,
    });
    await newCategory.save();
    res.status(201).json({ message: "Category added successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * @swagger
 * /getAllCategories:
 *   get:
 *     tags: [Categories]
 *     summary: Retrieve all categories
 *     description: Retrieves a list of all categories.
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error.
 */
// {Get} request for all categories.
router.get("/getAllCategories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch(e) { 
    res.status(500).json({ message: e.message });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Retrieve a specific category
 *     description: Retrieves a category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier for the category.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the specified category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category doesn't exist.
 *       500:
 *         description: Server error.
 */
// {Get} request for specific category (filter by id).
router.get("/categories/:id", async (req, res) => {
  try {
    const categoryID = req.params.id;
    const cat = await Category.findOne({ _id: categoryID });
    if(cat)
      res.json(cat)
    else 
      res.status(404).send({ message: "Category doesn't exist :("})
  } catch(e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;