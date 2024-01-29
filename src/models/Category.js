const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_Name: 
  {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
    unique: true,
  },

  image: 
  {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
    unique: true,
  },
  
  path: 
  {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
    unique: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;