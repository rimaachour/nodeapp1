//In this file we put all the code that will run on the server
require("./config/db");
const app = require("express")();
const cors = require("cors");
const bodyParser = require("express").json;
const routes = require("./routes");
const pdfRouter = require("./student/routes");
//cors
app.use(cors());
//for accepting posts from data
app.use(bodyParser({ limit: "50mb" }));
//registering routes
app.use(routes);
app.use("/",pdfRouter);

app.all('*',(req,res,next)=>{
  res.status(404).json({
     status:'false ',
     message :'Page Note Found !'
  })
})
module.exports = app;
