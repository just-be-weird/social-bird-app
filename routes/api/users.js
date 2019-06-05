const express = require('express');
const route = express.Router();
const { check, validationResult } = require('express-validator/check');
//Get the user modle
const UserModel = require('../../models/User.Model');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');


//@route    POST api/users
//@desc     Register User
//@access   Public

route.post('/', [
    check('name', 'Name is required.').not().isEmpty(),
    check('email', 'Please provide a valid email.').isEmail(),
    check('password', 'Please provide a password with 6 or more characters.').isLength({ min: 6 })
],
    async (req, res) => { //using async as inside this function we've async code
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }

        try {
            const { name, email, password } = req.body; // destructring the attributes from req

            // see if user exists
            let userInDB = await UserModel.findOne({ email });

            if (userInDB) {
                return res.status(400).json({ errors: [{ msg: 'User already exsits.' }] })
            }
            //get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',//size
                r: 'pg',//rating
                d: 'mm'//default image if not have gravatar
            })

            userInDB = UserModel({
                name,
                email,
                password,
                avatar
            });
            //encrypt the password using bcrypt before saving in DB
            const salt = await bcrypt.genSalt(10);//ref docs

            userInDB.password = await bcrypt.hash(password, salt);

            await userInDB.save();

            //Return jsonwebtoken
            const payload = {
                user: {
                    id: userInDB.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (error, token) => {
                if(error) throw error;
                res.json({ token });
            });

            //res.send("Users Registered");//Only for testing purpose

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error!');
        }

    });

module.exports = route;