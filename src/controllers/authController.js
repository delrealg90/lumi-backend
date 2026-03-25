const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

exports.register = async (req, res) => {
  const { username, email, password, is_creator } = req.body;
  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, is_creator) VALUES ($1, $2, $3, $4) RETURNING id, username, email, is_creator",
      [username, email, hashedPassword, is_creator || false]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, JWT_SECRET, { expiresIn: "24h" });

    const { password: _, ...userWithoutPassword } = user.rows[0];
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await pool.query("SELECT id, username, email, balance, is_creator, created_at FROM users WHERE id = $1", [req.user.id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
