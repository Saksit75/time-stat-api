const express = require('express');
const router = express.Router();
const { validate } = require('../../middlewares/validate.middleware');
const { getFormTimeStat } = require('./stat.controller');
  

// Routes
router.get('/get-form-time-stat',getFormTimeStat);

module.exports = router;