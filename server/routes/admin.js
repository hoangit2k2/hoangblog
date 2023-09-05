const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;
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
 * GET /
 * Admin - check Login
 */
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // bcrypt.compare(password, user.password, function (err, result) {
        //     console.log(result);
        //     if (result == false) {
        //         return res.status(401).json({ message: 'Invalid credentials' });
        //     }
        // });
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
router.get('/dashboard', async (req, res) => {
    res.render('admin/dashboard');
});

/*
 * GET /
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
