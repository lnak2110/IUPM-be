const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma');
const { createToken } = require('../utils/jwtoken');
const {
  errorCode,
  failCode,
  successCode,
  notFoundCode,
} = require('../utils/response');
const { findOneUserByEmail } = require('../services/user.service');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userFound = await findOneUserByEmail(email);

    if (userFound) {
      return failCode(res, 'Email already exists!');
    }

    const newUser = {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    };

    await prisma.user.create({
      data: newUser,
    });

    return successCode(res, 'Register successfully!', { email });
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await findOneUserByEmail(email);

    if (!userFound) {
      return notFoundCode(res, 'Email does not exist!');
    }

    const isPasswordCorrect = bcrypt.compareSync(password, userFound.password);

    if (isPasswordCorrect) {
      const token = createToken(userFound.id);

      return successCode(res, 'Login successfully!', token);
    } else {
      return failCode(res, 'Wrong combination of email and password!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = { register, login };
