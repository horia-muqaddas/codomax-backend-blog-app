const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// In-Memory Data (No MongoDB Dependency)
let blogs = [
    {
        _id: "1",
        title: "First Welcome Blog",
        content: "Welcome to Codomax Blog API!",
        createdAt: new Date()
    }
];

// Routes
app.get('/', (req, res) => {
    res.send('Codomax Blog API Server is running...');
});

app.get('/api/blogs', (req, res) => {
    res.status(200).json(blogs);
});

app.post('/api/blogs', (req, res) => {
    const { title, content } = req.body;
    const newBlog = {
        _id: (blogs.length + 1).toString(),
        title,
        content,
        createdAt: new Date()
    };
    blogs.push(newBlog);
    res.status(201).json({ message: 'Blog created successfully!', blog: newBlog });
});

app.listen(5000, () => console.log('🚀 Fresh Server running on port 5000'));
