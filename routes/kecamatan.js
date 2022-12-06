const express = require('express');
const mongoose = require('mongoose');
const { Kecamatan } = require('../models/kecamatan');

const router = express.Router();

router.get('/', async (req, res) => {
    const allKecamatan = await Kecamatan.find();
    res.send(allKecamatan);
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const notFoundErr = {
        status: 404,
        message: 'The "kecamatan" with the given ID was not found'
    }
    
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(notFoundErr.status).send(notFoundErr.message);
    
    const kecamatan = Kecamatan.findById(id);
    if (!kecamatan)
        return res.status(notFoundErr.status).send(notFoundErr.message);

    res.send(kecamatan);
});

module.exports = router;