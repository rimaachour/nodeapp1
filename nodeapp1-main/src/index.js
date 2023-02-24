
// Description: This file is the entry point of the application
//const server = require("./server");
// Server port
//const port = process.env.APP_PORT || 8080;
// Starting the server
//const startServer = () => {
  //server.listen(5000, () => {
    //console.log("server running on port 5000");
  //});
//};




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
app.get('/', function (req, res) {
  res.send('Hello World!'); // This will serve your request to '/'.
});
app.use(routes);

app.all('*',(req,res,next)=>{
  res.status(404).json({
     status:'false ',
     message :'Page Note Found !'
  })
})
app.listen(5000, () => {
  console.log("server running on port 5000");
});


module.exports = app;