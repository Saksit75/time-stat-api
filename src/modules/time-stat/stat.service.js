const statModel = require('./stat.model');

const getFormTimeStat = async () => {
  try {
    const { students, classLevel } = await statModel.getFormTimeStat();

    const formData = {};

    for (const classLev of classLevel) {
      const studentsInClass = [];
      let maleCount = 0;
      let femaleCount = 0;

      // loop แค่ครั้งเดียวสำหรับ students ทุกคน
      for (const student of students) {
        if (student.class_level === classLev.id) {
          // เพิ่ม student ลง studentsByClass
          studentsInClass.push({
            id: student.id,
            student_id: student.student_id,
            student_number: student.student_number,
            title: student.title_relation?.title_th || '',
            first_name: student.first_name,
            last_name: student.last_name,
            gender: student.gender,
            class_status: 'come'
          });

          // นับ male/female
          if (student.gender === 'm') maleCount++;
          else if (student.gender === 'f') femaleCount++;
        }
      }

      const totalCount = studentsInClass.length;

      formData[classLev.id] = {
        class_level: classLev.id,
        class_level_th: classLev.class_level_th,
        amount_male: maleCount,
        amount_female: femaleCount,
        amount_count: totalCount,
        come_male: maleCount,
        come_female: femaleCount,
        come_count: totalCount,
        not_come_male: null,
        not_come_female: null,
        not_come_count: null,
        absent: null,
        leave: null,
        sick: null,
        late: null,
        remark: studentsInClass
      };
    }

    const result = { formTimeStat: { date: new Date(), formData, teacher: null } };

    // 🔹 แสดงผลสวย ๆ
    console.log(JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { getFormTimeStat };
