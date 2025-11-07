const loginService = require('./login.service');

const userLogin = async (req, res) => {
  try {
    const login = await loginService.userLogin(req.body);

    // ✅ ตั้ง cookie ที่นี่
    res.cookie('access_token', login.access_token, {
      httpOnly: true,
      secure: false,      // dev ใช้ HTTP → false
      sameSite: 'lax',    // ใช้ 'lax' สำหรับ same-origin requests
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
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
