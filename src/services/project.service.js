const { userPublicFields, membersOrder } = require('../utils/fields');
const prisma = require('../utils/prisma');

const findManyProjectsByUser = async (id) => {
  const result = await prisma.projectsUsers.findMany({
    where: { userId: id },
    include: { project: true },
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

const updateOneProjectManyMembers = async (
  id,
  idsArr,
  projectMembersIdsNotInNewList,
  leaderId
) => {
  const result = await prisma.project.update({
    where: { id },
    data: {
      projectMembers: {
        deleteMany: {
          projectId: id,
          userId: { in: projectMembersIdsNotInNewList },
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
      userId: { in: projectMembersIdsNotInNewList },
    },
  });

  return result;
};

module.exports = {
  findManyProjectsByUser,
  findOneProject,
  findOneProjectByNameAndLeader,
  findOneProjectWithMembers,
  findOneProjectWithMembersListsTasks,
  createOneProject,
  updateOneProject,
  updateOneProjectAddOneMember,
  updateOneProjectManyMembers,
};
