const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/config");
const path = require('path');
const fs = require('fs');

// Read the private key from the file
const privateKeyPath = path.join(__dirname, '..', 'keys', 'private_key.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

async function tokenValidation(token) {
  try {
    // Decode and verify the token
    const decoded = await jwt.verify(token, privateKey);
    
    // If the token is valid, return true
    return decoded ? true : false; 
  } catch (error) {
    // If there is an error (e.g., token is invalid), return null
    return null;
  }
}

async function getUser(id) {
  return await User.findById(id).lean();
}

module.exports = {
  tokenValidation,
  getUser,
};