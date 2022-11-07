function error(req, res, next) {
    res.status(500).send('unexpected error occurred');
}

module.exports = error;