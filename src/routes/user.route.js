const express = require('express');
const {
  userSchema,
  idParamsSchema,
  validateParams,
  validateBody,
  validateImageUrl,
} = require('../utils/validation');
const { checkToken } = require('../utils/jwtoken');
const { getUser, updateUser } = require('../controllers/user.controller');
const {
  checkPermissionLoggedIn,
  checkUserPermission,
} = require('../utils/permission');

const userRoute = express.Router();

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
