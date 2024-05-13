require("dotenv").config();

const config = {
  PORT: process.env.PORT || 5000,
  DB_CONNECTION: `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@${process.env.DB_URL}`,
};

module.exports = config;
