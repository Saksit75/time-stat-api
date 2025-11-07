const express = require('express');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentByClassLevelId,
  getSomeStudents,
  upClassLevel,
  updateStudentNumber
} = require('./student.controller');
const { validate } = require('../../middlewares/validate.middleware')
const { createStudentSchema, updateStudentSchema } = require('./student.schema');
const auth = require("../../middlewares/auth.middleware");
const multer = require('multer');

const router = express.Router();
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/students/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });
// ใช้ validate middleware
router.get('/', getAllStudents);
router.get('/some', getSomeStudents);
router.get('/:id', getStudentById);
router.post('/', upload.single('photo'), validate(createStudentSchema),auth,  createStudent);
router.put('/:id', upload.single('photo'), validate(updateStudentSchema),auth, updateStudent);
router.delete('/:id', deleteStudent);
router.get('/class-level/:id', getStudentByClassLevelId);
router.post('/up-level',auth, upClassLevel); 
router.post('/update-student-number',auth, updateStudentNumber); 
module.exports = router;