const { verifyToken } = require('./jwtoken');
const {
  unauthCode,
  forbiddenCode,
  notFoundCode,
  errorCode,
} = require('./response');
const { findOneUser } = require('../services/user.service');
const {
  findOneProjectsUsers,
  findOneProject,
  findOneProjectWithMembers,
} = require('../services/project.service');
const { findOneTaskWithMembers } = require('../services/task.service');

// All roles
const checkPermissionLoggedIn = async (req, res, next) => {
  try {
    const userId = verifyToken(req.headers.authorization.split(' ')[1]).content;

    const userRequest = await findOneUser(userId);

    if (userRequest) {
      req.userRequest = userRequest;
      next();
    } else {
      return unauthCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkUserPermission = (req, res, next) => {
  try {
    const { id } = req.params;

    const { userRequest } = req;

    if (id === userRequest.id || userRequest.isAdmin) {
      next();
    } else {
      return forbiddenCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkProjectPermission = (part, field) => async (req, res, next) => {
  try {
    const projectId = req[part][field];

    const { userRequest } = req;

    const projectFound = await findOneProject(projectId);

    if (projectFound) {
      if (userRequest.id === projectFound.leaderId || userRequest.isAdmin) {
        req.projectFound = projectFound;
        next();
      } else {
        return forbiddenCode(res);
      }
    } else {
      return notFoundCode(res, 'Project not found!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkProjectMemberPermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { userRequest } = req;

    const isUserInProject = await findOneProjectsUsers(id, userRequest.id);

    if (isUserInProject || userRequest.isAdmin) {
      next();
    } else {
      return forbiddenCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkTaskPermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { userRequest } = req;

    const taskFound = await findOneTaskWithMembers(id);

    if (!taskFound) {
      return notFoundCode(res, 'Task not found!');
    }

    const projectFound = await findOneProjectWithMembers(
      taskFound.listProjectId
    );

    if (projectFound) {
      if (userRequest.id === projectFound.leaderId || userRequest.isAdmin) {
        req.projectFound = projectFound;
        req.taskFound = taskFound;
        next();
      } else {
        return forbiddenCode(res);
      }
    } else {
      return notFoundCode(res, 'Project not found!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  checkPermissionLoggedIn,
  checkUserPermission,
  checkProjectPermission,
  checkProjectMemberPermission,
  checkTaskPermission,
};
