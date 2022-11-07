const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { Kecamatan } = require('./kecamatan');

const pohonSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    alamat: {
        type: String,
        required: true,
        minlength: 3
    },
    lat: {
        type: Number,
        required: true
    },
    lon: {
        type: Number,
        required: true
    },
    umur: {
        type: Number,
        default: null
    },
    tinggi: {
        type: Number,
        min: 0,
        default: null
    },
    terakhirPerawatan: {
        type: Date,
        default: null
    },
    kecamatan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kecamatan',
        required: true
    }
});

const Pohon = mongoose.model('Pohon', pohonSchema, 'pohon');

function validate(object) {
    const validationSchema = Joi.object({
        nama: Joi.string().min(3).required(),
        alamat: Joi.string().min(3).required(),
        lat: Joi.number().required(),
        lon: Joi.number().required(),
        umur: Joi.number().min(0),
        tinggi: Joi.number().min(0),
        terakhirPerawatan: Joi.date(),
        kecamatanId: Joi.objectId().required()
    });

    const { error } = validationSchema.validate(object);
    return error;
}

exports.Pohon = Pohon;
exports.validate = validate;