const express = require('express');
const {
  idParamsSchema,
  taskSchema,
  validateBody,
  validateParams,
} = require('../utils/validation');
const { checkToken } = require('../utils/jwtoken');
const {
  checkPermissionLoggedIn,
  checkProjectPermission,
  checkGetTaskPermission,
  checkTaskPermission,
} = require('../utils/permission');
const {
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const {
  checkUsersByIdsInProject,
  checkTaskName,
  checkTaskDeadline,
} = require('../utils/databaseValidation');

const taskRoute = express.Router();

taskRoute.get(
  '/:id',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkGetTaskPermission(),
  getTask
);

taskRoute.post(
  '/',
  checkToken,
  validateBody(taskSchema()),
  checkPermissionLoggedIn,
  checkProjectPermission('body', 'listProjectId'),
  checkUsersByIdsInProject,
  checkTaskDeadline,
  checkTaskName,
  createTask
);

taskRoute.put(
  '/:id',
  checkToken,
  validateBody(taskSchema(false)),
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkTaskPermission,
  checkUsersByIdsInProject,
  checkTaskDeadline,
  checkTaskName,
  updateTask
);

taskRoute.delete(
  '/:id',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkTaskPermission,
  deleteTask
);

module.exports = taskRoute;
