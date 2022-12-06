function superAdminAuthorize(req, res, next) {
    if (req.user.role.label !== "Super Admin")
        return res.status(403).send('access denied');

    next();
}

module.exports = superAdminAuthorize;