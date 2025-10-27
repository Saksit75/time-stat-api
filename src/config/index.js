require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 6000,
  DATABASE_URL: process.env.DATABASE_URL || '',
};
