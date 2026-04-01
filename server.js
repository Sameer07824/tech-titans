const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const disputeRoutes = require('./routes/disputes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trustbound';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/disputes', disputeRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

const disputeRooms = {};
io.on('connection', (socket) => {
  socket.on('join_dispute', ({ disputeId, userId }) => {
    socket.join(disputeId);
  });
  socket.on('send_message', ({ disputeId, message, sender, senderName }) => {
    const msg = { message, sender, senderName, timestamp: new Date() };
    io.to(disputeId).emit('receive_message', msg);
  });
  socket.on('disconnect', () => {});
});

const FRONTEND_BUILD = path.join(__dirname, '../frontend/build');
app.use(express.static(FRONTEND_BUILD));
app.get('*', (req, res) => res.sendFile(path.join(FRONTEND_BUILD, 'index.html')));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} → http://localhost:${PORT}`));
