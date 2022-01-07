const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const middle = (req, res, next) => {
    let authToken = req.headers.authorization;
    const token = authToken.split(' ');

    jwt.verify(token[1], config.SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).send(
                {
                    Message: "Invalid Token"
                })
        }
        req.email = decoded.email;
        return next();
    });
}

module.exports = middle;