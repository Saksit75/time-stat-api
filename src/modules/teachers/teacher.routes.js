const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { validate } = require('../../middlewares/validate.middleware');
const { createTeacherSchema, updateTeacherSchema } = require('./teacher.schema');
const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherPhoto
} = require('./teacher.controller');

// ตั้งค่า Multer สำหรับเก็บไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/teachers/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Routes
router.get('/',getAllTeachers);
router.get('/:id', getTeacherById);
router.post('/', upload.single('photo'), validate(createTeacherSchema), createTeacher);
router.put('/:id', upload.single('photo'), validate(updateTeacherSchema), updateTeacher);
router.delete('/:id', deleteTeacher);
router.get('/photo/:id', getTeacherPhoto);
module.exports = router;
