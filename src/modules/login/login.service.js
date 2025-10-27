const loginModel = require('./login.model');

const userLogin = async (data) => {
  return await loginModel.userLogin(data.username, data.password);
};
module.exports = { userLogin };

