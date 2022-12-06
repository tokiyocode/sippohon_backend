const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');


const tpsSchema = new mongoose.Schema({
    alamat: {
        type: String,
        trim: true,
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
    },
    foto: {
        data: Buffer,
        contentType: String
    }
});

const TempatPembuanganSampah = mongoose.model('Tempat Pembuangan Sampah', tpsSchema, 'tempat pembuangan sampah');

function validate(object) {
    const schema = Joi.object({
        alamat: Joi.string().required(),
        lat: Joi.number().required(),
        lon: Joi.number().required(),
        kecamatanId: Joi.ObjectId().required()
    });

    const { error } = schema.validate(object);
    return error;
}

exports.TempatPembuanganSampah = TempatPembuanganSampah;
exports.validate = validate; 