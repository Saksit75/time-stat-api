const argon2 = require('argon2');
const teacherModel = require('./teacher.model');

const getAllTeachers = async (status) => {
  return await teacherModel.getAllTeachers(status);
};
const getTeacherById = async (id) => {
  return await teacherModel.getTeacherById(id);
};

const updateTeacher = async (id, data) => {
  return await teacherModel.updateTeacher(id, data);
}

const deleteTeacher = async (id) => {
  return await teacherModel.deleteTeacher(id);
}


const createTeacher = async (data) => {
  try {
    console.log('Teacher service - received data:', JSON.stringify(data, null, 2));
    
    if (data.password) {
      data.password = await argon2.hash(data.password, {
        type: argon2.argon2id,
      });
    }
    
    const result = await teacherModel.createTeacher(data);
    console.log('Teacher service - created successfully:', result);
    return result;
  } catch (error) {
    console.error('Teacher service - error:', error);
    throw error;
  }
};

const getTeacherPhoto = async (id) => {
  return await teacherModel.getTeacherPhoto(id);
}

module.exports = { getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher, getTeacherPhoto };

