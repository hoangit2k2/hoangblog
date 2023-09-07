const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/*
 * GET /
 * HOME
 */
router.get('', async (req, res) => {
    let perPage = 10;
    let page = req.query.page || 1;

    try {
        const locals = {
            title: 'Hoang',
            description: 'Blog Technical',
        };
        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/',
        });
    } catch (error) {
        console.log(error);
    }
});

/*
 * GET /
 * Post :id
 */
router.get('/post/:id', async (req, res) => {
    try {
        const slug = req.params.id;
        const data = await Post.findById({ _id: slug });
        const locals = {
            title: data.title,
            description: data.title,
        };
        res.render('post', {
            locals,
            data,
            currentRoute: '/post/:id',
        });
    } catch (error) {
        console.log(error);
    }
});

/*
 * POST /
 * Post - searchTerm
 */
router.post('/search', async (req, res) => {
    const locals = {
        title: 'Search',
        description: 'Blog Technical',
    };
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            ],
        });
        res.render('search', {
            data,
            locals,
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about',
    });
});

router.get('/contact', (req, res) => {
    res.render('Contact', {
        currentRoute: '/contact',
    });
});
module.exports = router;
