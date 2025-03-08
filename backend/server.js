require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const activityRoutes = require("./routes/activityRoutes");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const symptomRoutes = require("./routes/symptomRoutes");
const periodRoutes = require("./routes/periodRoutes");
// const healthRoutes = require("./routes/healthRoutes");

connectDB();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/activities", activityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/period", periodRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
