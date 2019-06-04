const express = require('express');
const route = express.Router();
const { check, validationResult } = require('express-validator/check');

//@route    POST api/users
//@desc     Register User
//@access   Public

route.post('/', [
    check('name', 'Name is required.').not().isEmpty(),
    check('email','Please provide a valid email.').isEmail(),
    check('password','Please provide a password with 6 or more characters.').isLength({ min: 6 })
],
    (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }
        console.log(req.body);
        res.send("Users Route")
    });

module.exports = route;