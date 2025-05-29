const express = require("express");
const UserRouter = require("./routes/usersRoute");

const app = express();

app.use(express.json());

// Mount routers
app.use("/users", UserRouter);

module.exports = app;
