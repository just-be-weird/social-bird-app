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


//@route    GET api/posts/:id
//@desc     Get a post by ID
//@access   Private

route.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'There is no post found.' });
        }
        res.json(post);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'There is no post found.' });
        }
        res.status(500).send('Server Error!');
    }
});


//@route    DELETE api/posts/:id
//@desc     delete a post by ID
//@access   Private

route.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'There is no post found.' });
        }
        //identify whether same user is trying to delete his own post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not Autherized.' });
        }

        await post.remove();
        res.json({ id: req.user.id });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'There is no post found.' });
        }
        res.status(500).send('Server Error!');
    }
});


//@route    PUT api/posts/like/:id
//@desc     Like a post
//@access   Private

route.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'There is no post found.' });
        }

        //Check if the post been liked before
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(404).json({ msg: 'Post already been liked.' });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'There is no post found.' });
        }
        res.status(500).send('Server Error!');
    }
});

module.exports = route;