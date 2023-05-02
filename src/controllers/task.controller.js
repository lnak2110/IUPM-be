const {
  countTasksInList,
  createOneTask,
  updateOneTask,
  updateOneTaskSameList,
  updateOneTaskNewList,
  updateManyTasksDecreaseIndexNumber,
  deleteOneTask,
} = require('../services/task.service');
const { successCode, errorCode } = require('../utils/response');

const getTask = async (req, res) => {
  try {
    const { taskFound } = req;

    if (taskFound) {
      return successCode(
        res,
        `Get task with id ${taskFound.id} successfully!`,
        taskFound
      );
    }
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

    if (listId === taskFound.listId) {
      const newTaskData = {
        name,
        description,
        deadline: new Date(deadline),
        taskMembers,
      };

      const result = await updateOneTask(
        id,
        newTaskData,
        projectFound.leaderId
      );

      if (result) {
        return successCode(
          res,
          `Update task with id ${id} successfully!`,
          result
        );
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
        projectFound.leaderId
      );

      await updateManyTasksDecreaseIndexNumber(
        projectFound.id,
        taskFound.listId,
        taskFound.indexNumber
      );

      if (result) {
        return successCode(
          res,
          `Update task with id ${id} successfully!`,
          result
        );
      }
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateTaskList = async (req, res) => {
  try {
    const { id } = req.params;

    const { taskFound, projectFound } = req;

    const { listId, indexNumber } = req.body;

    if (listId === taskFound.listId) {
      const result = await updateOneTaskSameList(
        projectFound.id,
        listId,
        id,
        taskFound.indexNumber,
        indexNumber
      );

      if (result) {
        return successCode(
          res,
          `Update task with id ${id} successfully!`,
          result
        );
      } else {
        return errorCode(res);
      }
    } else {
      const result = await updateOneTaskNewList(
        projectFound.id,
        taskFound.listId,
        listId,
        id,
        taskFound.indexNumber,
        indexNumber
      );

      if (result) {
        return successCode(
          res,
          `Update task with id ${id} successfully!`,
          result
        );
      }
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteOneTask(id);

    if (result) {
      return successCode(
        res,
        `Delete task with id ${id} successfully!`,
        result
      );
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
  updateTaskList,
  deleteTask,
};
