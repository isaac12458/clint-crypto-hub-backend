require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const walletRoutes = require("./routes/wallets");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔥 CONNECT DATABASE FIRST
connectDB();

app.get("/", (req, res) => {
  res.json({ status: "Clint Crypto Backend Running 🚀" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api/wallets", walletRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

