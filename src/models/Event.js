const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  id : mongoose.Types.ObjectId,

  name : { 
    type : String,
    require : "Event's name is required.",
    trim : true,
    match : [/^[A-Za-z0-9.,-]{3,}$/, "Event's name can include latters, numbers and (,.-) and must be at least 3 characters."]
  },

  type : {
    type : String,
    require : "Describe event type or genre.",
    trim : true,
    match : [/^[A-Za-z0-9.,-]{3,}$/, "Event's name can include latters, numbers and (,.-) and must be at least 3 characters."],
  },

  date : {
    type : Date
  },

  location : {
    type : String,
    require : "Enter event's location.",
    trim : true,
    match : [/^[A-Za-z0-9.,-]{3,}$/, "Event's name can include latters, numbers and (,.-) and must be at least 3 characters."],
  },

  event_Image : {
    type : Image,
  }
});

module.exports = mongoose.model("Event", eventSchema);