// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "Godsgift3?"; // 🔒 keep consistent everywhere

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id;
    req.userType = decoded.role;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken, SECRET_KEY };
