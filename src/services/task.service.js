const { userPublicFields, membersOrder } = require('../utils/fields');
const prisma = require('../utils/prisma');

const findOneTask = async (id) => {
  const result = await prisma.task.findUnique({
    where: { id },
  });

  return result;
};

const findOneTaskWithMembers = async (id) => {
  const result = await prisma.task.findUnique({
    where: { id },
    include: {
      taskMembers: {
        select: {
          user: { select: userPublicFields },
        },
        orderBy: membersOrder,
      },
    },
  });

  return result;
};

const findOneLatestDeadlineTaskByProject = async (id) => {
  const result = await prisma.task.findFirst({
    where: { listProjectId: id },
    orderBy: { deadline: 'desc' },
    take: 1,
  });

  return result;
};

const findOneTaskByNameAndProject = async (name, projectId) => {
  const result = await prisma.task.findUnique({
    where: {
      uniqueTaskNamePerProject: {
        name,
        listProjectId: projectId,
      },
    },
  });

  return result;
};

const countTasksInList = async (projectId, listId) => {
  const result = await prisma.list.findUnique({
    where: {
      projectId_id: {
        projectId,
        id: listId,
      },
    },
    select: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  return result;
};

const createOneTask = async (newTaskData, leaderId) => {
  const result = await prisma.task.create({
    data: {
      ...newTaskData,
      taskMembers: {
        create: newTaskData.taskMembers.map((userId) => ({
          user: { connect: { id: userId } },
          isUserProjectLeader: userId === leaderId,
        })),
      },
    },
  });

  return result;
};

const updateOneTask = async (id, newTaskData, leaderId) => {
  const result = await prisma.task.update({
    where: { id },
    data: {
      ...newTaskData,
      taskMembers: {
        deleteMany: {
          taskId: id,
          userId: { notIn: newTaskData.taskMembers },
        },

        connectOrCreate: newTaskData.taskMembers.map((userId) => ({
          where: {
            taskId_userId: { taskId: id, userId },
          },
          create: {
            user: { connect: { id: userId } },
            isUserProjectLeader: userId === leaderId,
          },
        })),
      },
    },
  });

  return result;
};

const updateOneTaskSameList = async (
  projectId,
  listId,
  id,
  oldIndexNumber,
  newIndexNumber
) => {
  const updateOtherTasks =
    newIndexNumber - oldIndexNumber > 0
      ? prisma.task.updateMany({
          where: {
            listProjectId: projectId,
            listId,
            AND: [
              { indexNumber: { gt: oldIndexNumber } },
              { indexNumber: { lte: newIndexNumber } },
            ],
          },
          data: {
            indexNumber: { decrement: 1 },
          },
        })
      : prisma.task.updateMany({
          where: {
            listProjectId: projectId,
            listId,
            AND: [
              { indexNumber: { lt: oldIndexNumber } },
              { indexNumber: { gte: newIndexNumber } },
            ],
          },
          data: {
            indexNumber: { increment: 1 },
          },
        });

  const updateMainTask = prisma.task.update({
    where: { id },
    data: { indexNumber: newIndexNumber },
  });

  // Execute same time
  const result = prisma.$transaction([updateOtherTasks, updateMainTask]);

  return result;
};

const updateOneTaskNewList = async (
  projectId,
  oldListId,
  newListId,
  id,
  oldIndexNumber,
  newIndexNumber
) => {
  await prisma.task.updateMany({
    where: {
      listProjectId: projectId,
      listId: newListId,
      indexNumber: { gt: newIndexNumber },
    },
    data: {
      indexNumber: { increment: 1 },
    },
  });

  const result = await prisma.task.update({
    where: { id },
    data: { indexNumber: newIndexNumber },
  });

  await prisma.task.updateMany({
    where: {
      listProjectId: projectId,
      listId: oldListId,
      indexNumber: { gt: oldIndexNumber },
    },
    data: {
      indexNumber: { increment: 1 },
    },
  });

  return result;
};

const updateManyTasksDecreaseIndexNumber = async (
  projectId,
  listId,
  indexNumber
) => {
  const result = await prisma.task.updateMany({
    where: {
      listProjectId: projectId,
      listId,
      indexNumber: { gt: indexNumber },
    },
    data: { indexNumber: { decrement: 1 } },
  });

  return result;
};

const deleteOneTask = async (id) => {
  const result = await prisma.task.delete({
    where: { id },
  });

  return result;
};

module.exports = {
  findOneTask,
  findOneTaskWithMembers,
  findOneLatestDeadlineTaskByProject,
  findOneTaskByNameAndProject,
  countTasksInList,
  createOneTask,
  updateOneTask,
  updateOneTaskSameList,
  updateOneTaskNewList,
  updateManyTasksDecreaseIndexNumber,
  deleteOneTask,
};
