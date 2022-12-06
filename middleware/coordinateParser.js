function parseCoordinate(req, res, next) {
    const lats = [];
    const lons = [];
    Object.keys(req.body).forEach(key => {
        if (key.includes("lats")) {
            lats.push(req.body[key]);
            delete req.body[key];
        }
        else if (key.includes("lons")) {
            lons.push(req.body[key]);
            delete req.body[key];
        }
    });

    req.body.lats = lats;
    req.body.lons = lons;
    next();
}

module.exports = parseCoordinate;