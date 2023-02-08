const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); 
//const { findOne } = require("../models/User");

const nodemailer = require("nodemailer");
const router = express.Router();
//const {User} = require("../models/User");

const { checkPermission } = require("./../../security/role");
const { authenticateUser } = require("./../../security/stategy");

//Connection to the database file
const mysql = require("mysql2");
module.exports = router;

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

//emailer 
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: process.env.MAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // generated ethereal email address
    pass: process.env.MAIL_PASS // generated ethereal password
  }
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  const [rows, fields] = await connection.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!rows.length) {
    return res.status(400).send({ error: "Email not found" });
  }

  // Generate a unique token for the password reset
  const token = crypto.randomBytes(20).toString("hex");

  // Store the token, email, and expiration date in the database
  const expirationDate = new Date(Date.now() + 3600000); // 1 hour
  await connection.execute(
    "INSERT INTO password_resets (email, token, expiration_date) VALUES (?, ?, ?)",
    [email, token, expirationDate]
  );

  // Send an email to the user with the password reset link
  const mailOptions = {
    from: '"Your App" <your_email_address@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Password Reset", // Subject line
    text: `Click the link to reset your password: http://localhost:3000/reset-password/${token}`, // plain text body
    html: `<p>Click the link to reset your password:</p><a href="http://localhost:3000/reset-password/${token}">Reset password</a>` // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });

  res.send({ message: "Password reset email sent" });
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Check if the token is valid
  const [rows, fields] = await connection.execute(
    "SELECT * FROM password_resets WHERE token = ? AND expiration_date > NOW()",
    [token]
  );

  if (!rows.length) {
    return res.status(400).send({ error: "Token is invalid or has expired" });
  }

  const email = rows[0].email;

  // Update the user's password
  await connection.execute("UPDATE users SET password = ? WHERE email = ?", [
    password,
    email
  ]);

  // Delete the token
  await connection.execute("DELETE FROM password_resets WHERE token = ?", [
    token
  ]);

  res.send({ message: "Password updated successfully" });
});

router.get("/secret", authenticateUser, (req, res) => {
  res.send("Secret message: Only accessible by authenticated users");
});

      
