require("dotenv").config();
const config = {
  PORT: process.env.PORT || 5000,
  DB_CONNECTION: `mongodb+srv://nivnet:NivNiv996@cluster0.j2yahvt.mongodb.net/anyticket?retryWrites=true&w=majority`,
  SECRET: "zsocstmp",

  SALT: 10,
  COOKIE_NAME: "USER_SESSION",

  CLOUDINARY_STORAGE: process.env.CLOUDINARY_STORAGE,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

module.exports = config;