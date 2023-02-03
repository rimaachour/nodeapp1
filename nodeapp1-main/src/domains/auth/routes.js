const express = require("express");
const bcrypt = require("bcrypt");
//const { findOne } = require("../models/User");

// const nodemailer = require("nodemailer");
const router = express.Router();
//const {User} = require("../models/User");

const { checkPermission } = require("./../../security/role");
const { authenticateUser } = require("./../../security/stategy");

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


router.post('/sign-up',(req,res)=>{
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  console.log(username , email,password);
})
router.post("/signup", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  

  connection.query(
    "SELECT * FROM user WHERE username = ? OR email = ?",
    [username, email],
    function (error, results) {
      if (error) {
        console.log("Error checking for existing user: ", error);
        return res
          .status(500)
          .send({ error: "Error checking for existing user" });
      }

      if (results.length) {
        return res
          .status(400)
          .send({ error: "Username or email already exists" });
      }
      // const salt = bcrypt.genSalt(10);
      // user.password = bcrypt.hash(user.password, salt);
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          console.log("Error hashing password: ", err);
          return res.status(500).send({ error: "Error hashing password" });
        }

        connection.query(
          "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
          [username, email, hash],
          function (error, results) {
            if (error) {
              console.log("Error creating user: ", error);
              return res.status(500).send({ error: "Error creating user" });
            }

            res.status(200).send({
              success: true,
              message: "Sign up successful!",
            });
          }
        );
      });
    }
  );
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    function (error, results) {
      if (error) {
        console.log("Error finding user: ", error);
        return res.status(500).send({ error: "Error finding user" });
      }

      if (!results.length) {
        return res.status(400).send({ error: "Username not found" });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          console.log("Error comparing password: ", err);
          return res.status(500).send({ error: "Error comparing password" });
        }

        if (!result) {
          return res.status(400).send({ error: "Incorrect password" });
        }

        res.send({
          success: true,
          message: "Login successful!",
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
          },
        });
      });
    }
  );
});

router.get("/admin", checkPermission("admin"), (req, res) => {
  // Admin only content
});

router.get("/user", checkPermission("user"), (req, res) => {
  // User only content
});

// Create a new transporter for sending emails

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;


  // Check if the email exists in the database
  connection.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      function (error, results) {
        if (error) {
          console.log("Error finding user: ", error);
          return res.status(500).send({ error: "Error finding user" });
        }
  
        if (!results.length) {
          return res.status(400).send({ error: "Username not found" });
        }
        const user = results[0];
      });
    });

router.get("/secret", authenticateUser, (req, res) => {
  res.send("Secret message: Only accessible by authenticated users");
});
module.exports = router;
      
