const express = require("express");
const router = express.Router();

// Add stream routes here
router.get("/", (req, res) => res.send("Stream Route"));

module.exports = router;