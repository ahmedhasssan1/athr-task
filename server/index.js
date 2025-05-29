const mongoose = require("mongoose");
// const httpServer = require("http").createServer();
// const { Socket } = require("socket.io");
const { Server } = require("socket.io");
const http = require("http");
const app=require('./app')
const { env } = require('process');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });


const DB = process.env.database_url
mongoose
  .connect(
    DB
  )
  .then(() => console.log('MongoDB connected successfully'))
  .catch(()=>console.log('there a error to connect to mongog'))
  
const httpServer = http.createServer(app);

  
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

  const port = process.env.PORT || 5000;
  console.log(port);
  const server = app.listen(port, () => {
    console.log(`your app working in port ${port}...`);
  });





const messageSchema = new mongoose.Schema({
  message: String,
  username: String,
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);



io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  // fetch existing users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});




function startChangeStream() {
  const changeStream = Message.watch();

  changeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        io.emit("message inserted", change.fullDocument);
        break;
      case "update":
        io.emit("message updated", {
          _id: change.documentKey._id,
          updatedFields: change.updateDescription.updatedFields,
        });
        break;
      case "delete":
        io.emit("message deleted", change.documentKey._id);
        break;
    }
  });
}


// Start server only after mongoose connection is open
mongoose.connection.once("open", () => {
  console.log("MongoDB connection is open");

  // Start Change Stream watching
  startChangeStream();

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () =>
    console.log(`server socket.io listening at http://localhost:${PORT}`)
  );
});