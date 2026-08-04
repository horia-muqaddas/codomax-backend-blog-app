const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "mysecretkey123";

// In-Memory Databases
let users = [];
let blogs =[
    {
        _id: "1",
        title: "Welcome to My Blog",
        content: "Yeh mera pehla blog post hai!",
        author: "Horia"
    },
    {
        _id: "2",
        title: "Learning Express & JWT",
        content: "Backend development seekhna bohot interesting hai.",
        author: "Horia"
    }
];

// --- MIDDLEWARE TO PROTECT ROUTES ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access Denied. Token Missing!" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or Expired Token!" });
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---

// 1. REGISTER USER
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: (users.length + 1).toString(), username, email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: "User registered successfully!" });
});

// 2. LOGIN USER (Generates JWT)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Invalid Email or Password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful!", token, user: { id: user.id, username: user.username, email: user.email } });
});

// 3. GET USER PROFILE (Protected)
app.get('/api/profile', authenticateToken, (req, res) => {
    res.status(200).json({ message: "Profile fetched successfully", user: req.user });
});

// --- BLOG ROUTES ---

// Public Route: Read Blogs
app.get('/api/blogs', (req, res) => {
    res.status(200).json(blogs);
});

// Protected Route: Create Blog
app.post('/api/blogs', authenticateToken, (req, res) => {
    const { title, content } = req.body;
    const newBlog = {
        _id: (blogs.length + 1).toString(),
        title,
        content,
        author: req.user.username,
        userId: req.user.id,
        createdAt: new Date()
    };
    blogs.push(newBlog);
    res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
});

app.listen(5000, () => console.log('🚀 Server running on port 5000 with JWT Authentication'));
