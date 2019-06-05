const jwt = require('jsonwebtoken');
const config = require('config');

//@desc This is middleware for 

module.exports = (req, res, next) => {
    //get the token from the header
    const token = req.header('x-auth-token');

    //check the token
    if (!token) {
        return res.status(401).json({ errors: [{ msg: "No token, autherization denied." }] });
    }

    // if token found then verify it
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ errors: [{ msg: "Token is not valid." }] });
    }
}