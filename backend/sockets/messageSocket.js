const Message = require('../models/Message');

module.exports = (io) => {
  const users = {};

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('user_join', (userId) => {
      users[userId] = socket.id;
      io.emit('users_online', Object.keys(users));
    });

    socket.on('send_message', async (data) => {
      try {
        const message = new Message(data);
        await message.save();
        
        const recipientSocket = users[data.recipientId];
        if (recipientSocket) {
          io.to(recipientSocket).emit('receive_message', message);
        }
        socket.emit('message_sent', message);
      } catch (error) {
        socket.emit('message_error', { error: error.message });
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of Object.entries(users)) {
        if (socketId === socket.id) {
          delete users[userId];
          io.emit('users_online', Object.keys(users));
          break;
        }
      }
    });
  });
};
