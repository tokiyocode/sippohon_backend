const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const {BankSampah, validate} = require('../models/bankSampah');
const {Kecamatan} = require('../models/kecamatan');
const {authorizer} = require('../middleware');

// BS -> Bank Sampah

const router = express.Router();

router.get('/', async (req, res) => {
    const allBankSampah = await BankSampah
                                    .find()
                                    .populate('kecamatan', 'nama');
    res.send(allBankSampah);
});

router.post('/', authorizer, async (req, res) => {
    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const inputs = _.pick(req.body, ['nama', 'alamat', 'lat', 'lon']);

    const {kecamatanId} = req.body;
    const kecamatan = await Kecamatan
                                .findById(kecamatanId)
                                .select('-__v');
    if (!kecamatan)
        return res.status(400).send('"kecamatan ID" is not valid');
    inputs.kecamatan = kecamatanId;

    let newBS = new BankSampah(inputs);
    newBS = await newBS.save();
    newBS.kecamatan = kecamatan;

    res.send(newBS);
});

router.get('/:id', async (req, res) => {
    const {status, message} = notFoundError;
    const {id} = req.params;

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        res.status(status).send(message);

    const bankSampah = await BankSampah
                                    .findById(id)
                                    .populate('kecamatan', 'nama');
    if (!bankSampah)
        res.status(status).send(message);

    res.send(bankSampah);
});

router.put('/:id', authorizer, async (req, res) => {
    const {id} = req.params;
    const {status, message} = notFoundError;

    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const inputs = _.pick(req.body, ['nama', 'alamat', 'lat', 'lon']);

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);

    const {kecamatanId} = req.body;
    const kecamatan = await Kecamatan.findById(kecamatanId);
    if (!kecamatan)
        return res.status(400).send('"kecamatan ID" is not valid');
    inputs.kecamatan = kecamatanId;

    const updatedBS = await BankSampah
                                .findByIdAndUpdate(id, inputs, {new: true})
                                .populate('kecamatan', 'nama');
    if (!updatedBS)
        res.status(status).send(message);
    
    res.send(updatedBS);
});

router.delete('/:id', authorizer, async (req, res) => {
    const {id} = req.params;
    const {status, message} = notFoundError;
    
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);

    const deletedBS = await BankSampah
                            .findByIdAndDelete(id)
                            .populate('kecamatan', 'nama');
    if (!deletedBS)
        return res.status(status).send(message);

    res.send(deletedBS);
});

const notFoundError = {
    status: 404,
    message: 'the "bank sampah" with the given ID was not found'
}

module.exports = router;