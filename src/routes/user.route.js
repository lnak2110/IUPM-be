const express = require('express');
const { idSchema, validateParams } = require('../utils/validation');
const { checkToken } = require('../utils/jwtoken');
const { getUserDetail } = require('../controllers/user.controller');
const { checkUserPermission } = require('../utils/permission');

const userRoute = express.Router();

userRoute.get(
  '/:id',
  checkToken,
  validateParams(idSchema),
  checkUserPermission,
  getUserDetail
);

module.exports = userRoute;
