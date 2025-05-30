const express = require("express");
const UserRouter = require("./routes/usersRoute");
const postsRoute = require("./routes/postsRoute");
const commentRoute=require("./routes/commentsRoute")
const likesRoute=require("./routes/likesRoute")
const messageRoute=require('./routes/messageRoute')
const app = express();

app.use(express.json());

// Mount routers
app.use("/users", UserRouter);
app.use("/posts",postsRoute)
app.use("/comments",commentRoute)
app.use("/likes",likesRoute)
app.use('/messgaes',messageRoute)
module.exports = app;
