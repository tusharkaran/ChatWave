
const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("../backend/middleware/errorMidleware");
const path = require("path");
const languageRoutes = require('./routes/languageRoutes')

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data

// app.get("/", (req, res) => {
//   res.send("API Running!");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/language", languageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
    pingTimeout: 180000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});
var people = {};

io.on("connection", (socket) => {

    console.log("Connected to socket.io", socket.id);

    socket.on("setup", (userData) => {
        if (Array.isArray(userData)) {
            socket.join(userData[0]._id);
            people[userData[0]._id] = socket.id;
        } else if (typeof userData === 'object') {
            socket.join(userData._id);
            people[userData._id] = socket.id;
        }
        console.log("people", people)
        socket.emit("connected");
    });


    socket.on("join chat", (room) => {
        console.log("Socket Container", people);
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            if (people[user._id]) {
                io.to(people[user._id]).emit("message recieved", newMessageRecieved);
            } else {
                socket.in(user._id).emit("message recieved", newMessageRecieved);
            }

        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
