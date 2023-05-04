const bcrypt = require('bcrypt');
const { createToken } = require('../utils/jwtoken');
const {
  errorCode,
  failCode,
  successCode,
  notFoundCode,
} = require('../utils/response');
const {
  findOneUserByEmail,
  createOneUser,
} = require('../services/user.service');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userFound = await findOneUserByEmail(email);

    if (userFound) {
      return failCode(res, 'Email already exists!');
    }

    const newUserData = {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    };

    await createOneUser(newUserData);

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
      return notFoundCode(res, 'Email is not registered!');
    }

    const isPasswordCorrect = bcrypt.compareSync(password, userFound.password);

    if (isPasswordCorrect) {
      const accessToken = createToken(userFound.id);

      const { id, name, email, avatar } = userFound;

      const responseData = { id, name, email, avatar, accessToken };

      return successCode(res, 'Login successfully!', responseData);
    } else {
      return failCode(res, 'Wrong combination of email and password!');
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = { register, login };
