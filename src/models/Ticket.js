const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId, // Match the field name with "_id"
  title: {
    type: String,
    required: ["Title is required"],
    trim: true,
    minlength: [3, "Title should be at least 3 characters long"],
    maxlength: [50, "Title can't be more than 50 characters long"], // Corrected typo
  },
  category: {
    type: String,
    required: ["Category is required"],
    validate: {
      validator: function (v) {
        return v !== "Choose..."; // Use !== instead of !=
      },
      message: "Please choose a category", // Corrected typo
    },
  },
  description: {
    type: String,
    trim: true,
    required: ["Description is required"],
    minlength: [10, "Description should be at least 10 characters long"],
    maxlength: [1000, "Description should be max 1000 characters long"], // Corrected max length
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: ["City is required"],
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    required: true,
  },
  seller: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Ticket", productSchema);
