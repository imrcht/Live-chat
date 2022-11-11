const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');

const PeerServer = require('peer').PeerServer;

// const socketio = require('socket.global.io');
const { formatMessage, addMessage, getMessages } = require('./utils/messages');
require('dotenv').config();
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getTechUsers,
  getTechNames,
} = require('./utils/users');
const colors = require('colors');

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
global.io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//#region MONGOOSE CONNECTION
// const connectDB = require('./db/connectDB.js');
const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.set('debug', true);
  const db = mongoose.connection;
  const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.vhg7m.mongodb.net/${process.env.DB_NAME}`;
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db.on('error', (e) => {
    console.error(new Error(`${e}`));
  });
  db.once('open', () => {
    console.log(`Connected to DB : liveChat`);
  });
  db.on('reconnectFailed', () => {
    console.error(new Error('Reconnect Failed'));
  });
  db.on('disconnected', () => {
    console.error(new Error('Unable to connect to DB'));
  });
};

connectDB();
//#endregion

const botName = 'Chat Bot';
const techBot = 'Tech Bot';

app.get('/getTechNames', getTechNames);
app.get('/getTechUsers', getTechUsers);

// Run when client connects
global.io.on('connection', (socket) => {
  // console.log(global.io.of("/").adapter);
  socket.on('join-room', async (username, user_id, room, tech) => {
    const user = await userJoin(socket.id, username, user_id, room, tech);
    console.log('user: ', user);
    if (room) socket.join(user.room);
    else if (tech) socket.join(user.tech);

    // const messages = await getMessages(room);

    // console.log(messages);
    // for (let message of messages) {
    //   global.io.to(user.room).emit(
    //     'msg',
    //     formatMessage(message.from_username, message.body)
    //   );
    // }

    // Welcome current user
    if (room)
      socket.emit('msg', formatMessage(botName, 'Welcome to LiveChat POC!'));
    else if (tech)
      socket.emit('msg', formatMessage(techBot, 'Welcome to Live Tech POC!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'msg',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Broadcast when a user connects
    socket.broadcast
      .to(user.tech)
      .emit(
        'msg',
        formatMessage(botName, `${user.username} has joined the tech`)
      );

    global.io.to(user.tech).emit('user-connected', user);

    // Send users and room info
    global.io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    // Send users and room info
    global.io.to(user.tech).emit('techUsers', {
      tech: user.tech,
      users: getTechUsers(user.tech),
    });
  });

  // Listen for chat-message
  socket.on('chat-message', async (msg) => {
    const user = getCurrentUser(socket.id);

    const message = await addMessage(user.room, user.username, msg);

    global.io.to(user.room).emit('msg', formatMessage(user.username, msg));
    global.io.to(user.tech).emit('msg', formatMessage(user.username, msg));
  });

  //Runs when client leaves room
  socket.on('leave-room', async () => {
    const user = await userLeave(socket.id);

    if (user) {
      global.io
        .to(user.room)
        .emit(
          'msg',
          formatMessage(botName, `${user.username} has left the chat`)
        );

      // Send users and room info
      global.io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  // Runs when client disconnects
  socket.on('disconnect', async () => {
    const user = await userLeave(socket.id);

    if (user) {
      global.io
        .to(user.room)
        .to(user.tech)
        .emit(
          'msg',
          formatMessage(botName, `${user.username} has left the chat`)
        );

      global.io.to(user.tech).emit('user-disconnected', user);
      // Send users and room info
      global.io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });

      // Send users and room info
      global.io.to(user.tech).emit('techUsers', {
        tech: user.tech,
        users: getTechUsers(user.tech),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
const PEER_PORT = process.env.PEER_PORT || 8082;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const pserver = new PeerServer({
  port: PEER_PORT,
  path: '/peerApp',
});

console.log(`Peer Server running on port ${PEER_PORT}`);
