const { de, tr } = require('zod/locales');
const { PrismaClient } = require('../../generated/prisma');
const { includes } = require('zod');
const prisma = new PrismaClient();

const getAllStudents = async (status = null) => {
  return await prisma.student.findMany(
    {
      where: status ? { status } : {},
      include: { title_relation: true, class_level_relation: true }
    }
  );
};

const getStudentById = async (id) => {
  return await prisma.student.findUnique({ where: { id }, include: { title_relation: true, class_level_relation: true }, });
};

const createStudent = async (data) => {
  try {
    if (data.id_card) {
      const existIdCard = await prisma.student.findFirst({ where: { id_card: data.id_card } });
      if (existIdCard) {
        const error = new Error("รหัสบัตรประชาชนถูกใช้แล้ว");
        error.statusCode = 409;
        throw error;
      }
      if (data.id_card.length !== 13) {
        throw new Error('หมายเลขบัตรประชาชนต้องเป็น 13 หลัก');
      }
    }

    if (data.student_id) {
      const existStudentId = await prisma.student.findFirst({ where: { student_id: data.student_id } });
      if (existStudentId) {
        const error = new Error("รหัสนักเรียนถูกใช้แล้ว");
        error.statusCode = 409;
        throw error;
      }
    }

    if (data.student_number && data.class_level) {
      const existStudent = await prisma.student.findFirst({
        where: {
          student_number: data.student_number,
          class_level: Number(data.class_level),
          NOT: { status: "out" },
        },
      });
      if (existStudent) {
        const error = new Error(`เลขที่นักเรียน ${data.student_number} ในระดับชั้นนี้ถูกใช้แล้ว`);
        error.statusCode = 409;
        throw error;
      }
    }

    // แปลงค่าให้เป็น number
    const studentData = {
      ...data,
      title: data.title ? Number(data.title) : undefined,
      class_level: data.class_level ? Number(data.class_level) : undefined,
      photo: data.file ? data.file.path.replace(/\\/g, '/') : data.photo,
    };
    delete studentData.file;

    // สร้าง student จริง
    const result = await prisma.student.create({ data: studentData });
    return result;

  } catch (err) {
    console.error(err);
    throw err; // important: อย่ากลืน error
  }
};


const updateStudent = async (id, data) => {
  try {
    if (data.id_card) {
      const existIdCard = await prisma.student.findFirst(
        {
          where: {
            id_card: data.id_card,
            NOT: { id: id }
          }
        }
      );
      if (existIdCard) {
        const error = new Error("รหัสบัตรประชาชนถูกใช้แล้ว");
        error.statusCode = 409;
        throw error;
      }
      if (data.id_card.length !== 13) {
        throw new Error('หมายเลขบัตรประชาชนต้องเป็น 13 หลัก');
      }
    }

    if (data.student_id) {
      const existStudentId = await prisma.student.findFirst({
        where: {
          student_id: data.student_id,
          NOT: { id: id },
        },
      });

      if (existStudentId) {
        const error = new Error("รหัสนักเรียนถูกใช้แล้ว");
        error.statusCode = 409;
        throw error;
      }
    }

    if (data.student_number && data.class_level) {
      const existStudent = await prisma.student.findFirst({
        where: {
          student_number: data.student_number,
          class_level: Number(data.class_level),
          status: { not: "out" },
          NOT: { id: id },
        },
      });
      if (existStudent) {
        const error = new Error(`เลขที่นักเรียน ${data.student_number} ในระดับชั้นนี้ถูกใช้แล้ว`);
        error.statusCode = 409;
        throw error;
      }
    }

    // แปลงค่าให้เป็น number
    const studentData = {
      ...data,
      title: data.title ? Number(data.title) : undefined,
      class_level: data.class_level ? Number(data.class_level) : undefined,
      photo: data.file ? data.file.path.replace(/\\/g, '/') : data.photo,
    };
    console.log("first data :", JSON.stringify(studentData, null, 2));
    console.log("data.file:", data.file);
    console.log("data.photo:", data.photo);

    delete studentData.file;

    // สร้าง student จริง
    const result = await prisma.student.update({ where: { id }, data: studentData });
    return result;

  } catch (err) {
    console.error(err);
    throw err;
  }
};

const deleteStudent = async (id) => {
  return await prisma.student.delete({ where: { id } });
};

const getStudentByClassLevelId = async (class_level) => {
  try {
    const students = await prisma.student.findMany({
      where: { class_level, status: "in" },
      include: { title_relation: true, class_level_relation: true },
    });

    const classLevel = await prisma.class_level.findFirst({
      where: { id: class_level },
    });

    return { students, classLevel };
  } catch (error) {
    console.error("Error fetching students by class level:", error);
    throw new Error("Failed to fetch students by class level");
  }
};


module.exports = { getAllStudents, createStudent, getStudentById, updateStudent, deleteStudent, getStudentByClassLevelId };