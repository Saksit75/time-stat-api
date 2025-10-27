const { z } = require('zod');

// Schema สำหรับสร้างนักเรียน
const loginSchema = z.object({
  username: z.string().min(1, 'กรุณากรอกชื่อผู้ใช้'),
  // password: z.string().min(1, 'กรุณากรอกรหัสผ่าน')
});

module.exports = { loginSchema };