const express = require('express');
const route = express.Router();
const auth = require('../../middlewares/auth');
const UserModel = require('../../models/User.Model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

//@route    GET api/auth
//@desc     Get the user info
//@access   Public
route.get('/', auth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@route    POST api/auth
//@desc     Authenticate user and get token
//@access   Public

route.post('/', [
    check('email', 'Please provide a valid email.').isEmail(),
    check('password', 'Password is required').exists()
],
    async (req, res) => { //using async as inside this function we've async code
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        try {
            const { email, password } = req.body; // destructring the attributes from req

            // see if user exists
            let userInDB = await UserModel.findOne({ email });
            if (!userInDB) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, userInDB.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            //Return jsonwebtoken
            const payload = {
                user: {
                    id: userInDB.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (error, token) => {
                if (error) throw error;
                res.json({ token });
            });

            //res.send("Users Registered");//Only for testing purpose

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error!');
        }

    });

module.exports = route;