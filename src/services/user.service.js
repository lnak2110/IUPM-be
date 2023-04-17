const {
  userWithoutPassword,
  userWithoutPasswordWithRole,
  userPublicFields,
} = require('../utils/fields');
const prisma = require('../utils/prisma');

const findAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: userWithoutPassword,
  });

  return result;
};

const findManyUsersByName = async (userNameKeyword) => {
  const result = await prisma.user.findMany({
    where: {
      userName: {
        contains: userNameKeyword,
      },
    },
    select: userWithoutPassword,
  });

  return result;
};

const findManyUsersByNamePagination = async (userNameKeyword, page, size) => {
  const result = await prisma.user.findMany({
    skip: (page - 1) * size,
    take: size,
    where: {
      userName: {
        contains: userNameKeyword,
      },
    },
    select: userWithoutPassword,
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

const findOneUserSelectRoomsOwned = async (userId) => {
  const result = await prisma.user.findUnique({
    where: { userId },
    select: {
      ...userWithoutPassword,
      roomsOwned: true,
    },
  });

  return result;
};

const findOneUserSelectRole = async (userId) => {
  const result = await prisma.user.findUnique({
    where: { userId },
    select: userWithoutPasswordWithRole,
  });

  return result;
};

const findOneUserByEmail = async (email) => {
  const result = await prisma.user.findUnique({
    where: { email },
  });

  return result;
};

const updateAvatarOfOneUser = async (userId, newUserAvatar) => {
  const result = await prisma.user.update({
    where: { userId },
    data: { avatar: newUserAvatar },
    select: userWithoutPassword,
  });

  return result;
};

const updateOneUser = async (userId, newUserData) => {
  const result = await prisma.user.update({
    where: { userId },
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
  findManyUsersByName,
  findManyUsersByNamePagination,
  findManyUsersById,
  findManyUsersByIdInProject,
  findOneUser,
  findOneUserSelectRoomsOwned,
  findOneUserSelectRole,
  findOneUserByEmail,
  updateAvatarOfOneUser,
  updateOneUser,
  deleteOneUser,
};
