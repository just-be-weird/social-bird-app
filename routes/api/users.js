const express = require('express');
const route = express.Router();

//@route    POST api/users
//@desc     Test Route
//@access   Public

route.get('/', (req, res) => res.send("Users Route"));

module.exports = route;