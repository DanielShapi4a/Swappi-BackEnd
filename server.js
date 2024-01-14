const express = require("express");
const app = express();
const { PORT } = require("./src/config/config");
const http = require("http").createServer(app);
const auth = require("./src/middlewares/auth");
const routes = require("./routes");
require("dotenv").config();
require("./src/config/express")(app);
require("./src/config/mongoose");
app.use(auth());

app.use(routes);
http.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT} ▶️`));
