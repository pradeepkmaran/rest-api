const express = require("express");
const { logReqRes } = require("./middlewares/index");
const { router: userRouter } = require("./routers/user");
const { connectToMongo } = require("./connection")

const PORT = 8000;
const app = express();

// Connecting to Mongo
connectToMongo("mongodb://127.0.0.1:27017/users")
.then(() => console.log("Connected to DB"));


// Middlewares
app.use(express.urlencoded({extended: false}));
app.use(logReqRes('../log.txt'));

// Routes
app.use("/users", userRouter);

app.listen(PORT, ()=>console.log(`Listening to port: ${PORT}`));