const {
  findAllUsers,
  findAllUsersInProject,
  findOneUserByEmail,
  updateOneUser,
  findManyUsersOutsideProjectByKeyword,
} = require('../services/user.service');
const { successCode, failCode, errorCode } = require('../utils/response');

const getAllUsers = async (_req, res) => {
  try {
    const result = await findAllUsers();

    if (result) {
      return successCode(res, `Get all users successfully!`, result);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getAllUsersInProject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await findAllUsersInProject(id);

    if (result) {
      return successCode(
        res,
        `Get all users in project with id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getUsersOutsideProjectByKeyword = async (req, res) => {
  try {
    const { id } = req.params;

    const { keyword = '' } = req.query;

    const result = await findManyUsersOutsideProjectByKeyword(id, keyword);

    if (result) {
      return successCode(
        res,
        `Get all users by keyword outside project with id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

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
  getAllUsers,
  getAllUsersInProject,
  getUsersOutsideProjectByKeyword,
  getUser,
  updateUser,
};
