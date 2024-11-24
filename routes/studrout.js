const express = require("express");
const router = express.Router();
const { getAllNotices } = require("../controllers/studnotice");
const { auth } = require("../middleware/auth");

router.get("/", auth, getAllNotices);

module.exports = router;
