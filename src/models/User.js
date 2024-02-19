const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { SALT } = require("../config/config");

const userSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  name: {
    type: String,
    trim: true,
    required: "Please fill a username. It can be your real one or a username.",
    minlength: 3,
    maxlength: 20,
    match: [/^[A-Za-z0-9]{3,20}$/, "Some characters are not allowed to use in the username, try another username."],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    required: "Email address is required",
  },
  password: {
    type: String,
    trim: true,
    required: ["Password is required"],
    minlength: [8, "Password should be at least 8 characters long"],
    maxlength: [16, "Password length can not be more then 16 characters."],
    match: [/^[^\s\\/]{8,16}$/, "Some characters are not allowed to use in the password, try another password."],
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^05[023489]-?\d{3}-?\d{4}$/, "Please fill a valid phone number"],
  },
  gender: {
    type: String,
    trim: true,
    default: "Not specified",
  },
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/silenceiv/image/upload/q_auto:eco/v1617358367/defaultAvatar_wnoogh.png",
  },
  createdSells: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
  wishedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
  chatRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
    },
  ],
});

userSchema.pre("save", async function (next) {
  let salt = await bcrypt.genSalt(SALT);
  let hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

module.exports = mongoose.model("User", userSchema);
