const express = require('express');
const route = express.Router();
const auth = require('../../middlewares/auth');
const { check, validationResult } = require('express-validator/check');
const Profile = require('../../models/Profile.Model');
const Post = require('../../models/Post.Model');
const User = require('../../models/User.Model');
const config = require('config');


//@route    POST api/posts
//@desc     Create a post
//@access   Private

route.post('/', [
    auth,
    [
        check('text', 'Text is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

//@route    GET api/posts
//@desc     Get all post
//@access   Private

route.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }).select('-password');
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

module.exports = route;