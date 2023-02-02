//Connection to the database file
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test1_db",
});

connection.connect((err) => {
  if (err) return console.error(err.message);
  console.log("Connected to the MySQL database.");
});
