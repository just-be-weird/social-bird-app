const express = require('express');
const route = express.Router();
const auth = require('../../middlewares/auth');
const Profile = require('../../models/Profile.Model');
const User = require('../../models/User.Model');
const { check, validationResult } = require('express-validator/check');
const request = require('request');
const config = require('config');


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
    if (req.body.company) profileFields.company = company;
    if (req.body.website) profileFields.website = website;
    if (req.body.location) profileFields.location = location;
    if (req.body.bio) profileFields.bio = bio;
    if (req.body.status) profileFields.status = status;
    if (req.body.githubusername) profileFields.githubusername = githubusername;
    // Skills - Spilt into array
    if (typeof skills !== 'undefined') {
        profileFields.skills = skills.split(',');
    }

    // Social object (optional fields)
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = youtube;
    if (req.body.twitter) profileFields.social.twitter = twitter;
    if (req.body.facebook) profileFields.social.facebook = facebook;
    if (req.body.linkedin) profileFields.social.linkedin = linkedin;
    if (req.body.instagram) profileFields.social.instagram = instagram;

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

route.delete('/', auth, async (req, res) => {
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


//@route    PUT api/profile/experience
//@desc     Add profile experience
//@access   Private

route.put('/experience', [
    auth, [
        check('title', 'Title is required.').not().isEmpty(),
        check('company', 'Company is required.').not().isEmpty(),
        check('from', 'From date is required.').not().isEmpty(),
    ]], async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error) {
                return res.status(400).json({ errors: errors.array() });
            }
            //Find the user profile
            const profile = await Profile.findOne({ user: req.user.id });
            if (!profile) {
                return res.status(400).json({ msg: 'Can\'t add experience, as there is no profile found for this user..' });
            }

            const {
                title,
                company,
                location,
                from,
                to,
                current,
                description
            } = req.body;

            const newExperience = {
                title,
                company,
                location,
                from,
                to,
                current,
                description
            };

            //Add experience on profile as its default empty error
            profile.experience.unshift(newExperience);//just like array.push 
            //save the profile
            await profile.save();
            //Send the response
            res.json(profile);
        } catch (error) {
            console.error(error.message);
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ msg: 'There is no profile found for this user.' });
            }
            res.status(500).send('Server Error!');
        }
    });


//@route    POST api/profile/experience/:exp_id
//@desc     Update profile experience
//@access   Private

route.post('/experience/:exp_id', [
    auth, [
        check('title', 'Title is required.').not().isEmpty(),
        check('company', 'Company is required.').not().isEmpty(),
        check('from', 'From date is required.').not().isEmpty(),
    ]
], async (req, res) => {
    const error = validationResult(req);
    if (!error) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).json({ msg: 'Can\'t add experience, as there is no profile/experience found.' });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        profile.experience.forEach(exp => {
            if (exp._id.equals(req.params.exp_id)) {
                if (title) exp.title = title;
                if (company) exp.company = company;
                if (location) exp.location = location;
                if (from) exp.from = from;
                if (to) exp.to = to;
                if (current) exp.current = current;
                if (description) exp.description = description;
            }
        });

        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'There is no profile found for this user.' });
        }
        res.status(500).send('Server Error!');
    }
});

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete profile experience
//@access   Private

route.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //Get index for remove experience
        const removeIndex = profile.experience.map(exp => exp.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'There is no profile found for this user.' });
        }
        res.status(500).send('Server Error!');
    }
});

//@route    PUT api/profile/education
//@desc     Add education to profile
//@access   Private

route.put('/education', [
    auth, [
        check('school', 'School name is required.').not().isEmpty(),
        check('degree', 'Degree name is required.').not().isEmpty(),
        check('fieldofstudy', 'Field of study is required.').not().isEmpty(),
        check('from', 'From date is required.').not().isEmpty(),
    ]
]
    , async (req, res) => {
        const error = validationResult(req);
        if (!error) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            if (!profile) {
                return res.status(400).json({ msg: 'Can\'t add education, as there is no profile/experience found.' });
            }
            //build the education object
            const educationPayload = {};
            const {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
            } = req.body;

            if (school) educationPayload.school = school;
            if (degree) educationPayload.degree = degree;
            if (fieldofstudy) educationPayload.fieldofstudy = fieldofstudy;
            if (from) educationPayload.from = from;
            if (to) educationPayload.to = to;
            if (current) educationPayload.current = current;
            if (description) educationPayload.description = description;

            profile.education.unshift(educationPayload);
            await profile.save();
            res.json(profile);

        } catch (error) {
            console.error(error.message);
            if (error.kind == 'ObjectId') {
                return res.status(400).json({ msg: 'There is no profile found for this user.' });
            }
            res.status(500).send('Server Error!');
        }

    });


//@route    DELETE api/profile/education/:edu_id
//@desc     Delete profile education
//@access   Private

route.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).json({ msg: 'Can\'t delete education, as there is no profile/experience found.' });
        }
        const removeIndex = profile.education.map(edu => edu.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'There is no profile found for this user.' });
        }
        res.status(500).send('Server Error!');
    }
});

//@route    GET api/profile/gitub/:username
//@desc     Get users from github
//@access   Public

route.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}$clien_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (error, response, body) => {
            if (error) {
                console.error(error);
            }
            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No github profile found.' });
            }

            res.json(JSON.parse(body));
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error!');
    }
});

module.exports = route;