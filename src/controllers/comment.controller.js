const {
  findManyCommentsByTask,
  createOneComment,
  updateOneComment,
  deleteOneComment,
} = require('../services/comment.service');
const { successCode, errorCode } = require('../utils/response');

const getCommentsByTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await findManyCommentsByTask(id);

    if (result) {
      return successCode(
        res,
        `Get comments with task id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const createComment = async (req, res) => {
  try {
    const { userRequest, taskFound } = req;

    const { content } = req.body;

    const newCommentData = {
      content,
      authorId: userRequest.id,
      taskId: taskFound.id,
      projectId: taskFound.listProjectId,
    };

    const result = await createOneComment(newCommentData);

    if (result) {
      return successCode(res, `Create a new comment successfully!`, result);
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;

    const { content } = req.body;

    const newCommentData = { content };

    const result = await updateOneComment(id, newCommentData);

    if (result) {
      return successCode(
        res,
        `Update comment with id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteOneComment(id);

    if (result) {
      return successCode(
        res,
        `Delete comment with id ${id} successfully!`,
        result
      );
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getCommentsByTask,
  createComment,
  updateComment,
  deleteComment,
};
