const loginService = require('./login.service');

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const login = await loginService.userLogin(username, password);

res.cookie('access_token', login.access_token, {
  httpOnly: true,
  secure: true,
  sameSite: 'none', 
  path: '/', 
  maxAge: 3 * 60 * 60 * 1000,
});


    const resLogin = {
      ...login,
      password: true,
      access_token: true,
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
