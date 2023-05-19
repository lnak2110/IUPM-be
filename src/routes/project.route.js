const express = require('express');
const {
  projectSchema,
  idSchema,
  idsArraySchema,
  idParamsSchema,
  validateBody,
  validateParams,
} = require('../utils/validation');
const { checkToken } = require('../utils/jwtoken');
const {
  checkPermissionLoggedIn,
  checkUserPermission,
  checkProjectPermission,
  checkProjectMemberPermission,
} = require('../utils/permission');
const {
  getProjectsByUser,
  getProjectLists,
  getProject,
  createProject,
  updateProject,
  updateProjectToggleDone,
  updateProjectAddMember,
  updateProjectDeleteMember,
  updateProjectManyMembers,
  deleteProject,
} = require('../controllers/project.controller');
const {
  checkProjectName,
  checkProjectDeadline,
  checkUserById,
  checkUsersByIds,
} = require('../utils/databaseValidation');

const projectRoute = express.Router();

projectRoute.get(
  '/user/:id',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkUserById('params'),
  checkUserPermission,
  getProjectsByUser
);

projectRoute.get(
  '/:id/lists',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectMemberPermission,
  getProjectLists
);

// ?data=basic for basic data
projectRoute.get(
  '/:id',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectMemberPermission,
  getProject
);

projectRoute.post(
  '/',
  checkToken,
  validateBody(projectSchema),
  checkPermissionLoggedIn,
  checkProjectName,
  createProject
);

projectRoute.put(
  '/:id',
  checkToken,
  validateBody(projectSchema),
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectPermission('params', 'id'),
  checkProjectName,
  checkProjectDeadline,
  updateProject
);

projectRoute.patch(
  '/:id/toggle-done',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectPermission('params', 'id'),
  updateProjectToggleDone
);

projectRoute.patch(
  '/:id/add-member',
  checkToken,
  validateBody(idSchema),
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectPermission('params', 'id'),
  checkUserById('body'),
  updateProjectAddMember
);

projectRoute.patch(
  '/:id/delete-member',
  checkToken,
  validateBody(idSchema),
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectPermission('params', 'id'),
  checkUserById('body'),
  updateProjectDeleteMember
);

projectRoute.patch(
  '/:id/members',
  checkToken,
  validateBody(idsArraySchema),
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectPermission('params', 'id'),
  checkUsersByIds,
  updateProjectManyMembers
);

projectRoute.delete(
  '/:id',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectPermission('params', 'id'),
  deleteProject
);

module.exports = projectRoute;
