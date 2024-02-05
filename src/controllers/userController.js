const express = require('express');
const router = express.Router();
const User = require('../models/User');

// router.post('/create', async (req, res) => {
//   try {
//     const newUser = new User(req.query);
//     await newUser.save();
//     res.status(201).json({ message: 'User created successfully', user: newUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

router.put('/edit/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updateFields = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/delete/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/search', async (req, res) => {
  const { name, email } = req.query;
  const searchCriteria = {};

  if (name) {
    searchCriteria.username = new RegExp(name, 'i');
  }

  if (email) {
    searchCriteria.email = new RegExp(email, 'i');
  }

  try {
    const users = await User.find(searchCriteria);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;






// const { Router } = require("express");
// const router = Router();
// const { cloudinary } = require("../config/cloudinary");
// const User = require("../models/User");
// // const isAuth = require('../middlewares/isAuth')
// const productService = require("../services/ticketService");
// const userService = require("../services/userService");

// router.patch("/edit-profile/:id", async (req, res) => {
//   //TODO: Rewrite this
//   let { name, phoneNumber, email } = req.body;
//   try {
//     let errors = [];
//     let checkUser = await User.findOne({ email });

//     if (checkUser && checkUser._id.toString() !== req.user._id.toString()) errors.push("This email address is already in use; ");
//     if (name.length < 3 || name.length > 50) errors.push("Name should be at least 3 characters long and max 50 characters long; ");
//     if (/^05[023489]-?\d{3}-?\d{4}$/.test(phoneNumber) == false) errors.push("Phone number should be a valid number; ");
//     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) == false) errors.push("Please fill a valid email address; ");

//     if (req.body.avatar) {
//       if (!req.body.avatar.includes("image")) errors.push("The uploaded file should be an image; ");
//     }

//     if (errors.length >= 1) throw { message: [errors] };

//     if (req.body.avatar) {
//       let compressedImg = await productService.uploadImage(req.body.avatar);
//       await userService.edit(req.params.id, { name, phoneNumber, email, avatar: compressedImg });
//       res.status(201).json({ message: "Updated!", avatar: compressedImg });
//     } else {
//       await userService.edit(req.params.id, { name, phoneNumber, email });
//       res.status(201).json({ message: "Updated!" });
//     }
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// });

// router.get("/getUserById/:id", async (req, res) => {
//   try {
//     let user = await userService.getUserById(req.params.id);
//     let jsonRes = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       totalSells: user.createdSells.length,
//       avatar: user.avatar,
//       isMe: req.user._id == req.params.id,
//     };
//     res.status(200).json({ user: jsonRes });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });

// module.exports = router;
