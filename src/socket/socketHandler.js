const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const redis = require('../config/redis');

module.exports = (io) => {
  // Auth middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('No token provided'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Token invalid'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name}`);

    // Join a room
    socket.on('join-room', async (room) => {
      socket.join(room);
      await redis.sadd('active_rooms', room);
      await redis.sadd(`room:${room}:users`, socket.user.name);

      // Notify others in room
      socket.to(room).emit('user-joined', {
        user: socket.user.name,
        message: `${socket.user.name} joined the room`,
      });

      // Send last 50 messages to the joining user
      const messages = await Message.find({ room })
        .populate('sender', 'name')
        .sort({ createdAt: 1 })
        .limit(50);
      socket.emit('message-history', messages);

      console.log(`${socket.user.name} joined room: ${room}`);
    });

    // Send a message
    socket.on('send-message', async ({ room, content }) => {
      try {
        const message = await Message.create({
          room,
          sender: socket.user._id,
          content,
        });

        const populated = await message.populate('sender', 'name email');

        // Broadcast to everyone in the room including sender
        io.to(room).emit('new-message', {
          _id: populated._id,
          room,
          content: populated.content,
          sender: populated.sender,
          createdAt: populated.createdAt,
        });
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Leave a room
    socket.on('leave-room', async (room) => {
      socket.leave(room);
      await redis.srem(`room:${room}:users`, socket.user.name);
      socket.to(room).emit('user-left', {
        user: socket.user.name,
        message: `${socket.user.name} left the room`,
      });
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });
};