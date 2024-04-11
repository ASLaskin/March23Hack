const express = require('express');
const router = express.Router();
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const uuidv4 = require('uuid').v4;
const mongoose = require('mongoose');

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

router.use(cors({ origin: 'http://localhost:5173', credentials: true }));

router.post('/users', async (req, res) => {
    try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			res.status(202).send('Email Taken');
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
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(400).send('Cannot find user');
		}

		const isPasswordValid = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (isPasswordValid) {
			const sessionId = uuidv4();
			req.session.userId = user._id;
			sessions[sessionId] = user;
			res.set('Set-Cookie', `sessionId=${sessionId}`);
			res.send('Success');
		} else {
			res.send('Not Allowed');
		}
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
		if (req.session && req.session.userId) {
			const user = await User.findById(req.session.userId);
			if (user) {
				res.json({ email: user.email });
			} else {
				res.status(404).send('User not found');
			}
		} else {
			res.status(401).send('Unauthorized');
		}
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
		console.error('Error fetching teacher assistants:', error);
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

		//Real time databse
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
  
          //more realtime database stuff 
          io.emit('newMessage', { conversationId: conversationId, message: text });
  
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
      // console.log(conversation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
