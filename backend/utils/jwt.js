import jwt from "jsonwebtoken";

const secretKey = process.env.jwt_secret;
const accessToken = process.env.jwt_access_expiration || "24h";
const refreshToken = process.env.jwt_refresh_expiration || "14d";

export async function generateAccessToken(payloadData) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payloadData,
      secretKey,
      { expiresIn: accessToken },
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
}

export async function generateRefreshToken(payloadData) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payloadData,
      secretKey,
      { expiresIn: refreshToken },
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
}

export async function confirmToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}
