const express = require('express');
const {
  taskSchema,
  updateTaskSchema,
  idParamsSchema,
  validateBody,
  validateParams,
} = require('../utils/validation');
const { checkToken } = require('../utils/jwtoken');
const {
  checkPermissionLoggedIn,
  checkGetTaskPermission,
  checkCreateTaskPermission,
  checkTaskPermission,
} = require('../utils/permission');
const {
  getTask,
  createTask,
  updateTask,
} = require('../controllers/task.controller');
const {
  checkTaskMembersInProject,
  checkTaskName,
  checkTaskDeadline,
} = require('../utils/databaseValidation');

const taskRoute = express.Router();

taskRoute.get(
  '/:id',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkGetTaskPermission,
  getTask
);

taskRoute.post(
  '/',
  checkToken,
  validateBody(taskSchema),
  checkPermissionLoggedIn,
  checkCreateTaskPermission,
  checkTaskMembersInProject,
  checkTaskDeadline,
  checkTaskName,
  createTask
);

taskRoute.put(
  '/:id',
  checkToken,
  validateBody(updateTaskSchema),
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkTaskPermission,
  checkTaskMembersInProject,
  checkTaskDeadline,
  checkTaskName,
  updateTask
);

module.exports = taskRoute;
