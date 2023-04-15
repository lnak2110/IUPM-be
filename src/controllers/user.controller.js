const { findOneUser } = require('../services/user.service');
const {
  successCode,
  errorCode,
  failCode,
  notFoundCode,
} = require('../utils/response');

const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await findOneUser(id);

    if (result) {
      return successCode(
        res,
        `Get user detail with id ${id} successfully!`,
        result
      );
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getUserDetail,
};
