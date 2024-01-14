const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  id : mongoose.Types.ObjectId,

  category_Name : {
    type : String,
    required: true,
  },

  image : {
    type : String,
  },

  path : { 
    type : String,
  },
});

module.exports = mongoose.model("Category", categorySchema);