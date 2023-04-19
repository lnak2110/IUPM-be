const express = require('express');
const { notFoundCode } = require('../utils/response');
const authRoute = require('./auth.route');
const projectRoute = require('./project.route');
const taskRoute = require('./task.route');
const commentRoute = require('./comment.route');
const userRoute = require('./user.route');

const rootRoute = express.Router();

rootRoute.use('/auth', authRoute);
rootRoute.use('/projects', projectRoute);
rootRoute.use('/tasks', taskRoute);
rootRoute.use('/comments', commentRoute);
rootRoute.use('/users', userRoute);
rootRoute.use('*', (_req, res) => notFoundCode(res));

module.exports = rootRoute;
