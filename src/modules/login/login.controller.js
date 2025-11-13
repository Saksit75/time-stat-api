const loginService = require('./login.service');

const userLogin = async (req, res) => {
  try {
    const login = await loginService.userLogin(req.body);

    // ✅ ตั้ง cookie ที่นี่
    res.cookie('access_token', login.access_token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000, // 3 ชั่วโมง
      sameSite: 'none',   // cross-site ต้อง none
      secure: false,       // ต้อง true ถ้าใช้ https
      // path: '/',          // กำหนด path ให้ชัดเจน
    });

    const resLogin = {
      ...login,
      password: true,
      access_token: login.access_token,
    };
    res.status(200).json({
      success: true,
      message: 'Login successfully',
      data: { resLogin },
    });

  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
      errors: err.errors || [{ field: 'server', message: 'Internal Server Error' }],
    });
  }
};

module.exports = { userLogin };
