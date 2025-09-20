// src/controllers/auth/authController.js
const User = require("../../models/User");
const RefreshToken = require("../../models/RefreshToken"); 
const { sendResponse } = require("../../utils/responseHelper");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const {
  signAccessToken,
  issueRefreshToken,
  verifyRefreshToken,
  findValidRefreshRecord,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
} = require("../../utils/tokenService");

// REGISTER
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      const err = new Error("User already exists");
      err.statusCode = 400;
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashed });

    const accessToken = signAccessToken({ id: user._id });
    const refreshToken = await issueRefreshToken({
      userId: user._id,
      ip: req.ip,
      userAgent: req.get("user-agent") || "unknown",
    });

    return sendResponse(res, true, "User registered successfully", {
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    }, 201);
  } catch (err) {
    next(err);
  }
};

// 🔹 Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, false, "User not found", null, 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendResponse(res, false, "Invalid credentials", null, 400);

    // Access Token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );

    // Refresh Token (use TokenService)
    const refreshToken = await TokenService.generateRefreshToken(user._id);

    sendResponse(res, true, "Login successful", {
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// 🔹 Refresh Access Token
exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return sendResponse(res, false, "Refresh Token is required", null, 403);

    // Hash incoming token
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    console.log("Token Hash:", tokenHash); // Debug log

    const refreshTokenDoc = await RefreshToken.findOne({ tokenHash });
    if (!refreshTokenDoc) {
      return sendResponse(res, false, "Refresh token not found", null, 403);
    }

    if (refreshTokenDoc.expiresAt < new Date()) {
      await RefreshToken.findByIdAndDelete(refreshTokenDoc._id);
      return sendResponse(res, false, "Refresh token expired", null, 403);
    }

    // ✅ Generate new Access Token
    const newAccessToken = jwt.sign(
      { id: refreshTokenDoc.user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );

    sendResponse(res, true, "Access token refreshed", {
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

// LOGOUT (current device – revoke the supplied refresh token)
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      const e = new Error("Refresh token is required");
      e.statusCode = 400;
      throw e;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.id;

    const record = await findValidRefreshRecord(userId, refreshToken);
    if (!record) {
      // idempotent logout response
      return sendResponse(res, true, "Logged out");
    }

    await revokeRefreshToken(record);
    return sendResponse(res, true, "Logged out");
  } catch (err) {
    next(err);
  }
};

// LOGOUT ALL (revoke all refresh tokens for the user)
exports.logoutAll = async (req, res, next) => {
  try {
    await revokeAllUserTokens(req.user.id);
    return sendResponse(res, true, "Logged out from all devices");
  } catch (err) {
    next(err);
  }
};
