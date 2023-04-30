const express = require('express');
const {
  userSchema,
  idParamsSchema,
  validateParams,
  validateBody,
  validateImageUrl,
} = require('../utils/validation');
const { checkToken } = require('../utils/jwtoken');
const {
  getAllUsers,
  getAllUsersInProject,
  getUsersOutsideProjectByKeyword,
  getUser,
  updateUser,
} = require('../controllers/user.controller');
const {
  checkPermissionLoggedIn,
  checkUserPermission,
  checkProjectPermission,
  checkProjectMemberPermission,
} = require('../utils/permission');

const userRoute = express.Router();

userRoute.get('/', checkToken, checkPermissionLoggedIn, getAllUsers);

userRoute.get(
  '/project/:id',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectMemberPermission,
  getAllUsersInProject
);

// ?keyword=
userRoute.get(
  'outside/project/:id',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkProjectPermission('params', 'id'),
  getUsersOutsideProjectByKeyword
);

userRoute.get(
  '/:id',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkUserPermission,
  getUser
);

userRoute.patch(
  '/:id',
  checkToken,
  validateBody(userSchema),
  validateImageUrl,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkUserPermission,
  updateUser
);

module.exports = userRoute;
