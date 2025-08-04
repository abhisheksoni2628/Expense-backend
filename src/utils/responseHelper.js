exports.sendResponse = (res, statusBool, message, result = null, statusCode = 200) => {
  return res.status(statusCode).json({
    status: statusBool,
    message: message,
    response: result,
  });
};
