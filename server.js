const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// In-Memory Data Store for Blogs
let blogs = [
    {
        _id: "1",
        title: "First Welcome Blog",
        content: "Welcome to Codomax Blog API!",
        category: "Tech",
        createdAt: new Date()
    },
    {
        _id: "2",
        title: "Learning Express JS",
        content: "Express makes Node.js backend development super easy.",
        category: "Coding",
        createdAt: new Date()
    }
];

// 1. READ ALL (GET)
app.get('/api/blogs', (req, res) => {
    res.status(200).json(blogs);
});

// 2. READ SINGLE BLOG BY ID (GET)
app.get('/api/blogs/:id', (req, res) => {
    const blog = blogs.find(b => b._id === req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json(blog);
});

// 3. CREATE BLOG (POST)
app.post('/api/blogs', (req, res) => {
    const { title, content, category } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: "Title and Content are required" });
    }
    const newBlog = {
        _id: (blogs.length + 1).toString(),
        title,
        content,
        category: category || "General",
        createdAt: new Date()
    };
    blogs.push(newBlog);
    res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
});

// 4. UPDATE BLOG (PUT)
app.put('/api/blogs/:id', (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const blogIndex = blogs.findIndex(b => b._id === id);
    if (blogIndex === -1) {
        return res.status(404).json({ error: "Blog not found" });
    }

    blogs[blogIndex] = {
        ...blogs[blogIndex],
        title: title || blogs[blogIndex].title,
        content: content || blogs[blogIndex].content,
        category: category || blogs[blogIndex].category
    };

    res.status(200).json({ message: "Blog updated successfully!", blog: blogs[blogIndex] });
});

// 5. DELETE BLOG (DELETE)
app.delete('/api/blogs/:id', (req, res) => {
    const { id } = req.params;
    const blogIndex = blogs.findIndex(b => b._id === id);

    if (blogIndex === -1) {
        return res.status(404).json({ error: "Blog not found" });
    }

    const deletedBlog = blogs.splice(blogIndex, 1);
    res.status(200).json({ message: "Blog deleted successfully!", blog: deletedBlog[0] });
});

app.listen(5000, () => console.log('🚀 Server running on port 5000 with Full CRUD Support'));
