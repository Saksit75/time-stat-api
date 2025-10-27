const studentService = require('./student.service');

const createStudent = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.file = req.file; // ส่งทั้ง object ไป model
    }
    const newStudent = await studentService.createStudent(req.body);
    res.status(201).json({
      success: true,
      message: 'created successfully',
      data: newStudent
    });
  } catch (err) {
    next(err);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const status = req.query.status || null;
    const students = await studentService.getAllStudents(status);
    res.json({
      success: true,
      data: students
    });
  } catch (err) {
    next(err);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID ต้องเป็นตัวเลข'
      });
    }

    const student = await studentService.getStudentById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'ไม่พบนักเรียน'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID ต้องเป็นตัวเลข'
      });
    }
    const updateStudent = req.body;

    if (req.file) {
      updateStudent.file = req.file; // ส่งทั้ง object ไป model
    }

    const student = await studentService.updateStudent(id, updateStudent);

    res.json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID ต้องเป็นตัวเลข'
      });
    }

    await studentService.deleteStudent(id);

    res.json({
      success: true,
      message: 'ลบนักเรียนสำเร็จ'
    });
  } catch (err) {
    next(err);
  }
};

const getStudentByClassLevelId = async (req, res, next) => {
  try {
     const classLevelId = parseInt(req.params.id);

    if (isNaN(classLevelId)) {
      return res.status(400).json({
        success: false,
        error: 'ID ต้องเป็นตัวเลข'
      });
    }

    const students = await studentService.getStudentByClassLevelId(classLevelId);

    res.json({
      success: true,
      data: students
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentByClassLevelId
};