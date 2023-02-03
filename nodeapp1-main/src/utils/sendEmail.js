const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Testing success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to go from SENDEMAIL");
    console.log(success);
  }
});
const sendEmail = async (mailOptions) => {
  try {
    const emailSent = await transporter.sendMail(mailOptions);
    return emailSent;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
