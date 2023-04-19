const {
  updateOneUser,
  findOneUserByEmail,
} = require('../services/user.service');
const { successCode, failCode, errorCode } = require('../utils/response');

const getUser = async (req, res) => {
  try {
    const { userRequest } = req;

    if (userRequest) {
      return successCode(
        res,
        `Get user detail with id ${userRequest.id} successfully!`,
        userRequest
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, avatar } = req.body;

    const userFound = await findOneUserByEmail(email);

    if (userFound && userFound.id !== id) {
      return failCode(res, 'Email already exists!');
    }

    const newUserData = { name, email, avatar };

    const result = await updateOneUser(id, newUserData);

    if (result) {
      return successCode(
        res,
        `Update user with id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getUser,
  updateUser,
};
