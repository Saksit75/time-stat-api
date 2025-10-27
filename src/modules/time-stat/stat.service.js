const statModel = require('./stat.model');

const getFormTimeStat = async () => {
  try {
    const { students, classLevel } = await statModel.getFormTimeStat();

    const formData = classLevel.reduce((acc, classLev) => {
      const studentCount = students.filter(s => s.class_level === classLev.id).length;
      const studentCountMale = students.filter(s => s.class_level === classLev.id && s.gender === 'm').length;
      const studentCountFemale = students.filter(s => s.class_level === classLev.id && s.gender === 'f').length;

      acc[classLev.id] = {
        class_level: classLev.id,
        class_level_th: classLev.class_level_th,
        amount_student_male: studentCountMale,
        amount_student_female: studentCountFemale,
        amount_student_count: studentCount,
        come_student_male: null,
        come_student_female: null,
        come_student_count: null,
        not_come_student_male: null,
        not_come_student_female: null,
        not_come_student_count: null,
        absent_student_count: null,
        leave_student: null,
        sick_student: null,
        late_student: null,
        remark: null
      };

      return acc;
    }, {});

    return {
      formTimeStat: {
        date: new Date(),
        formData,
        teacher: null
      }
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { getFormTimeStat };
