const { userPublicFields } = require('../utils/fields');
const prisma = require('../utils/prisma');

const findManyCommentsByTask = async (id) => {
  const result = await prisma.comment.findMany({
    where: { taskId: id },
    include: {
      author: { select: userPublicFields },
    },
    orderBy: { createdAt: 'desc' },
  });

  return result;
};

const findOneComment = async (id) => {
  const result = await prisma.comment.findUnique({
    where: { id },
  });

  return result;
};

const createOneComment = async (newCommentData) => {
  const result = await prisma.comment.create({
    data: newCommentData,
  });

  return result;
};

const updateOneComment = async (id, newCommentData) => {
  const result = await prisma.comment.update({
    where: { id },
    data: newCommentData,
  });

  return result;
};

const deleteOneComment = async (id) => {
  const result = await prisma.comment.delete({
    where: { id },
  });

  return result;
};

module.exports = {
  findManyCommentsByTask,
  findOneComment,
  createOneComment,
  updateOneComment,
  deleteOneComment,
};
