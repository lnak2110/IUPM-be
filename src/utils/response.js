// 200
const successCode = (res, message, data) => {
  if (data) {
    return res.status(200).json({
      status: 'Success',
      message,
      content: data,
    });
  } else {
    return res.status(200).json({
      status: 'Success',
      message,
    });
  }
};

// 400
const failCode = (res, message = 'Invalid or wrong format input!') => {
  return res.status(400).json({
    status: 'Failure',
    message,
  });
};

// 401
const unauthCode = (res, message = 'Unauthorize!') => {
  return res.status(401).json({
    status: 'Failure',
    message,
  });
};

// 403
const forbiddenCode = (res, message = 'Forbidden resources!') => {
  return res.status(403).json({
    status: 'Failure',
    message,
  });
};

// 404
const notFoundCode = (res, message = 'Not found...') => {
  return res.status(404).json({
    status: 'Failure',
    message,
  });
};

// 500
const errorCode = (res, message = 'Server error!') => {
  return res.status(500).json({
    status: 'Failure',
    message,
  });
};

module.exports = {
  successCode,
  failCode,
  unauthCode,
  forbiddenCode,
  notFoundCode,
  errorCode,
};
