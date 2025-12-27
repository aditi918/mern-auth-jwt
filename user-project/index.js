// index.js

// 1️⃣ Import modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');

// 2️⃣ Initialize Express
const app = express();

// 3️⃣ CORS configuration - ALLOW ALL ORIGINS
app.use(cors()); // ✅ allows requests from any frontend origin

// 4️⃣ Middleware
app.use(express.json()); // parse JSON bodies

// 5️⃣ JWT secret key
const JWT_SECRET = "your_jwt_secret_key"; // replace with a strong secret

// 6️⃣ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/userdb')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// 7️⃣ Routes

// GET /users - list all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /signup - register a new user
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /login - authenticate user and return JWT
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// JWT middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// GET /dashboard - protected route
app.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ message: `Welcome to dashboard, user: ${req.user.email}` });
});

// 8️⃣ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));