const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const uuidv4 = require('uuid').v4;
const mongoose = require('mongoose');
const socketIo = require('socket.io');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    conversationsIDs: Array,
});

const conversationSchema = new mongoose.Schema({
    messages: [{
        text: String,
        user: String,
        time: Number,
    }]
});

const User = mongoose.model('User', userSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

const io = socketIo();

router.use(
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

router.post('/users', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).send('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            conversationsIDs: []
        });
        await newUser.save();
        res.status(201).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid credentials');
        }

        req.session.userId = user._id;
        res.send('Success');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/users/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.clearCookie('sessionId');
            res.send('Logged out successfully');
        }
    });
});

router.get('/users/profile', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json({ email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/users/role', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send('Cannot find user');
        }
        res.status(200).send(user.role);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/users/tas', async (req, res) => {
    try {
        const teacherAssistants = await User.find({ role: 'ta' });
        res.status(200).json(teacherAssistants);
    } catch (error) {
        console.error('Error fetching teacher assistants:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/users/professors', async (req, res) => {
    try {
        const teacherAssistants = await User.find({ role: 'professor' });
        res.status(200).json(teacherAssistants);
    } catch (error) {
        console.error('Error fetching professors:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/pushConversation', async (req, res) => {
    try {
        const words = req.body.text;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newConversation = new Conversation();
        newConversation.messages.push({
            text: words,
            user: user.email,
            time: Date.now()
        });

        await newConversation.save();

        user.conversationsIDs.push(newConversation._id);
        await user.save();

        // Real time database
        io.emit('newConversation', { conversationId: newConversation._id });

        res.status(201).json({ message: 'Conversation created successfully', conversationId: newConversation._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/pushMessage/:conversationId', async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const words = req.body.text;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // Push message, user, and timestamp into the conversation
        conversation.messages.push({
            text: words,
            user: user.email,
            time: Date.now()
        });

        await conversation.save();

        // Real time database

        io.emit('newMessage', { conversationId: conversationId, message: words });

        res.status(201).json({ message: 'Message added to conversation successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getConversations', async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userConversations = await Conversation.find({ _id: { $in: user.conversationsIDs } });

        const firstMessages = userConversations.map(conv => {
            if (conv.messages.length > 0) {
                return {
                    conversationId: conv._id,
                    firstMessage: conv.messages[0].text
                };
            } else {
                return {
                    conversationId: conv._id,
                    firstMessage: 'No messages in this conversation'
                };
            }
        });

        res.status(200).json({ firstMessages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/conversationData/:conversationId', async (req, res) => {
    const conversationId = req.params.conversationId;

    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        res.status(200).json({ conversation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
