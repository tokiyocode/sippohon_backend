const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const bankSampahSchema = new mongoose.Schema({
    nama: {
        type: String,
        min: 3,
        max: 255,
        trim: true,
        required: true
    },
    alamat: {
        type: String,
        min: 5,
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
    }
});

const BankSampah = mongoose.model('Bank Sampah', bankSampahSchema, 'bank sampah');

function validate(object) {
    const schema = Joi.object({
        nama: Joi.string().min(3).max(255).required(),
        alamat: Joi.string().min(5).required(),
        lat: Joi.number().required(),
        lon: Joi.number().required(),
        kecamatanId: Joi.ObjectId().required()
    });

    const {error} = schema.validate(object);
    return error;
}

exports.BankSampah = BankSampah;
exports.validate = validate;