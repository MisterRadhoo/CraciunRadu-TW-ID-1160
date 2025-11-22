import express from "express";
import { google } from "googleapis";
import { User } from "../model/index.js";

const router = express.Router();

// Autentificare Google OAUTH2; /din browser se face auth;
router.get("/auth/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: `UserId: ${userId} nu exista in DB!` });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
      state: userId.toString(),
    });
    res.redirect(url);
  } catch (err) {
    console.error("Erroare la generare URL de autentificare:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;
    if (!code || !state)
      return res.status(400).json({ error: "Parametrii invalizi!" });

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const user = await User.findByPk(state);
    if (!user) {
      return res.status(404).json({ error: "User-ul nu exista in DB." });
    }

    await User.update(
      {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpire: tokens.expiry_date,
      },
      { where: { id: user.id } }
    );

    console.log(`Token-uri Google salvate pentru userId: ${user.id} in DB.`);
    res.send("Conectare la Google Calendar reusita!");
  } catch (err) {
    console.error("Erroare la callback Google:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
