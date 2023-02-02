const express = require("express");
const router = express.Router();

const { checkPermission } = require("./../../security/role");
const { authenticateUser } = require("./../../security/stategy");
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

            res.send({
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
    html: `<p>Please click <a href="${resetUrl}">here</a> to reset your password</p>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ error: "Failed to send reset email" });
    }

    return res.send({ message: "Reset email sent" });
  });
});

router.get("/secret", authenticateUser, (req, res) => {
  res.send("Secret message: Only accessible by authenticated users");
});
module.exports = router;
