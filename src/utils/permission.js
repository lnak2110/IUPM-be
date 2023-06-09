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
} = require('../services/project.service');
const {
  findOneTask,
  findOneTaskWithMembers,
} = require('../services/task.service');
const { findOneComment } = require('../services/comment.service');

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

const checkGetTaskPermission =
  (selectMembers = true) =>
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const { userRequest } = req;

      const taskFound = selectMembers
        ? await findOneTaskWithMembers(id)
        : await findOneTask(id);

      if (!taskFound) {
        return notFoundCode(res, 'Task not found!');
      }

      const isUserInProject = await findOneProjectsUsers(
        taskFound.listProjectId,
        userRequest.id
      );

      if (isUserInProject || userRequest.isAdmin) {
        selectMembers && (req.taskFound = taskFound);
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

    const taskFound = await findOneTask(id);

    if (!taskFound) {
      return notFoundCode(res, 'Task not found!');
    }

    const projectFound = await findOneProject(taskFound.listProjectId);

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

const checkCreateCommentPermission = async (req, res, next) => {
  try {
    const { taskId } = req.body;

    const { userRequest } = req;

    const taskFound = await findOneTask(taskId);

    if (!taskFound) {
      return notFoundCode(res, 'Task not found!');
    }

    const isUserInProject = await findOneProjectsUsers(
      taskFound.listProjectId,
      userRequest.id
    );

    if (isUserInProject || userRequest.isAdmin) {
      req.taskFound = taskFound;
      next();
    } else {
      return forbiddenCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkCommentPermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { userRequest } = req;

    const commentFound = await findOneComment(id);

    if (!commentFound) {
      return notFoundCode(res, 'Comment not found!');
    }

    const isUserInProject = await findOneProjectsUsers(
      commentFound.projectId,
      userRequest.id
    );

    if (!isUserInProject) {
      return forbiddenCode(res);
    }

    if (userRequest.id === commentFound.authorId || userRequest.isAdmin) {
      next();
    } else {
      return forbiddenCode(res);
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
  checkTaskPermission,
  checkCreateCommentPermission,
  checkCommentPermission,
};
