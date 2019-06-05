const express = require('express');
const route = express.Router();
const auth = require('../../middlewares/auth');
const Profile = require('../../models/Profile.Model');
const User = require('../../models/User.Model');


//@route    GET api/profile/me
//@desc     Get current users profile
//@access   Public

route.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user'});
        }
        res.send(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!')
    }
});

module.exports = route;