const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

const slidingJWT = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // ต่ออายุ token ถ้าเหลือเวลาน้อยกว่า 1 ชั่วโมง
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp - now < 3600) {
      const newToken = jwt.sign(
        { id: payload.id, username: payload.username },
        JWT_SECRET,
        { expiresIn: '3h' }
      );
      res.cookie('access_token', newToken, {
        httpOnly: true,
        maxAge: 3 * 60 * 60 * 1000,
        sameSite: 'lax',
        secure: false,
      });
    }

    req.user = payload;
    next();
  } catch (err) {
    res.clearCookie('access_token');
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = slidingJWT;
