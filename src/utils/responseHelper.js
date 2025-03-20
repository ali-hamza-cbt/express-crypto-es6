const sendResponse = (res, status, success, message, data = null) => {
  res.status(status).json({ success, message, data });
};

module.exports = { sendResponse };