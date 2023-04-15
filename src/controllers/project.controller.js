const {
  createOneProject,
  updateOneProject,
  updateOneProjectAddOneMember,
  updateOneProjectManyMembers,
  findManyProjectsByUser,
} = require('../services/project.service');
const { successCode, errorCode } = require('../utils/response');

const getProjectsByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await findManyProjectsByUser(id);

    return successCode(
      res,
      `Get projects with user id ${id} successfully!`,
      result
    );
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getProject = (req, res) => {
  try {
    const { id } = req.params;

    const { projectFound } = req;

    return successCode(
      res,
      `Get project with id ${id} successfully!`,
      projectFound
    );
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

const updateProjectAddOneMember = async (req, res) => {
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

const updateProjectManyMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const { idsArr } = req.body;

    const { projectMembers, leaderId } = req.projectFound;

    // Need to be disconnect
    const projectMembersIdsNotInNewList = projectMembers
      .map((pm) => pm.user.id)
      .filter((userId) => !idsArr.includes(userId));

    const result = await updateOneProjectManyMembers(
      id,
      idsArr,
      projectMembersIdsNotInNewList,
      leaderId
    );

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

module.exports = {
  getProjectsByUser,
  getProject,
  createProject,
  updateProject,
  updateProjectAddOneMember,
  updateProjectManyMembers,
};
