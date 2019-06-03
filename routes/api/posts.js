const express = require('express');
const route = express.Router();

//@route    GET api/posts
//@desc     Test Route
//@access   Public

route.get('/', (req, res) => res.send("Posts Route"));

module.exports = route;