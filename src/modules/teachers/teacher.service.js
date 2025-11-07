const argon2 = require('argon2');
const teacherModel = require('./teacher.model');

const getAllTeachers = async (status,page,limit) => {
  return await teacherModel.getAllTeachers(status,page,limit);
};
const getTeacherById = async (id) => {
  return await teacherModel.getTeacherById(id);
};

const updateTeacher = async (id, data, userActionId) => {
  return await teacherModel.updateTeacher(id, data, userActionId);
}

const deleteTeacher = async (id) => {
  return await teacherModel.deleteTeacher(id);
}


const createTeacher = async (data, userActionId ) => {
  try {
    if (data.password) {
      data.password = await argon2.hash(data.password, {
        type: argon2.argon2id,
      });
    }
    
    const result = await teacherModel.createTeacher(data, userActionId);
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

