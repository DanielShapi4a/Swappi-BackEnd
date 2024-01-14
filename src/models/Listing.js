const mongoose = require("mongoose");
const User = require("./User");

const listingSchema = new mongoose.Schema({
  id : mongoose.Types.ObjectId,

  sellerID : {
    type : User,
  },

  eventID : {
    type : Event,
  },

  ticketPrice : {
    type : Float32Array,
  },

  status : { 
    type : String,
  }
});

module.exports = mongoose.model("Listing", listingSchema);