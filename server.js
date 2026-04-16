// server.js
require('dotenv').config();
const http = require('http');
const {Server} = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/config/db');
require('./src/config/redis');
const PORT = process.env.PORT || 5000;


const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' },
});


require('./src/socket/socketHandler')(io);

connectDB()
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
