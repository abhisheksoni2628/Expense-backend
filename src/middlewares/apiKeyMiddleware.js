// src/middlewares/apiKeyMiddleware.js
const apiKeyMiddleware = (req, res, next) => {
  const clientKey = req.header("x-api-key");

  if (!clientKey || clientKey !== process.env.API_KEY) {
    return res.status(403).json({ msg: "Forbidden: Invalid API Key" });
  }

  next();
};

module.exports = apiKeyMiddleware;
