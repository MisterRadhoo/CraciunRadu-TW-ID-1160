import { confirmToken } from "../utils/jwt.js";

export default async function checkCookieToken(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Token inexistent!" });
  }
  try {
    const decoded = await confirmToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid sau expirat!" });
  }
}
