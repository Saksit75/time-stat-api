const express = require('express');
const router = express.Router();
router.post('/', (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: false, // ถ้าใช้ https ให้เปลี่ยนเป็น true
        sameSite: 'lax', // ให้ตรงกับ login
        path: '/', // ให้ตรงกับ login
    });
    res.json({
        success: true,
        message: 'logout successfully'
    });
});

module.exports = router;