const express = require("express");
const router = express.Router();

// Add wallet routes here
router.get("/", (req, res) => res.send("Wallet Route"));

module.exports = router;