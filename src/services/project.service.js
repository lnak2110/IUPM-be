const { userPublicFields, membersOrder } = require('../utils/fields');
const prisma = require('../utils/prisma');

const findManyProjectsByUser = async (id) => {
  const result = await prisma.projectsUsers.findMany({
    where: { userId: id },
    include: { project: true },
  });

  return result;
};

const findOneProjectsUsers = async (id, userId) => {
  const result = await prisma.projectsUsers.findUnique({
    where: {
      projectId_userId: { projectId: id, userId },
    },
  });

  return result;
};

const findAllListsInProject = async (id) => {
  const result = await prisma.list.findMany({
    where: { projectId: id },
  });

  return result;
};

const findOneProject = async (id) => {
  const result = await prisma.project.findUnique({
    where: { id },
  });

  return result;
};

const findOneProjectByNameAndLeader = async (name, leaderId) => {
  const result = await prisma.project.findUnique({
    where: {
      uniqueProjectNamePerLeader: { name, leaderId },
    },
  });

  return result;
};

const findOneProjectWithMembers = async (id) => {
  const result = await prisma.project.findUnique({
    where: { id },
    include: {
      projectMembers: {
        select: {
          user: { select: userPublicFields },
        },
        orderBy: membersOrder,
      },
    },
  });

  return result;
};

const findOneProjectWithMembersListsTasks = async (id) => {
  const result = await prisma.project.findUnique({
    where: { id },
    include: {
      projectMembers: {
        select: {
          user: { select: userPublicFields },
        },
        orderBy: membersOrder,
      },
      lists: {
        include: {
          tasks: {
            include: {
              taskMembers: {
                select: {
                  user: { select: userPublicFields },
                },
                orderBy: membersOrder,
              },
            },
            orderBy: { indexNumber: 'asc' },
          },
        },
      },
    },
  });

  return result;
};

const createOneProject = async (newProjectData) => {
  const result = await prisma.project.create({
    data: {
      ...newProjectData,
      lists: {
        create: [
          { id: 1, name: 'To do' },
          { id: 2, name: 'Doing' },
          { id: 3, name: 'Reviewing' },
          { id: 4, name: 'Done' },
        ],
      },
      projectMembers: {
        create: {
          userId: newProjectData.leaderId,
          isUserProjectLeader: true,
        },
      },
    },
  });

  return result;
};

const updateOneProject = async (id, newProjectData) => {
  const result = await prisma.project.update({
    where: { id },
    data: newProjectData,
  });

  return result;
};

const updateOneProjectToggleDone = async (id, isDone) => {
  const result = await prisma.project.update({
    where: { id },
    data: {
      isDone: { set: isDone },
    },
  });

  return result;
};

const updateOneProjectAddOneMember = async (id, userId, leaderId) => {
  const result = await prisma.project.update({
    where: { id },
    data: {
      projectMembers: {
        connectOrCreate: {
          where: {
            projectId_userId: { projectId: id, userId },
          },
          create: {
            userId,
            isUserProjectLeader: userId === leaderId,
          },
        },
      },
    },
  });

  return result;
};

const updateOneProjectDeleteOneMember = async (id, userId) => {
  const result = await prisma.project.update({
    where: { id },
    data: {
      projectMembers: {
        delete: {
          projectId_userId: { projectId: id, userId },
        },
      },
    },
  });

  await prisma.tasksUsers.deleteMany({
    where: {
      task: { listProjectId: id },
      userId: { equals: userId },
    },
  });

  return result;
};

const updateOneProjectManyMembers = async (id, idsArr, leaderId) => {
  const result = await prisma.project.update({
    where: { id },
    data: {
      projectMembers: {
        deleteMany: {
          projectId: id,
          userId: { notIn: idsArr },
        },

        connectOrCreate: idsArr.map((userId) => ({
          where: {
            projectId_userId: { projectId: id, userId },
          },
          create: {
            userId,
            isUserProjectLeader: userId === leaderId,
          },
        })),
      },
    },
  });

  await prisma.tasksUsers.deleteMany({
    where: {
      task: { listProjectId: id },
      userId: { notIn: idsArr },
    },
  });

  return result;
};

const deleteOneProject = async (id) => {
  const result = await prisma.project.delete({
    where: { id },
  });

  return result;
};

module.exports = {
  findManyProjectsByUser,
  findOneProjectsUsers,
  findAllListsInProject,
  findOneProject,
  findOneProjectByNameAndLeader,
  findOneProjectWithMembers,
  findOneProjectWithMembersListsTasks,
  createOneProject,
  updateOneProject,
  updateOneProjectToggleDone,
  updateOneProjectAddOneMember,
  updateOneProjectDeleteOneMember,
  updateOneProjectManyMembers,
  deleteOneProject,
};
