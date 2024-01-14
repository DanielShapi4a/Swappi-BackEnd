const mongoose = require("mongoose");
const User = require("./Listing");

const bidsSchema = new mongoose.Schema({
  id : mongoose.Types.ObjectId,

  listingID : {
    type : Listing,
  },

  bidderID : {
    type : User,
  },

  bidAmount : {
    type : Float32Array,
  },

  bidStatus : { 
    type : String,
  },
});

module.exports = mongoose.model("Bids", bidsSchema);