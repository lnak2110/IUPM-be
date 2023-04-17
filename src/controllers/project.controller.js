const {
  findManyProjectsByUser,
  findOneProjectWithMembersListsTasks,
  createOneProject,
  updateOneProject,
  updateOneProjectAddOneMember,
  updateOneProjectDeleteOneMember,
  updateOneProjectManyMembers,
  deleteOneProject,
  findOneProjectsUsers,
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
    } else {
      return errorCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;

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
    } else {
      return errorCode(res);
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
    } else {
      return errorCode(res);
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
    } else {
      return errorCode(res);
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
    } else {
      return errorCode(res);
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
    } else {
      return errorCode(res);
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
    } else {
      return errorCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getProjectsByUser,
  getProject,
  createProject,
  updateProject,
  updateProjectAddMember,
  updateProjectDeleteMember,
  updateProjectManyMembers,
  deleteProject,
};
