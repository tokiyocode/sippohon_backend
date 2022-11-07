const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const tpaSchema = new mongoose.Schema({
    alamat: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lon: {
        type: Number,
        required: true
    },
    kecamatan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kecamatan',
        required: true
    }
});

function validate(object) {
    const schema = Joi.object({
        alamat: Joi.string().min(3).required(),
        lat: Joi.number().required(),
        lon: Joi.number().required(),
        kecamatanId: Joi.ObjectId().required()
    });

    const {error} = schema.validate(object);
    if (error) return error;
}

const TempatPembuanganAkhir = mongoose.model('Tempat Pembuangan Akhir', tpaSchema, 'tempat pembuangan akhir');

exports.TempatPembuanganAkhir = TempatPembuanganAkhir;
exports.validate = validate;