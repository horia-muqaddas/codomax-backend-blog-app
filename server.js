const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy Database (In-Memory Storage)
let users = [
    { id: 1, name: 'Horia', email: 'horiamuqaddas@gmail.com', password: '123' }
];

let blogs = [];

// Root Route
app.get('/', (req, res) => {
    res.send('Codomax Blog API Server is running...');
});

// 1. User Registration API
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully!', user: newUser });
});

// 2. User Login API
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        res.status(200).json({ message: 'Login successful!', user });
    } else {
        res.status(401).json({ message: 'Invalid email or password!' });
    }
});

// 3. Create Blog API
app.post('/api/blogs', (req, res) => {
    const { title, content, author } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required!' });
    }
    const newBlog = { id: blogs.length + 1, title, content, author: author || 'Anonymous', date: new Date().toLocaleDateString() };
    blogs.push(newBlog);
    res.status(201).json({ message: 'Blog post created successfully!', blog: newBlog });
});

// 4. Get All Blogs API
app.get('/api/blogs', (req, res) => {
    res.status(200).json(blogs);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});