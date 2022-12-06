const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const multer = require("multer");
const {Kecamatan} = require('../models/kecamatan');
const {TempatPembuanganAkhir, validate} = require('../models/tempatPembuanganAkhir');
const {authorizer} = require('../middleware');

// TPA -> Tempat Pembuangan Akhir

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
    const allTPA = await TempatPembuanganAkhir
                                        .find()
                                        .populate('kecamatan', 'nama');
    res.send(allTPA);
});

router.post('/', [authorizer, upload.single("foto")], async (req, res) => {
    if (!req.file)
        delete req.body.foto;

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

    if (req.file)
        inputs.foto = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    
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

router.put('/:id', [authorizer, upload.single("foto")], async (req, res) => {
    const {id} = req.params;
    const {status, message} = notFoundError;

    if (!req.file)
        delete req.body.foto;

    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const inputs = _.pick(req.body, ['alamat', 'lat', 'lon']);

    const {kecamatanId} = req.body;
    const kecamatan = await Kecamatan.findById(kecamatanId);
    if (!kecamatan)
        return res.status(400).send('"kecamatan ID" is not valid');
    inputs.kecamatan = kecamatanId;

    if (req.file)
        inputs.foto = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };

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