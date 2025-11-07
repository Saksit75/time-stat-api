// middleware/auth.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

module.exports = (req, res, next) => {
  const access_token = req.cookies.access_token; // token จาก cookie

  if (!access_token) {
    return res.status(401).json({ message: "No access_token" });
  }

  try {
    const decoded = jwt.verify(access_token, SECRET_KEY);
    req.middlewareUser = decoded; // ตัวอย่าง payload: { id, username, role, iat, exp }
       next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(403).json({ message: `Invalid token ${access_token}` });
  }
};
