import { confirmToken } from "../utils/jwt.js";

export default async function authorize(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Lipsa antet de autorizare." });
    }

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Format invalid de autorizare." });
    }

    const decoded = await confirmToken(token);
    req.user = decoded; // stocam in cerere user -> incarcatura cu datele utilizatorlui
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid sau expirat!" });
  }
}
