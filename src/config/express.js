const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
module.exports = (app) => {
  app.use(
    cors({
      origin: ["http://localhost:3000", "https://swaappi.netlify.app", "https://swaappi-dev.netlify.app", "https://swappi-ai.com"],
      credentials: true,
    })
  );
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  // app.use(auth);
};
