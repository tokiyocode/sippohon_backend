const config = require('config');
const jwt = require('jsonwebtoken');

function authorize(req, res, next) {
    const token = req.headers['x-auth-token'];
    if (!token)
        return res.status(401).send('access denied, no token provided');

    try {
        const payload = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = payload;
        next();
    }
    catch {
        res.status(400).send('token does not valid');
    }
}

module.exports = authorize;