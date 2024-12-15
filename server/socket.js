const socketIo = require('socket.io');

const socketConnection = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (message) => {
      console.log(`Received message: ${message}`);
      socket.emit('response', `You said: ${message}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = socketConnection;
