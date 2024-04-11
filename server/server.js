const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const http = require('http');
const socketIo = require('socket.io');
const routes = require('./routes.js');

const app = express();
app.use(express.json());
const server = http.createServer(app); // Create an HTTP server with Express app
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust origin based on your client app
    methods: ["GET", "POST"]
  }
});

const MONGODB_PASS = 'QSSm7bp22JU2KUV2';
const mongoURI = `mongodb+srv://andrewlaskin:${MONGODB_PASS}@cluster0.e0ivcci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(mongoURI, {})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const db = mongoose.connection;


// Apply CORS middleware with dynamic origin
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === "http://localhost:5173") {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Importing routes
app.use('/', routes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

// Export the server instance for testing or other purposes
module.exports = server;
