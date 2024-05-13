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

/**
 * @swagger
 * tags:
 *   - name: UserManagement
 *     description: User management related endpoints.
 */

/**
 * @swagger
 * /getUserById/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Get a user by their ID.
 *     tags:
 *       - UserManagement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 */
router.get('/getUserById/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /edit/{userId}:
 *   put:
 *     tags:
 *       - UserManagement
 *     summary: Edit user details
 *     description: Update the details of an existing user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Unique ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /delete/{userId}:
 *   delete:
 *     tags:
 *       - UserManagement
 *     summary: Delete a user
 *     description: Remove a user from the system by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Unique ID of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /search:
 *   get:
 *     tags:
 *       - UserManagement
 *     summary: Search for users
 *     description: Search for users by name and/or email.
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: Part of or full name to search for.
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         required: false
 *         description: Part of or full email to search for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results matching criteria.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /updateUser:
 *   put:
 *     summary: Update user profile
 *     description: Allows authenticated users to update their profile information.
 *     tags:
 *       - UserManagement
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: Unique ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's new email.
 *               name:
 *                 type: string
 *                 description: The user's new name.
 *               password:
 *                 type: string
 *                 description: The user's new password.
 *               phoneNumber:
 *                 type: string
 *                 description: The user's new phone number.
 *               gender:
 *                 type: string
 *                 description: The user's new gender.
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/updateUser/:userId', async (req, res) => {
  try {
      const userId = req.params.userId; 
      const { email, name, password, phoneNumber, gender } = req.body;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update fields
      if (email) user.email = email;
      if (name) user.name = name;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (gender) user.gender = gender;

      // Handle password change with care
      if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
      }

      await user.save();

      res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;