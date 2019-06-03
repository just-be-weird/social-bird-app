const express = require('express');
const route = express.Router();

//@route    GET api/auth
//@desc     Test Route
//@access   Public
route.get('/', (req, res) => res.send("Auth Route"));

module.exports = route;