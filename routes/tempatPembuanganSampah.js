const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const {TempatPembuanganSampah, validate} = require('../models/tempatPembuanganSampah');
const {Kecamatan} = require('../models/kecamatan');
const {authorizer} = require('../middleware');

// TPS -> Tempat Pembuangan Sampah

const router = express.Router();

router.get('/', async (req, res) => {
    const allTPS = await TempatPembuanganSampah
                                        .find()
                                        .populate('kecamatan', 'nama');
    res.send(allTPS);
});

router.post('/', authorizer, async (req, res) => {
    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const inputs = _.pick(req.body, ['alamat', 'lat', 'lon']);

    const {kecamatanId} = req.body;
    const kecamatan = await Kecamatan
                                .findById(kecamatanId)
                                .select('-__v');
    if (!kecamatan)
        return res.status(400).send('"kecamatan ID" is not valid');
    inputs.kecamatan = kecamatanId;

    let newTPS = new TempatPembuanganSampah(inputs);
    newTPS = await newTPS.save();
    newTPS.kecamatan = kecamatan;

    res.send(newTPS);
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const {status, message} = notFoundError;

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);

    const tempatPembuanganSampah = await TempatPembuanganSampah
                                    .findById(id)
                                    .populate('kecamatan', 'nama');
    if (!tempatPembuanganSampah)
        return res.status(status).send(message);

    res.send(tempatPembuanganSampah);
});

router.put('/:id', authorizer, async (req, res) => {
    const {id} = req.params;
    const {status, message} = notFoundError;

    const error = validate(req.body);
    if (error)
        res.status(400).send(error.details[0].message);
    const inputs = _.pick(req.body, ['alamat', 'lat', 'lon'])

    const {kecamatanId} = req.body;
    const kecamatan = await Kecamatan.findById(kecamatanId)
    if (!kecamatan)
        return res.status(status).send(message);
    inputs.kecamatan = kecamatanId;

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);

    let updatedTPS = await TempatPembuanganSampah
                                        .findByIdAndUpdate(id, inputs, {new: true})
                                        .populate('kecamatan', 'nama');
    if (!updatedTPS)
        return res.status(status).send(message);

    res.send(updatedTPS);
});

router.delete('/:id', authorizer, async (req, res) => {
    const {id} = req.params;
    const {status, message} = notFoundError;

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);

    const deletedTPS = await TempatPembuanganSampah
                                        .findByIdAndDelete(id)
                                        .populate('kecamatan', 'nama');
    if (!deletedTPS)
        return res.status(status).send(message);
    
    res.send(deletedTPS);
});

const notFoundError = {
    status: 404,
    message: 'the "tempat pembuangan sampah" with the given id was not found'
};

module.exports = router;