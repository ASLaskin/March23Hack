require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const MONGODB_PASS = process.env.MongoDBPass;
const mongoURI = `mongodb+srv://andrewlaskin:${MONGODB_PASS}@cluster0.e0ivcci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(mongoURI, {})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const db = mongoose.connection;

// Importing routes
const routes = require('./routes.js');

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

// Apply session middleware
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        },
    })
);

// Parsing JSON requests
app.use(express.json());

// Use the routes
app.use('/', routes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A client connected');
    socket.on('newConversation', () => {
        console.log('New conversation:');
    });
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

// Export the server instance for testing or other purposes
module.exports = server;
