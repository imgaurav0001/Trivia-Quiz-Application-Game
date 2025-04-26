require("dotenv").config();
const express = require("express");
const app = express();
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const NodeCache = require("node-cache");

// configuring cors
app.use(cors());
const server = createServer(app);
const allowedOrigins = [process.env.origin1, process.env.origin2]; //setting origin
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// configuring node-cache
const questionCache = new NodeCache({ stdTTL: 600 }); //stdTTL:600 - delete after 10 min
async function getQuestion(question, category) {
  const cacheKey = `${category}-${question}`;
  const cached = questionCache.get(cacheKey);
  // if same category and number of ques. exist then return cache data
  if (cached) {
    console.log("serving from cache");
    // console.log(cached);
    return cached;
  }
  // else return api data
  const allQuestion = await axios.get(
    `https://opentdb.com/api.php?amount=${question}&category=${category}&type=multiple`
  );
  // console.log(allQuestion.data);
  questionCache.set(cacheKey, allQuestion.data);
  console.log("Serving from API");
  return allQuestion.data;
}

// Store connected player details per room
let rooms = {}; // { roomId: [players] }
let score = {};

// initial connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle host details
  socket.on("host_details", (data) => {
    // console.log("Host details received:", data);
    const id = socket.id;
    const newHost = { ...data.hostInput, id, role: "Host" };
    socket.emit("get_id", socket.id);
    // Add the host to the room's player list
    const roomId = data.hostInput.roomId;
    if (!rooms[roomId] || !rooms[roomId].length) {
      rooms[roomId] = [];
      rooms[roomId].push(newHost);

      // Add the host to the specified room
      socket.join(roomId);
      // console.log(rooms);
    } else {
      socket.emit("room_error", "room is already created");
    }

    // Broadcast the updated list to everyone in the room
    io.to(roomId).emit("connected_players", rooms[roomId]);
  });

  // Handle player details
  socket.on("player_details", (data) => {
    // console.log("Player details received:", data);
    const id = socket.id;
    const newPlayer = { ...data.playerInput, id, role: "Player" };
    socket.emit("get_id", socket.id);
    // Add the player to the room's player list
    const roomId = data.playerInput.roomId;
    if (score[roomId]) {
      // console.log(score[roomId]);
      socket.emit("room_error", "Game is already started");
    } else if (rooms[roomId]) {
      if (rooms[roomId].length >= 4) {
        socket.emit("room_error", "Room is full");
      } else {
        rooms[roomId].push(newPlayer);
        // Add the player to the specified room
        socket.join(roomId);
        // Broadcast the updated list to everyone in the room
        io.to(roomId).emit("connected_players", rooms[roomId]);
        console.log(rooms);
      }
    } else {
      socket.emit("room_error", "Room does not exist");
    }
  });

  // trigger when host start quiz
  socket.on("start_quiz", (data) => {
    // console.log(data);
    getQuestion(data.question, data.category)
      .then((allQuestion) => {
        // console.log(allQuestion);
        io.to(data.roomId).emit("all_start_quiz", allQuestion);
      })
      .catch((e) => {
        console.log(e);
        socket.emit("room_error", "Can't fetch the questions");
      });
  });

  // trigger when any player score
  socket.on("set_score", (data) => {
    // console.log(data);
    const roomId = data.room;
    if (!score[roomId]) {
      score[roomId] = [];
      score[roomId].push(data);
    } else {
      const players = score[roomId];
      const play = players.find((p) => p.id === data.id);
      if (play) {
        play.score = data.score;
        play.counter = data.counter;
      } else {
        score[roomId].push(data);
      }
    }
    io.to(roomId).emit("get_score", score[roomId]);
    // console.log(score);
  });

  // deleting players
  socket.on("delete_players", (data) => {
    // console.log(data);
    // console.log(rooms[data.roomId]);
    const players = rooms[data.roomId].filter((d) => d.id !== data.id);
    // console.log(players);
    rooms[data.roomId] = players;
    io.to(data.roomId).emit("connected_players", rooms[data.roomId]);
    const target = io.sockets.sockets.get(data.id);
    target.emit("remove", { error: "Host removed You" });
    target.disconnect();
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    // Remove the disconnected player from the relevant room
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((player) => player.id !== socket.id);

      // Notify all clients in this room of the updated list
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      } else {
        io.emit("connected_players", rooms[roomId]);
      }
      // console.log(rooms);
    }

    for (const s in score) {
      score[s] = score[s].filter((player) => player.id !== socket.id);
      if (score[s].length === 0) {
        delete score[s];
      }
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server is live on port", process.env.PORT);
});
