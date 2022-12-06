const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const {Kecamatan} = require('../models/kecamatan');
const {Pohon, validate} = require('../models/pohon');
const {authorizer} = require('../middleware');
const multer = require("multer");

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.get('/', async ( req, res) => {
    const allPohon = await Pohon
                        .find()
                        .populate('kecamatan', ('nama'));
    res.send(allPohon);
});

router.post('/', [authorizer, upload.single("foto")] , async (req, res) => {
    if (!req.file)
        delete req.body.foto;

    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    
    const inputs = _.pick(req.body, ['nama', 'alamat', 'lat', 'lon', 'umur', 'tinggi', 'terakhirPerawatan']);

    const { kecamatanId } = req.body;
    const kecamatan = await Kecamatan.findById(kecamatanId);
    if (!kecamatan)
        return res.status(400).send('invalid kecamatan ID');
    inputs.kecamatan = kecamatanId;

    if (req.file)
        inputs.foto = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
        
    let newPohon = new Pohon(inputs);
    newPohon = await newPohon.save();
    newPohon = await Pohon.findById(newPohon.id).populate('kecamatan', 'nama');

    res.send(newPohon);
});

router.get('/:id', async (req, res) => {
    const {status, message} = notFoundError;
    const isValidId = mongoose.isValidObjectId(req.params.id);
    if (!isValidId)
        return res.status(status).send(message);

    const pohon = await Pohon
                    .findById(req.params.id)
                    .populate('kecamatan', 'nama');

    if (!pohon)
        return res.status(status).send(message);    
    res.send(pohon);
});

router.put('/:id', [authorizer, upload.single("foto")], async (req, res) => {
    if (!req.file)
        delete req.body.foto;

    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const inputs = _.pick(req.body, ['nama', 'alamat', 'lat', 'lon', 'umur', 'tinggi', 'terakhirPerawatan']);

    const {kecamatanId} = req.body;
    const kecamatan = Kecamatan.findById(kecamatanId);
    if (!kecamatan)
        return res.status(400).send('invalid kecamatan ID');
    inputs.kecamatan = kecamatanId;

    if (req.file)
        inputs.foto = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };

    const {status, message} = notFoundError;

    const {id} = req.params;
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);

    const updatedPohon = await Pohon
                                .findByIdAndUpdate(id, inputs, {new: true})
                                .populate('kecamatan', 'nama');
    if (!updatedPohon)
        return res.status(status).send(message);

    res.send(updatedPohon);
});

router.delete('/:id', authorizer, async (req, res) => {
    const {status, message} = notFoundError;

    const {id} = req.params;
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);

    const deletedPohon = await Pohon.findByIdAndDelete(id).populate('kecamatan', 'nama');
    if (!deletedPohon)
        return res.status(status).send(message);

    res.send(deletedPohon);
});

const notFoundError = {
    status: 404,
    message: 'the "pohon" with the given ID was not found'
}

module.exports = router;
