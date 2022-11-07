const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const {Role} = require('../models/role');

const router = express.Router();

router.get('/', async (req, res) => {
    const roles = await Role.find();
    res.send(roles);
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const notFoundErr = {
        status: 404,
        message: 'the "role" with the given ID was not found'
    };
    
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(notFoundErr.status).send(notFoundErr.message);
    
    const role = await Role.findById(id);
    if (!role)
        return res.status(notFoundErr.status).send(notFoundErr.message);
    
    res.send(role);
});

module.exports = router;