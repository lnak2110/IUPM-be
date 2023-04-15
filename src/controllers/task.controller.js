const {
  createOneTask,
  updateOneTask,
  countTasksInList,
} = require('../services/task.service');
const { successCode, errorCode } = require('../utils/response');

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { taskFound } = req;

    return successCode(res, `Get task with id ${id} successfully!`, taskFound);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const createTask = async (req, res) => {
  try {
    const { leaderId } = req.projectFound;

    const { name, description, deadline, listId, listProjectId, taskMembers } =
      req.body;

    const countResult = await countTasksInList(listProjectId, listId);

    if (!countResult) {
      return errorCode(res);
    }

    const newTaskData = {
      name,
      description,
      deadline: new Date(deadline),
      indexNumber: countResult._count.tasks,
      listId,
      listProjectId,
      taskMembers,
    };

    const result = await createOneTask(newTaskData, leaderId);

    if (result) {
      return successCode(res, `Create a new task successfully!`, result);
    } else {
      return errorCode(res);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { taskFound, projectFound } = req;

    const { name, description, deadline, listId, taskMembers } = req.body;

    // Need to be disconnect
    const taskMembersIdsNotInNewList = taskFound.taskMembers
      .map((tm) => tm.user.id)
      .filter((member) => !taskMembers.includes(member));

    if (listId === taskFound.listId) {
      const newTaskData = {
        name,
        description,
        deadline: new Date(deadline),
        listId,
        taskMembers,
      };

      const result = await updateOneTask(
        id,
        newTaskData,
        taskMembersIdsNotInNewList,
        projectFound.leaderId
      );

      if (result) {
        return successCode(res, `Update a task successfully!`, result);
      } else {
        return errorCode(res);
      }
    } else {
      const countResult = await countTasksInList(
        taskFound.listProjectId,
        listId
      );

      if (!countResult) {
        return errorCode(res);
      }

      const newTaskData = {
        name,
        description,
        deadline: new Date(deadline),
        indexNumber: countResult._count.tasks,
        listId,
        taskMembers,
      };

      const result = await updateOneTask(
        id,
        newTaskData,
        taskMembersIdsNotInNewList,
        projectFound.leaderId
      );

      if (result) {
        return successCode(res, `Update a task successfully!`, result);
      } else {
        return errorCode(res);
      }
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getTask,
  createTask,
  updateTask,
};
