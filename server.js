const express = require("express");
const app = express();
const { PORT } = require("./src/config/config");
const http = require("http").createServer(app);
const auth = require("./src/middlewares/auth");
const routes = require("./routes");
require("dotenv").config();
require("./src/config/express")(app);
require("./src/config/mongoose");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const port = 5000; // You can choose your port number
app.use(auth());
app.use(routes);
http.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT} ▶️`));

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Your API',
    version: '1.0.0',
    description: 'API documentation using Swagger',
  },
  servers: [
    {
      url: 'http://localhost:5000',
    },
  ],
};

// Options for the swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes.js', './src/controllers/*.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));