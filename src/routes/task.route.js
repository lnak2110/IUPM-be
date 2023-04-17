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
  checkProjectPermission,
  checkProjectMemberPermission,
  checkTaskPermission,
} = require('../utils/permission');
const {
  getTask,
  createTask,
  updateTask,
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
  checkProjectMemberPermission,
  getTask
);

taskRoute.post(
  '/',
  checkToken,
  validateBody(taskSchema),
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
  validateBody(updateTaskSchema),
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkTaskPermission,
  checkUsersByIdsInProject,
  checkTaskDeadline,
  checkTaskName,
  updateTask
);

module.exports = taskRoute;
