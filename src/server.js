//In this file we put all the code that will run on the server
require("./config/db");
const app = require("express")();
const cors = require("cors");
const bodyParser = require("express").json;
const routes = require("./routes");
//cors
app.use(cors());
//for accepting posts from data
app.use(bodyParser({ limit: "50mb" }));
//registering routes
app.get("/", (req, res) => {
  res.send("Hello , This is the server side of the project");
});

app.use(routes);

module.exports = app;
