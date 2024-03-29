const { Router } = require("express");
const router = Router();
const { cloudinary } = require("../config/cloudinary");
const productService = require("../services/categoryService");
const Category = require("../models/Category"); 

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

// {Get} request for all categories.
router.get("/getAllCategories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch(e) { 
    res.status(500).json({ message: e.message });
  }
});

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