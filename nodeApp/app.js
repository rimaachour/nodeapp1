const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const SECRET_KEY = 'secretkey';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test1_db'
});

connection.connect((err) => {
  if (err) return console.error(err.message);
  console.log('Connected to the MySQL database.');
});

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Authorization header is missing');

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).send('Invalid token');
    req.user = user;
    next();
  });
}

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
  
    connection.query("SELECT * FROM user WHERE username = ? OR email = ?", [username, email], function(
      error,
      results
    ) {
      if (error) {
        console.log("Error checking for existing user: ", error);
        return res.status(500).send({ error: "Error checking for existing user" });
      }
  
      if (results.length) {
        return res.status(400).send({ error: "Username or email already exists" });
      }
  
      bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
          console.log("Error hashing password: ", err);
          return res.status(500).send({ error: "Error hashing password" });
        }
  
        connection.query(
          "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
          [username, email, hash],
          function(error, results) {
            if (error) {
              console.log("Error creating user: ", error);
              return res.status(500).send({ error: "Error creating user" });
            }
  
            res.send({
              success: true,
              message: "Sign up successful!"
            });
          }
        );
      });
    });
  })

  app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    connection.query("SELECT * FROM user WHERE username = ?", [username], function(error, results) {
      if (error) {
        console.log("Error finding user: ", error);
        return res.status(500).send({ error: "Error finding user" });
      }
  
      if (!results.length) {
        return res.status(400).send({ error: "Username not found" });
      }
  
      const user = results[0];
  
      bcrypt.compare(password, user.password, function(err, result) {
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
            role: user.role
          }
        });
      });
    });
  });

  const roles = {
    admin: 1,
    user: 2
  };
  
  const checkPermission = role => {
    return (req, res, next) => {
      const userRole = req.user.role;
  
      if (userRole < roles[role]) {
        return res.status(403).send({ error: "Forbidden" });
      }
  
      next();
    };
  };
  
  app.get("/admin", checkPermission("admin"), (req, res) => {
    // Admin only content
  });
  
  app.get("/user", checkPermission("user"), (req, res) => {
    // User only content
  });


// Create a new transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password"
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ error: "Email not found" });
  }

  // Generate a reset token
  const resetToken = uuidv4();
  user.resetToken = resetToken;
  user.resetTokenExpiration = Date.now() + 3600000;
  await user.save();

  // Send the reset email
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Password reset request",
    html: `<p>Please click <a href="${resetUrl}">here</a> to reset your password</p>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ error: "Failed to send reset email" });
    }

    return res.send({ message: "Reset email sent" });
  });
});
















app.get('/secret', authenticateUser, (req, res) => {
  res.send('Secret message: Only accessible by authenticated users');
});

app.listen(3000, () => console.log('Server started on port 3000'));
