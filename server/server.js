const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const uuidv4 = require('uuid').v4;

const MONGODB_PASS = 'QSSm7bp22JU2KUV2';

if (!MONGODB_PASS) {
	console.error(
		'MongoDB password is not provided in the environment variable.'
	);
	process.exit(1);
}

const app = express();
app.use(express.json());
const corsOptions = {
	origin: 'http://localhost:5173',
	credentials: true,
};
app.use(cors(corsOptions));

const mongoURI = `mongodb+srv://andrewlaskin:QSSm7bp22JU2KUV2@cluster0.e0ivcci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
	.connect(mongoURI, {})
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((err) => {
		console.error('Error connecting to MongoDB:', err);
	});

const db = mongoose.connection;


const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	role: String,
	conversationsIDs: Array,
});

const conversationSchema = new mongoose.Schema({
	messages: Array,
	users: Array,
	timestamps: Array
})

const User = mongoose.model('User', userSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

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

const sessions = {};

app.post('/users', async (req, res) => {
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

app.post('/users/login', async (req, res) => {
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

app.post('/users/logout', (req, res) => {
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

app.get('/users/profile', async (req, res) => {
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

app.post('/users/role', async (req, res) => {
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

app.get('/users/tas', async (req, res) => {
	try {
		const teacherAssistants = await User.find({ role: 'ta' });
		res.status(200).json(teacherAssistants);
	} catch (error) {
		console.error('Error fetching teacher assistants:', error);
		res.status(500).send('Internal Server Error');
	}
});
app.get('/users/professors', async (req, res) => {
	try {
		const teacherAssistants = await User.find({ role: 'professor' });
		res.status(200).json(teacherAssistants);
	} catch (error) {
		console.error('Error fetching teacher assistants:', error);
		res.status(500).send('Internal Server Error');
	}
});

//This creates the convo and then adds the ID to the users conversation array 
app.post('/pushConversation', async (req, res) => {
	try {
	  const newConversation = new Conversation();
	  await newConversation.save();
	  const userId = req.session.userId; 
	  if (!userId) {
		return res.status(401).json({ error: 'Unauthorized' });
	  }
  
	  const user = await User.findById(userId);
	  if (!user) {
		return res.status(404).json({ error: 'User not found' });
	  }
  
	  user.conversationsIDs.push(newConversation._id);
	  await user.save();
  
	  res.status(201).json({ message: 'Conversation created successfully', conversationId: newConversation._id });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });

//This pushes a message to a conversation 
app.post('/pushMessage/:conversationId', async (req, res) => {
	const conversationId = req.params.conversationId;
	const { text, userId, timestamp } = req.body;
  
	try {
	  const conversation = await Conversation.findById(conversationId);
	  if (!conversation) {
		return res.status(404).json({ error: 'Conversation not found' });
	  }
  
	  // Push message, user, and timestamp into the conversation
	  conversation.messages.push({ text, userId, timestamp });
	  conversation.users.push(userId); 
	  conversation.timestamps.push(timestamp);
  
	  await conversation.save();
  
	  res.status(201).json({ message: 'Message added to conversation successfully' });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });


// Get the first message of each conversation for the current user
app.get('/getConversations', async (req, res) => {
	try {
	  const userId = req.session.userId; 
  
	  if (!userId) {
		return res.status(401).json({ error: 'Unauthorized' });
	  }
  
	  // Find user's conversations
	  const user = await User.findById(userId);
	  if (!user) {
		return res.status(404).json({ error: 'User not found' });
	  }
  
	  const userConversations = await Conversation.find({ _id: { $in: user.conversationsIDs } });
  
	  // Extract the first message of each conversation
	  const firstMessages = userConversations.map(conv => {
		if (conv.messages.length > 0) {
		  return {
			conversationId: conv._id,
			firstMessage: conv.messages[0]
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
  
// Get the data within the conversation given its ID
app.get('/conversationData/:conversationId', async (req, res) => {
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
