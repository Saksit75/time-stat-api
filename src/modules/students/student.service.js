const studentModel = require('./student.model');

const getAllStudents = async (status) => {
  return await studentModel.getAllStudents(status);
};
const getStudentById = async (id) => {
  return await studentModel.getStudentById(id);
};

const updateStudent = async (id, data) => {
  return await studentModel.updateStudent(id, data);
}

const deleteStudent = async (id) => {
  return await studentModel.deleteStudent(id);
} 


const createStudent = async (data) => {
  return await studentModel.createStudent(data);
};

const getStudentByClassLevelId = async (class_level) => {
  try {
    const { students, classLevel } = await studentModel.getStudentByClassLevelId(class_level);
    const studentsByclass = (students || []).map((student) => ({ //studentsByclass ถูกสร้างจาก .map() ซึ่ง return เป็น array เสมอ
      id: student.id,
      student_id: student.student_id,
      student_number: student.student_number,
      title: student.title_relation.title_th,
      first_name: student.first_name,
      last_name: student.last_name,
      gender: student.gender,
    }));
    const data = {
      message: "success",
      class_id: class_level,
      class_level_th: classLevel?.class_level_th || null,
      data: studentsByclass,
    };
    console.log(data);
    
    return data;
  } catch (error) {
    console.error("Error getStudentByClassLevelId:", error);
    return { message: "เกิดข้อผิดพลาด", error: error.message };
  }
};

module.exports = { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent,getStudentByClassLevelId };

