const { compareAsc } = require('date-fns');
const {
  findOneProjectByNameAndLeader,
} = require('../services/project.service');
const {
  findOneLatestDeadlineTaskByProject,
  findOneTaskByNameAndProject,
  countTasksInList,
} = require('../services/task.service');
const { failCode, notFoundCode, errorCode } = require('./response');
const {
  findOneUser,
  findManyUsersById,
  findManyUsersByIdInProject,
} = require('../services/user.service');

const checkUserById = (part) => async (req, res, next) => {
  try {
    const { id } = req[part];

    const userFound = await findOneUser(id);

    if (userFound) {
      next();
    } else {
      return notFoundCode(res, 'User not found!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkUsersByIds = async (req, res, next) => {
  try {
    const { idsArr } = req.body;

    const usersFound = await findManyUsersById(idsArr);

    if (usersFound.length === idsArr.length) {
      next();
    } else {
      return notFoundCode(res, 'One or more users not found!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkUsersByIdsInProject = async (req, res, next) => {
  try {
    const { taskMembers } = req.body;

    const { projectFound } = req;

    const usersFound = await findManyUsersByIdInProject(
      taskMembers,
      projectFound.id
    );

    if (usersFound.length === taskMembers.length) {
      next();
    } else {
      return notFoundCode(res, 'One or more users not in project!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkProjectName = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { name } = req.body;

    const { userRequest } = req;

    const projectFound = await findOneProjectByNameAndLeader(
      name,
      userRequest.id
    );

    if (!projectFound || id === projectFound.id) {
      next();
    } else {
      return failCode(res, 'Project name already exists for this user!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

// Updated prroject deadline cannot be earlier than latest task
const checkProjectDeadline = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { deadline } = req.body;

    const taskFound = await findOneLatestDeadlineTaskByProject(id);

    if (!taskFound) {
      next();
    } else {
      if (compareAsc(taskFound.deadline, new Date(deadline)) === 1) {
        return failCode(
          res,
          'Project deadline must be later or equal deadline of lastest task!'
        );
      } else {
        next();
      }
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkTaskName = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { name } = req.body;

    const { id: projectId } = req.projectFound;

    const taskFound = await findOneTaskByNameAndProject(name, projectId);

    if (!taskFound || id === taskFound.id) {
      next();
    } else {
      return failCode(res, 'Task name already exists in this project!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkTaskDeadline = (req, res, next) => {
  try {
    const { deadline } = req.body;

    const { deadline: projectDeadline } = req.projectFound;

    if (compareAsc(new Date(deadline), projectDeadline) === 1) {
      return failCode(
        res,
        'Task deadline must be before or equal project deadline!'
      );
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const checkTaskIndexNumber = async (req, res, next) => {
  try {
    const { listId, indexNumber } = req.body;

    const { listProjectId } = req.taskFound;

    const countResult = await countTasksInList(listProjectId, listId);

    if (!countResult) {
      return errorCode(res);
    }

    if (indexNumber <= countResult._count.tasks) {
      next();
    } else {
      return failCode(res, 'Invalid new indexNumber!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  checkUserById,
  checkUsersByIds,
  checkUsersByIdsInProject,
  checkProjectName,
  checkProjectDeadline,
  checkTaskName,
  checkTaskDeadline,
  checkTaskIndexNumber,
};
