const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const {
  registerSchema,
  loginSchema,
  validateBody,
} = require('../utils/validation');

const authRoute = express.Router();

authRoute.post('/register', validateBody(registerSchema), register);
authRoute.post('/login', validateBody(loginSchema), login);

module.exports = authRoute;
