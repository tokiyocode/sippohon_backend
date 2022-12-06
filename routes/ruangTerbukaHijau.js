const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const multer = require("multer");
const {Kecamatan} = require('../models/kecamatan');
const {RuangTerbukaHijau, validate} = require('../models/ruangTerbukaHijau');
const { authorizer, coordinateParser } = require('../middleware');

// RTH -> Ruang Terbuka Hijau
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
    const allRTH = await RuangTerbukaHijau
                                    .find()
                                    .populate('kecamatan', 'nama');
    res.send(allRTH);
});

router.post('/', [authorizer, upload.single("foto"), coordinateParser], async (req, res) => {
    if (!req.file)
        delete req.body.foto;

    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const inputs = _.pick(req.body, ['nama', 'alamat', 'lats', 'lons']);
    
    const {kecamatanId} = req.body;
    const kecamatan = await Kecamatan.findById(kecamatanId).select('-__v');
    if (!kecamatan)
        return res.status(400).send('"kecamatan ID" is not valid');
    inputs.kecamatan = kecamatanId;

    if (req.file)
        inputs.foto = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };

    let newRTH = new RuangTerbukaHijau(inputs);
    newRTH = await newRTH.save();
    newRTH.kecamatan = kecamatan;
    res.send(newRTH);
});

router.get('/:id', async (req, res) => {
    const {status, message} = notFoundError;

    const {id} = req.params;
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);
    
    const rth = await RuangTerbukaHijau
                                .findById(id)
                                .populate('kecamatan', 'nama');
    if (!rth)
        return res.status(status).send(message);

    res.send(rth);
});

router.put('/:id', [authorizer, upload.single("foto"), coordinateParser], async (req, res) => {
    const {status, message} = notFoundError;

    if (!req.file)
        delete req.body.foto;

    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const inputs = _.pick(req.body, ['nama', 'lats', 'lons', 'alamat']);
    
    const {kecamatanId} = req.body;
    const kecamatan = await Kecamatan.findById(kecamatanId).select('-__v');
    if (!kecamatan)
        return res.status(400).send('"kecamatan ID" is not valid');
    inputs.kecamatan = kecamatanId;

    if (req.file)
        inputs.foto = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    
    const {id} = req.params;
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);

    const updatedRTH = await RuangTerbukaHijau
                                .findByIdAndUpdate(id, inputs, {new: true})
                                .populate('kecamatan', 'nama');
    if (!updatedRTH)
        return res.status(status).send(message);

    res.send(updatedRTH);
});

router.delete('/:id', authorizer, async (req, res) => {
    const {status, message} = notFoundError;

    const {id} = req.params;
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);
    
    const deletedRTH = await RuangTerbukaHijau
                                    .findByIdAndDelete(id)
                                    .populate('kecamatan', 'nama');
    if (!deletedRTH)
        return res.status(status).send(message);
    
    res.send(deletedRTH);
});

const notFoundError = {
    status: 404,
    message: 'the "ruang terbuka hijau" with the given ID was not found'
};

module.exports = router;