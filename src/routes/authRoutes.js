const express = require("express");
const router = express.Router();

// Add auth routes here (login, register, etc.)
router.get("/", (req, res) => res.send("Auth Route"));

module.exports = router;