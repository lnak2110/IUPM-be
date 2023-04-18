const {
  findManyProjectsByUser,
  findAllListsInProject,
  findOneProjectsUsers,
  findOneProjectWithMembersListsTasks,
  createOneProject,
  updateOneProject,
  updateOneProjectToggleDone,
  updateOneProjectAddOneMember,
  updateOneProjectDeleteOneMember,
  updateOneProjectManyMembers,
  deleteOneProject,
  findOneProject,
} = require('../services/project.service');
const {
  successCode,
  failCode,
  notFoundCode,
  errorCode,
} = require('../utils/response');

const getProjectsByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await findManyProjectsByUser(id);

    if (result) {
      return successCode(
        res,
        `Get projects with user id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getProjectLists = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await findAllListsInProject(id);

    if (result) {
      return successCode(
        res,
        `Get all lists in project with id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const { data } = req.query;

    if (data.trim().toLowerCase() === 'short') {
      const result = await findOneProject(id);

      if (result) {
        return successCode(
          res,
          `Get project with id ${id} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, 'Project not found!');
      }
    }

    const result = await findOneProjectWithMembersListsTasks(id);

    if (result) {
      return successCode(
        res,
        `Get project with id ${id} successfully!`,
        result
      );
    } else {
      return notFoundCode(res, 'Project not found!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const createProject = async (req, res) => {
  try {
    const { id } = req.userRequest;

    const { name, description, deadline } = req.body;

    const newProjectData = {
      name,
      description,
      deadline: new Date(deadline),
      leaderId: id,
    };

    const result = await createOneProject(newProjectData);

    if (result) {
      return successCode(res, `Create a new project successfully!`, result);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, deadline } = req.body;

    const newProjectData = {
      name,
      description,
      deadline: new Date(deadline),
    };

    const result = await updateOneProject(id, newProjectData);

    if (result) {
      return successCode(
        res,
        `Update project with id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateProjectToggleDone = async (req, res) => {
  try {
    const { id } = req.params;

    const { isDone } = req.projectFound;

    const result = await updateOneProjectToggleDone(id, !isDone);

    if (result) {
      if (result.isDone) {
        return successCode(
          res,
          `Set project with id ${id} done successfully!`,
          result
        );
      } else {
        return successCode(
          res,
          `Set project with id ${id} undone successfully!`,
          result
        );
      }
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateProjectAddMember = async (req, res) => {
  try {
    const { id } = req.params;

    const { id: userId } = req.body;

    const { leaderId } = req.projectFound;

    const result = await updateOneProjectAddOneMember(id, userId, leaderId);

    if (result) {
      return successCode(
        res,
        `Add one member to project with id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateProjectDeleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const { id: userId } = req.body;

    const { leaderId } = req.projectFound;

    if (userId === leaderId) {
      return failCode(res, 'Cannot delete leader from project!');
    }

    const isUserInProject = await findOneProjectsUsers(id, userId);

    if (!isUserInProject) {
      return failCode(res, 'User is not in project!');
    }

    const result = await updateOneProjectDeleteOneMember(id, userId);

    if (result) {
      return successCode(
        res,
        `Delete one member from project with id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateProjectManyMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const { idsArr } = req.body;

    const { leaderId } = req.projectFound;

    const isLeaderInNewList = idsArr.find((userId) => userId === leaderId);

    if (!isLeaderInNewList) {
      return failCode(res, 'Cannot delete leader from project!');
    }

    const result = await updateOneProjectManyMembers(id, idsArr, leaderId);

    if (result) {
      return successCode(
        res,
        `Update members of project with id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteOneProject(id);

    if (result) {
      return successCode(
        res,
        `Delete project with id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getProjectsByUser,
  getProjectLists,
  getProject,
  createProject,
  updateProject,
  updateProjectToggleDone,
  updateProjectAddMember,
  updateProjectDeleteMember,
  updateProjectManyMembers,
  deleteProject,
};
