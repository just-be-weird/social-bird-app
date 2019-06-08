const express = require('express');
const route = express.Router();
const auth = require('../../middlewares/auth');
const Profile = require('../../models/Profile.Model');
const User = require('../../models/User.Model');
const { check, validationResult } = require('express-validator/check');


//@route    GET api/profile/me
//@desc     Get current users profile
//@access   Private

route.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.send(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!')
    }
});

//@route    POST api/profile
//@desc     Create or Update users profile
//@access   Private

route.post('/', [auth, [
    check('status', 'Status is required.').not().isEmpty(),
    check('skills', 'Skills is required.').not().isEmpty(),
]], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    // if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    // Social object (optional fields)
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            // Update the profile
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );

            return res.json(profile);
        }
        //Create profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!')
    }

})

//@route    GET api/profile
//@desc     Get all the users profile
//@access   Public

route.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!')
    }
});

//@route    GET api/profile
//@desc     Get all the users profile
//@access   Public

route.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile found for this user..' });
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'There is no profile found for this user.' });
        }
        res.status(500).send('Server Error!');
    }
});

//@route    DELETE api/profile
//@desc     Delete the user, profile & post for that user
//@access   Private

route.delete('/',auth , async (req, res) => {
    try {
        //Remove the profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //Remove the user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted!' });
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'There is no profile found for this user.' });
        }
        res.status(500).send('Server Error!');
    }
});

module.exports = route;