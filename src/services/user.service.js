const { membersOrder } = require('../utils/fields');
const { userWithoutPassword, userPublicFields } = require('../utils/fields');
const prisma = require('../utils/prisma');

const findAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: userPublicFields,
    orderBy: { email: 'asc' },
  });

  return result;
};

const findAllUsersInProject = async (projectId) => {
  const result = await prisma.projectsUsers.findMany({
    where: { projectId },
    select: {
      user: { select: userPublicFields },
    },
    orderBy: membersOrder,
  });

  return result;
};

const findManyUsersOutsideProjectByKeyword = async (projectId, keyword) => {
  const result = await prisma.user.findMany({
    where: {
      memberInProjects: {
        every: { projectId: { notIn: projectId } },
      },
      OR: [{ email: { contains: keyword } }, { name: { contains: keyword } }],
    },
    select: userPublicFields,
  });

  return result;
};

const findManyUsersById = async (idsArr) => {
  const result = await prisma.user.findMany({
    where: {
      id: { in: idsArr },
    },
    select: userPublicFields,
  });

  return result;
};

const findManyUsersByIdInProject = async (idsArr, projectId) => {
  const result = await prisma.projectsUsers.findMany({
    where: {
      userId: { in: idsArr },
      projectId,
    },
  });

  return result;
};

const findOneUser = async (id) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: userWithoutPassword,
  });

  return result;
};

const findOneUserByEmail = async (email) => {
  const result = await prisma.user.findUnique({
    where: { email },
  });

  return result;
};

const createOneUser = async (newUserData) => {
  const result = await prisma.user.create({
    data: newUserData,
  });

  return result;
};

const updateOneUser = async (id, newUserData) => {
  const result = await prisma.user.update({
    where: { id },
    data: newUserData,
    select: userWithoutPassword,
  });

  return result;
};

const deleteOneUser = async (userId) => {
  await prisma.room.deleteMany({
    where: { ownerId: userId },
  });

  await prisma.bookRoom.deleteMany({
    where: { userBookId: userId },
  });

  await prisma.comment.deleteMany({
    where: { userCommentId: userId },
  });

  const result = await prisma.user.delete({
    where: { userId },
    select: userWithoutPassword,
  });

  return result;
};

module.exports = {
  findAllUsers,
  findAllUsersInProject,
  findManyUsersOutsideProjectByKeyword,
  findManyUsersById,
  findManyUsersByIdInProject,
  findOneUser,
  findOneUserByEmail,
  createOneUser,
  updateOneUser,
  deleteOneUser,
};
