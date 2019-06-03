const express = require('express');
const route = express.Router();

//@route    GET api/profile
//@desc     Test Route
//@access   Public

route.get('/', (req, res) => res.send("Profile Route"));

module.exports = route;