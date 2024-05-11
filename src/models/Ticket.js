const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    trim: true,
    minlength: [3, "Title should be at least 3 characters long"],
    maxlength: [50, "Title cannot be more than 50 characters long"],
  },
  category: {
    type: String,
    required: [true, "Category is required."],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Description is required."],
    minlength: [10, "Description should be at least 10 characters long"],
    maxlength: [1000, "Description can't exceed 1000 characters long"],
  },
  price: {
    type: Number,
    required: [true, "Price is required."]
  },
  location: {
    type: String,
    required: [true, "Location is required."],
    trim: true,
  },
  image: {
    type: String,
  },
  eventDateTime: {
    type: Date,
    required: [true, "Event date and time are required."]
  },
  addedAt: {
    type: Date,
    default: Date.now,
    required: [true, "Added date is required."]
  },
  seller: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Seller information is required."]
  },
  // ticketPDF: {
  //   type: 
  // },
  active: {
    type: Boolean,
    default: true,
  },
});

productSchema.index({ eventDateTime: 1, location: 1, seller: 1, title: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Ticket", productSchema);