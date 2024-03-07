
const success = (res, status, success, message, result) => {
  res.statusMessage = message;
  res.status(status).json({
    status: status,
    success: success,
    message: message,
    data: result,
  }).end();
};

const successToken = (res, status, success, message, result, token,session) => {
  res.statusMessage = message;
  res
    .status(status)
    .json({
      status: status,
      success: success,
      message: message,
      data: result,
      token: token,
      sessionid: session,
    })
    .end();
};

const error = (res, status, success, message, error) => {
   res.statusMessage = message;
   res
     .status(status)
     .json({
       status: status,
       success: success,
       message: message,
       error: error,
     })
     .end();
};

module.exports = {
  success,
  successToken,
  error,
}
