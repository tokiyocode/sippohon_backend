const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const {Kecamatan} = require('../models/kecamatan');
const {TempatPembuanganAkhir, validate} = require('../models/tempatPembuanganAkhir');
const {authorizer} = require('../middleware');

// TPA -> Tempat Pembuangan Akhir

const router = express.Router();

router.get('/', async (req, res) => {
    const allTPA = await TempatPembuanganAkhir
                                        .find()
                                        .populate('kecamatan', 'nama');
    res.send(allTPA);
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
    
    let newTPA = new TempatPembuanganAkhir(inputs);
    newTPA = await newTPA.save();
    newTPA.kecamatan = kecamatan;

    res.send(newTPA);
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const {status, message} = notFoundError;

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);

    const tPA = await TempatPembuanganAkhir
                                .findById(id)
                                .populate('kecamatan', 'nama');
    if (!tPA)
        return res.status(status).send(message);
    
    res.send(tPA);
});

router.put('/:id', authorizer, async (req, res) => {
    const {id} = req.params;
    const {status, message} = notFoundError;

    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const inputs = _.pick(req.body, ['alamat', 'lat', 'lon']);

    const {kecamatanId} = req.body;
    const kecamatan = await Kecamatan.findById(kecamatanId);
    if (!kecamatan)
        return res.status(400).send('"kecamatan ID" is not valid');
    inputs.kecamatan = kecamatanId;

     const isValidId = mongoose.isValidObjectId(id);
     if (!isValidId)
        return res.status(status).send(message);

    const updatedTPA = await TempatPembuanganAkhir
                                            .findByIdAndUpdate(id, inputs, {new: true})
                                            .populate('kecamatan', 'nama');
    if (!updatedTPA)
        return res.status(status).send(message);

    res.send(updatedTPA);
});

router.delete('/:id', authorizer, async (req, res) => {
    const {id} = req.params;
    const {status, message} = notFoundError;

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);

    const deletedTPA = await TempatPembuanganAkhir
                                            .findByIdAndDelete(id)
                                            .populate('kecamatan', 'nama');
    if (!deletedTPA)
        return res.status(status).send(message);

    res.send(deletedTPA);
});

const notFoundError = {
    status: 404,
    message: 'the "tempat pembuangan akhir" with given id was not found'
};

module.exports = router;