const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();
const argon2 = require("argon2"); // ✅ เพิ่มการ import

const getAllTeachers = async (status = null) => {
  return await prisma.teacher.findMany({
    where: status ? { status } : {}, // ถ้ามี status จะ filter ถ้าไม่มีจะดึงทั้งหมด
    include: {
      title_relation: true,
      class_level_relation: true,
    },
  });
};

const getTeacherById = async (id) => {
  return await prisma.teacher.findUnique({
    where: { id },
    include: { title_relation: true, class_level_relation: true },
  });
};

const createTeacher = async (data) => {
  try {
    if (data.password && !data.username) {
      throw new Error("หากมีรหัสผ่าน ต้องระบุชื่อผู้ใช้ด้วย");
    }

    if (data.username && data.username.trim() !== "") {
      const existingTeacher = await prisma.teacher.findUnique({
        where: { username: data.username },
      });
      if (existingTeacher) {
        const error = new Error("ชื่อผู้ใช้ถูกใช้แล้ว");
        error.statusCode = 409;
        throw error;
      }
    }

    if (data.class_level !== undefined && data.class_level !== null) {
      data.class_level = parseInt(data.class_level);
      if (isNaN(data.class_level)) {
        throw new Error("class_level ต้องเป็นตัวเลขที่ถูกต้อง");
      }
    }

    if (data.title) data.title = parseInt(data.title);
    if (data.file) {
      data.photo = data.file.path.replace(/\\/g, '/');
    }

    // ✅ hash password ถ้ามี
    if (data.password) {
      data.password = await argon2.hash(data.password);
    }

    const prismaData = {
      ...data,
      username: data.username || undefined,
      class_level: data.class_level || undefined,
      title: data.title || undefined,
      photo: data.photo || undefined,
    };
    delete prismaData.file;

    const result = await prisma.teacher.create({ data: prismaData });
    return result;
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("ชื่อผู้ใช้ซ้ำในฐานข้อมูล");
    }
    throw err;
  }
};

const updateTeacher = async (id, data) => {
  try {
    if (data.password && !data.username) {
      throw new Error("หากมีรหัสผ่าน ต้องระบุชื่อผู้ใช้ด้วย");
    }

    if (data.username && data.username.trim() !== "") {
      const existingTeacher = await prisma.teacher.findFirst({
        where: {
          username: data.username,
          NOT: { id: id }, // ✅ ใช้ findFirst + NOT
        },
      });
      if (existingTeacher) {
        const error = new Error("ชื่อผู้ใช้ถูกใช้แล้ว");
        error.statusCode = 409;
        throw error;
      }
    }

    if (data.class_level !== undefined && data.class_level !== null) {
      data.class_level = parseInt(data.class_level);
      if (isNaN(data.class_level)) {
        throw new Error("class_level ต้องเป็นตัวเลขที่ถูกต้อง");
      }
    }

    if (data.title) data.title = parseInt(data.title);
    if (data.file) {
      data.photo = data.file.path.replace(/\\/g, '/');
    }

    // ✅ hash password ถ้ามีส่งมา
    if (data.password) {
      data.password = await argon2.hash(data.password);
    }

    const prismaData = {
      ...data,
      username: data.username || undefined,
      class_level: data.class_level || undefined,
      title: data.title || undefined,
      photo: data.photo || undefined,
    };
    delete prismaData.file;

    const result = await prisma.teacher.update({ where: { id }, data: prismaData });
    return result;
  } catch (err) {
    // if (err.code === "P2002") {
    //   throw new Error("ชื่อผู้ใช้ซ้ำในฐานข้อมูล");
    // }
    throw err;
  }
};

const deleteTeacher = async (id) => {
  return await prisma.teacher.delete({ where: { id } });
};

const getTeacherPhoto = async (id) => {
  return await prisma.teacher.findUnique({ where: { id }, select: { photo: true } });
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherPhoto
};
