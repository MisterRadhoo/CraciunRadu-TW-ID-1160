import { User } from "../model/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
  confirmToken,
} from "../utils/jwt.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*--array ce stocheaza refreshTokens pe perioada sesiuni de test--*/
let newChips = [];

class AuthCtrl {
  /*---POST /api/auth/login--*/
  static async login(req, res) {
    try {
      const { fullName, password } = req.body;
      if (!fullName || !password) {
        return res.status(400).json({
          message: "Numele si parola sunt necesare pentru logare.",
          expectedFormat: {
            fullName: "String Name",
            password: "********",
          },
        });
      }
      const user = await User.findOne({ where: { fullName } });
      if (!user) {
        return res.status(404).json({ message: "User negasit!" });
      }
      const logIn = await bcrypt.compare(password, user.password);
      if (!logIn) {
        return res.status(401).json({ message: "Parola gresita!" });
      }
      const payload = { id: user.id, fullName: user.fullName };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);
      newChips.push(refreshToken);

      const decoded = jwt.decode(accessToken);
      const expireIn = new Date(decoded.exp * 1000).toLocaleString();
      /*---Setare cookie-uri---*/ //   httpOnly: true, // res.cookie("accessToken", accessToken, {
      //   secure: false, // true, numai pe HTTPS (certificat SSL)
      //   sameSite: "lax",
      //   maxAge: 24 * 60 * 60 * 1000, // 24h
      // });

      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: "lax",
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 zile valabilitate, refresh token
      // });

      res.status(200).json({
        message: "Autentificare cu succes!",
        status: "token granted!",
        tokenType: "Bearer",
        accessToken,
        refreshToken,
        expireIn,
        user: {
          id: user.id,
          fullName: user.fullName,
        },
      });
    } catch (err) {
      console.error("Eroare la autenficare!", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  /*POST---/api/auth/refresh--*/
  static async refresh(req, res) {
    try {
      const refreshToken = req.headers["x-refresh-token"];
      //const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(400).json({
          message:
            "Lipseste refresh-token! //Este necesar header 'x-refresh-token'//.",
        });
      }
      const decoded = await confirmToken(refreshToken);
      if (!decoded) {
        return res
          .status(403)
          .json({ message: "Refresh-token invalid sau expirat!" });
      }
      if (!newChips.includes(refreshToken)) {
        return res
          .status(403)
          .json({ message: "RefreshToken invalid sau delogat!" });
      }

      // rotatie refreshToken
      // eliminam refreshToken vechi
      newChips = newChips.filter((token) => token !== refreshToken);

      const payload = { id: decoded.id, fullName: decoded.fullName };

      //generare token-uri noi
      const newAccessToken = await generateAccessToken(payload);
      const newRefreshToken = await generateRefreshToken(payload);

      //adaugare nou refreshToken generat
      newChips.push(newRefreshToken);

      // res.cookie("accessToken", newAccessToken, {
      //   httpOnly: true,
      //   secure: "true",
      //   sameSite: "strict",
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7z
      // });
      res.status(200).json({
        message: "Token de acces reinprospatat!",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenType: "Bearer",
      });
    } catch (err) {
      console.error("Erroare la refreshToken! ", err);
      res.status(403).json({ message: "RefreshToken invalid sau expirat." });
    }
  }
  /*---POST /api/auth/logout--(cookie.version)-*/
  // static async logout(req, res) {
  //   try {
  //     res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
  //     res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
  //     res.status(200).json({ message: "Delogare cu succes!" });
  //   } catch (err) {
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  /*---POST /api/auth/logout---*/
  static async logout(req, res) {
    try {
      const refreshToken = req.headers["x-refresh-token"];
      if (!refreshToken) {
        return res.status(400).json({
          message: "Lipseste header-ul 'x-refresh-token!",
        });
      }
      if (!newChips.includes(refreshToken)) {
        return res
          .status(403)
          .json({ message: "Refresh token invalid sau delogat!" });
      }
      newChips = newChips.filter((t) => t !== refreshToken);
      res.status(200).json({ message: "Delogare cu succes!" });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default AuthCtrl;
