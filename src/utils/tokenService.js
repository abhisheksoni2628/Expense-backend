// src/utils/tokenService.js
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const RefreshToken = require("../models/RefreshToken");

const {
  ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET,  // fallback to your current secret
  ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_EXPIRE,                      // short-lived
  REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_EXPIRE,                      // long-lived
} = process.env;

const signAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

const signRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_TTL });

const verifyAccessToken = (token) =>
  jwt.verify(token, ACCESS_TOKEN_SECRET);

const verifyRefreshToken = (token) =>
  jwt.verify(token, REFRESH_TOKEN_SECRET);

// Create + persist refresh token (hashed) for rotation
async function issueRefreshToken({ userId, ip, userAgent }) {
  const rawToken = signRefreshToken({ id: userId });
  const tokenHash = await bcrypt.hash(rawToken, 10);

  // compute expiry date
  const decoded = jwt.decode(rawToken);
  const expiresAt = new Date(decoded.exp * 1000);

  await RefreshToken.create({
    user: userId,
    tokenHash,
    expiresAt,
    ip,
    userAgent,
  });

  return rawToken;
}

// Validate refresh token against DB (hashed)
async function findValidRefreshRecord(userId, rawToken) {
  const tokens = await RefreshToken.find({
    user: userId,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  for (const rec of tokens) {
    const match = await bcrypt.compare(rawToken, rec.tokenHash);
    if (match) return rec;
  }
  return null;
}

// Rotate refresh token: revoke old, create new
async function rotateRefreshToken(oldRecord, userId, ip, userAgent) {
  const newRaw = await issueRefreshToken({ userId, ip, userAgent });
  const newHash = await bcrypt.hash(newRaw, 10);

  oldRecord.revokedAt = new Date();
  oldRecord.replacedByTokenHash = newHash;
  await oldRecord.save();

  return newRaw;
}

// Revoke all refresh tokens for a user (logout-all) or just one (logout-current)
async function revokeRefreshToken(record) {
  record.revokedAt = new Date();
  await record.save();
}

async function revokeAllUserTokens(userId) {
  await RefreshToken.updateMany(
    { user: userId, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } }
  );
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  issueRefreshToken,
  findValidRefreshRecord,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
};
