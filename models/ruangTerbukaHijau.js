const mongoose = require('mongoose');
const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);

const rthSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    alamat: {
        type: String,
        required: true
    },
    lats: {
        type: [Number],
        required: true
    },
    lons: {
        type: [Number],
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

const RuangTerbukaHijau = mongoose.model('Ruang Terbuka Hijau', rthSchema, 'ruang terbuka hijau');

function validate(object) {
    const schema = Joi.object({
        nama: Joi.string().min(3).max(255).required(),
        alamat: Joi.string().min(3).required(),
        lats: Joi.array().items(Joi.number()).required(),
        lons: Joi.array().items(Joi.number()).required(),
        kecamatanId: Joi.ObjectId().required()
    });

    const { error } = schema.validate(object);
    if (error) return error;
}

exports.RuangTerbukaHijau = RuangTerbukaHijau;
exports.validate = validate;