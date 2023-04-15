const { verifyToken } = require('./jwtoken');
const {
  unauthCode,
  forbiddenCode,
  notFoundCode,
  errorCode,
} = require('./response');
const { findOneUser } = require('../services/user.service');
const {
  findOneProject,
  findOneProjectWithMembers,
  findOneProjectWithMembersListsTasks,
} = require('../services/project.service');
const {
  findOneTaskWithMembersAndComments,
  findOneTaskWithMembers,
} = require('../services/task.service');

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

const checkProjectPermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { userRequest } = req;

    const projectFound = await findOneProjectWithMembers(id);

    if (projectFound) {
      if (userRequest.id === projectFound.leaderId || userRequest.isAdmin) {
        req.projectFound = projectFound;
        next();
      } else {
        return forbiddenCode(res);
      }
    } else {
      return notFoundCode(res, 'Project does not exist!');
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

    const projectFound = await findOneProjectWithMembersListsTasks(id);

    if (projectFound) {
      if (
        projectFound.projectMembers.find(
          (pm) => pm.user.id === userRequest.id
        ) ||
        userRequest.isAdmin
      ) {
        req.projectFound = projectFound;
        next();
      } else {
        return forbiddenCode(res);
      }
    } else {
      return notFoundCode(res, 'Project does not exist!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkGetTaskPermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { userRequest } = req;

    const taskFound = await findOneTaskWithMembersAndComments(id);

    if (!taskFound) {
      return notFoundCode(res, 'Task does not exist!');
    }

    const projectFound = await findOneProjectWithMembers(
      taskFound.listProjectId
    );

    if (projectFound) {
      if (
        projectFound.projectMembers.find(
          (pm) => pm.user.id === userRequest.id
        ) ||
        userRequest.isAdmin
      ) {
        req.taskFound = taskFound;
        next();
      } else {
        return forbiddenCode(res);
      }
    } else {
      return notFoundCode(res, 'Project does not exist!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkCreateTaskPermission = async (req, res, next) => {
  try {
    const { listProjectId } = req.body;

    const { userRequest } = req;

    const projectFound = await findOneProjectWithMembers(listProjectId);

    if (projectFound) {
      if (userRequest.id === projectFound.leaderId || userRequest.isAdmin) {
        req.projectFound = projectFound;
        next();
      } else {
        return forbiddenCode(res);
      }
    } else {
      return notFoundCode(res, 'Project does not exist!');
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
      return notFoundCode(res, 'Task does not exist!');
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
      return notFoundCode(res, 'Project does not exist!');
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
  checkGetTaskPermission,
  checkCreateTaskPermission,
  checkTaskPermission,
};
