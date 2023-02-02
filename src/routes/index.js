const express = require("express");
const router = express.Router();

const auth = require("./../domains/auth");
const otp = require("./../domains/otp");
const admin = require("./../domains/admin");
const entreprise = require("./../domains/entreprise");
const student = require("./../domains/student");

router.use("/auth", auth);
router.use("/otp", otp);
router.use("/admin", admin);
router.use("/entreprise", entreprise);
router.use("/student", student);

module.exports = router;
