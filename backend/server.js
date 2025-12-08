import "dotenv/config";
import express from "express";
import sequelize from "./database.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import googleRoutes from "./routes/googleRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(morgan("dev"));
app.use(cors("http://localhost:5173/"));
app.use(express.json());
app.use(cookieParser());

//rute
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/google/calendar", googleRoutes);
app.use("/api/google", googleAuthRoutes);
app.use("/api/appointment", appointmentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Google Appointments API is running !!!" });
});

// pornire server + DB.
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("@@ Conexiune reusita la baza de date.");

    await sequelize.sync({ force: false });
    console.log("Initializare baza de date cu succes!");

    app.listen(PORT, () => {
      console.log(`Server http is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erroare de conexine la DB:", err);
  }
}

startServer();
