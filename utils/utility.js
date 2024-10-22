class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

let userSocketIDs = new Map();
const getUserSocketIDs = () => userSocketIDs;

const getOtherMember = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

const getSockets = (users = []) => {
  const sockets = users.map((user) => userSocketIDs.get(user.toString()));

  return sockets;
};

const emitEvent = (req, event, users, data = {}) => {
  const io = req.app.get("io");
  const usersSocket = getSockets(users);
  io.to(usersSocket).emit(event, data);
};

module.exports = {
  ErrorHandler,
  getOtherMember,
  getSockets,
  emitEvent,
  getUserSocketIDs,
};
