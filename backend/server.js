// server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const http = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const dotenv = require("dotenv");
const path = require("path");

//  Config
dotenv.config();
require("./config/passport");

// 🔌 Express App & Server
const app = express();
const server = http.createServer(app);

//  Midd1lewares
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'teamclash_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
// const aiRoutes = require("./routes/aiRoutes");
const reportRoutes = require("./routes/reportRoutes");
const socketRoutes = require('./sockets/socketHandlers');
const { handleChatSocket, handleChatEvents } = require('./sockets/chatHandlers');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoute = require('./routes/uploadRoute');



app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
// app.use("/api/ai", aiRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/cards", require("./routes/cardRoutes"));
app.use('/api/chat', chatRoutes);
app.use('/api/friends', require('./routes/friendRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

//*****************************************************************************  GET THE UPLOADED FILES  ************
app.use('/uploads', express.static(path.join(__dirname,'UploadedFiles')));
//*******************************************************************************************************************
app.use('/api/upload', uploadRoute);


// 🔌 Redis Pub/Sub Clients
const pubClient = createClient({ url: 'redis://redis:6379' });
// const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

// ⚡️ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const { handleCardCheck, handleCardEvents } = socketRoutes;

// Socket Events
io.on('connection', (socket) => {
  handleCardCheck(io, socket);
  handleCardEvents(io, socket);
  handleChatSocket(io, socket);
  handleChatEvents(io, socket);
  // socket.on('join_user', ({ userId }) => {
  //   socket.join(userId); // join user's private room
  // });

  // socket.on('private_message', ({ from, to, text }) => {
  //   io.to(to).emit('private_message', { from, text, createdAt: new Date() });
  //   // ✅ Save to DB also
  // });
});


// Serve React in production
if (process.env.NODE_ENV === 'development') {
  const buildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
  });
}




async function startServer() {
  try {
    await pubClient.connect();
    await subClient.connect();
    io.adapter(createAdapter(pubClient, subClient));
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
    server.listen(5000, () =>
      console.log("Server running on http://localhost:5000")
    );
  } catch (err) {
    console.error("Server Startup Error:", err);
  }
}

startServer();
