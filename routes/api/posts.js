const express = require('express');
const route = express.Router();
const auth = require('../../middlewares/auth');
const { check, validationResult } = require('express-validator/check');
const Profile = require('../../models/Profile.Model');
const User = require('../../models/User.Model');
const config = require('config');


//@route    POST api/posts
//@desc     Create a post
//@access   Privat3

route.post('/', [
    auth,
    [
        check('text', 'Text is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
});

module.exports = route;