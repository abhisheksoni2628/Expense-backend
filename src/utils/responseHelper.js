exports.sendResponse = (
  res,
  statusBool,
  message,
  result = null,
  statusCode = 200,
  meta = null,
  error = null
) => {
  const response = {
    status: statusBool,
    message,
    response: result,
  };

  // Add meta info if provided (like pagination, counts)
  if (meta) {
    response.meta = meta;
  }

  // Add error details only if provided
  if (error) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};
