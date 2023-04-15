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
  getProject,
  createProject,
  updateProject,
  updateProjectAddOneMember,
  updateProjectManyMembers,
} = require('../controllers/project.controller');
const {
  checkProjectName,
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
  checkProjectPermission,
  checkProjectName,
  updateProject
);

projectRoute.patch(
  '/:id/add-member',
  checkToken,
  validateBody(idSchema),
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectPermission,
  checkUserById('body'),
  updateProjectAddOneMember
);

projectRoute.patch(
  '/:id/members',
  checkToken,
  validateBody(idsArraySchema),
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectPermission,
  checkUsersByIds,
  updateProjectManyMembers
);

module.exports = projectRoute;
