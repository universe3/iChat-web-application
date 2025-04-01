// node server which will handle socket io connections
// const io = require("socket.io")(8000);
const io = require("socket.io")(8000, {
  cors: {
    origin: "*", // Allow frontend requests
    methods: ["GET", "POST"],
  },
});

// for users
const users = {};

//ye keh rha h ki jaise hi connection aaye socket m to arrow function ko run krdo -
// io bahut saare user ko connect krega---io.on inn sbko listen krega and socket.on --jb bhi kisi particular connection  k
// saath kuch hoga to socket.on manage krega
io.on("connection", (socket) => {
  // when new user join
  socket.on("new-user-joined", (name) => {
    console.log("New-user", name);
    // socket.on particular event like user-joined event ko listen krta h
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  // when user sends a msg
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  // When a user disconnects
  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
