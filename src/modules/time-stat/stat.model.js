const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

const getFormTimeStat = async () => {
    try {
        const students = await prisma.student.findMany({ where: { status: "in" }, include: { title_relation: true, class_level_relation: true } });
        const classLevel = await prisma.class_level.findMany();
        return { students, classLevel };
    } catch (error) {
        throw new Error(error);
    }
};


module.exports = {
    getFormTimeStat
};
