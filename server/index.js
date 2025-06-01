const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const app = require('./app');
const { env } = require('process');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Message = require('./model/messages');
const chatModel = require('./model/chat');

const DB = process.env.dataBase_Url;
mongoose
  .connect(DB)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(() => console.log('there a error to connect to mongog'));

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
  },
});

// const port = 5000;
// const server = app.listen(port, () => {
//   console.log(`your app working in port ${port}...`);
// });



io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  next();
});

const userMap = new Map(); 

io.on('connection', (socket) => {
  // fetch existing users
  userMap.set(socket.id, socket.username);

  const users = [];
  for (let [id, socket] of io.of('/').sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit('users', users);

  // notify existing users
  socket.broadcast.emit('user connected', {
    userID: socket.id,
    username: socket.username,
  });

  // forward the private message to the right person
  socket.on('private message', async ({ content, to }) => {
    const toUsername = userMap.get(to);
    const fromUsername=socket.username;
    try {
        let chat = await chatModel.findOne({
      isGroupChat: false,
      users: { $all: [fromUsername, toUsername], $size: 2 },
    });

    if (!chat) {
      chat = await chatModel.create({
        users: [fromUsername, toUsername],
      });
    }
      await Message.create({
        content,
        from:fromUsername ,
        to: toUsername,
      });
    } catch (errot) {
      console.error('failed to save messages');
    }
    socket.to(to).emit('private message', {
      content,
      from: socket.id,
    });
  });

  // notify users upon disconnection
  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnected', socket.id);
  });
});



// Start server only after mongoose connection is open
mongoose.connection.once('open', () => {
  console.log('MongoDB connection is open');
  
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () =>
    console.log(`server socket.io listening at http://localhost:${PORT}`)
  );
});
