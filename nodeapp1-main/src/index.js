
// Description: This file is the entry point of the application
const server = require("./server");
// Server port
//const port = process.env.APP_PORT || 8080;
// Starting the server
const startServer = () => {
  server.listen(5000, () => {
    console.log("server running on port 5000");
  });
};