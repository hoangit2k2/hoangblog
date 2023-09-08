const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/*
 *
 * Admin -Check login
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

/*
 * GET /
 * Admin -Login Page
 */
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: 'Admin',
            description: 'Admin Site.',
        };
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

/*
 * POST /
 * Admin - Login page
 */
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

/*
 * GET /
 * Admin - register user
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Blog Technical',
        };
        const data = await Post.find();
        res.render('admin/dashboard', { data, locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

/*
 * GET /
 * Admin - Create New Page
 */
router.get('/add-post', async (req, res) => {
    try {
        const locals = {
            title: 'Add Blog',
            description: 'Blog Technical.',
        };
        res.render('admin/add-post', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

/*
 * post /
 * Admin - Create new post
 */
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body,
            });
            await Post.create(newPost);
            res.redirect('dashboard');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server' });
        }
    } catch (error) {
        console.log(error);
    }
});

/*
 * GET /
 * Admin - Edit Post Page
 */
router.get('/edit-post/:id', async (req, res) => {
    try {
        const slug = req.params.id;
        const locals = {
            title: 'Edit Blog',
            description: 'Blog Technical.',
        };
        const data = await Post.findById(slug);
        console.log(data);
        res.render('admin/edit-post', { locals, data, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

/*
 * PUT /
 * Admin - Create new post
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        try {
            const data = await Post.findByIdAndUpdate(req.params.id, {
                title: req.body.title,
                body: req.body.body,
            });
            res.redirect(`/post/${req.params.id}`);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server' });
        }
    } catch (error) {
        console.log(error);
    }
});

/*
 * DELETE /
 * Admin - Delete Post
 */
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        try {
            await Post.findByIdAndDelete(req.params.id);
            res.redirect(`/dashboard`);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server' });
        }
    } catch (error) {
        console.log(error);
    }
});

/*
 * GET /
 * Admin - logout
 */
router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

/*
 * GET /
 * Admin -register
 */
router.get('/register', async (req, res) => {
    try {
        console.log('log0000000000000000');
        const locals = {
            title: 'Register',
            description: 'Admin Site.',
        };
        res.render('admin/register', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

/*
 * POST /
 * Admin - register user
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await User.create({
                username,
                password: hashedPassword,
            });
            res.status(200).json({
                message: 'Create new account successfully.',
                user,
            });
        } catch (error) {
            if (error === 11000) {
                res.status(409).json({ message: 'Account already exit.' });
            }
            res.status(500).json({ Pmessage: 'Internal server' });
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
