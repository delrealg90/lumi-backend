const pool = require("../config/db");

exports.createSegpayLink = async (req, res) => {
  const { userId, packageId } = req.body;

  const packages = {
    1: { price: 50, coins: 100 },
    2: { price: 100, coins: 250 },
    3: { price: 200, coins: 600 }
  };

  const selected = packages[packageId];

  if (!selected) {
    return res.status(400).json({ error: "Invalid package ID" });
  }

  const url = `https://secure.segpay.com/billing/poset.cgi?x-eticketid=${process.env.SEGPAY_SITE_ID}&amount=${selected.price}&custom=${userId}_${selected.coins}`;

  res.json({ url });
};

exports.segpayWebhook = async (req, res) => {
  const { custom, approved } = req.body;

  if (approved !== "1") return res.send("Not approved");

  const [userId, coins] = custom.split("_");

  try {
    await pool.query(
      "UPDATE users SET balance = balance + $1 WHERE id=$2",
      [parseInt(coins), parseInt(userId)]
    );
    console.log(`Success: Added ${coins} coins to user ${userId}`);
    res.send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Error updating balance");
  }
};