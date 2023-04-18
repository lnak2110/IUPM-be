const express = require('express');
const {
  idParamsSchema,
  validateBody,
  validateParams,
  commentSchema,
} = require('../utils/validation');
const { checkToken } = require('../utils/jwtoken');
const {
  checkPermissionLoggedIn,
  checkGetTaskPermission,
  checkCreateCommentPermission,
  checkCommentPermission,
} = require('../utils/permission');
const {
  createComment,
  updateComment,
  getCommentsByTask,
  deleteComment,
} = require('../controllers/comment.controller');

const commentRoute = express.Router();

commentRoute.get(
  '/task/:id',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkGetTaskPermission(false),
  getCommentsByTask
);

commentRoute.post(
  '/',
  checkToken,
  validateBody(commentSchema()),
  checkPermissionLoggedIn,
  checkCreateCommentPermission,
  createComment
);

commentRoute.patch(
  '/:id',
  checkToken,
  validateBody(commentSchema(false)),
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkCommentPermission,
  updateComment
);

commentRoute.delete(
  '/:id',
  checkToken,
  validateParams(idParamsSchema),
  checkPermissionLoggedIn,
  checkCommentPermission,
  deleteComment
);

module.exports = commentRoute;
