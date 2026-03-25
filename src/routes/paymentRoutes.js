const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/create-segpay-link", paymentController.createSegpayLink);
router.post("/segpay-webhook", paymentController.segpayWebhook);

module.exports = router;