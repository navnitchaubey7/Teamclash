// server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const roomRoutes = require('./routes/roomRoutes');

require("dotenv").config();
require('./config/passport');

const app = express();
const authRoutes = require("./routes/authRoutes");
const session = require('express-session');
const passport = require('passport');
const aiRoutes = require('./routes/aiRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();
const http = require('http').createServer(app);


// Middleware
app.use(cors());
app.use(express.json());

// Routes 
app.use(express.json());
app.use(session({
  secret: 'teamclash_secret',
  resave: false,
  saveUninitialized: false
}));
//
const io = new Server(http, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});
// Redis setup
// pubClient.connect();
// subClient.connect();
io.adapter(createAdapter(pubClient, subClient));
app.use('/api/cards', require('./routes/cardRoutes'));
const { handleCardCheck } = require('./sockets/socketHandlers');
io.on('connection', (socket) => {
  handleCardCheck(io, socket);
});

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/ai', aiRoutes);
// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

async function startServer() {
  await pubClient.connect();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));

  app.listen(5000, () => console.log(`PORTServer running on port 5000`));
}

startServer();

