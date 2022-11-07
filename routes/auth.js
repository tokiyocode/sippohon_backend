const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const {User} = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let user = await User.findOne({username: req.body.username});
    if (!user)
        return res.status(400).send('"username" is not valid');

    const isValidPass = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPass)
        return res.status(400).send(`invalid password for username "${req.body.username}"`)

    res.send(user.generateToken());
});

function validate(inputs) {
    const validationSchema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        password: Joi.string().max(50).required(),
    });

    const {error} = validationSchema.validate(inputs);
    return error;
}

module.exports = router;