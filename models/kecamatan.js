const mongoose = require('mongoose');

const kecamatanSchema = new mongoose.Schema({
    nama: {
        type: String, 
        required: true
    }
});

const Kecamatan = mongoose.model('Kecamatan', kecamatanSchema, 'kecamatan');

exports.Kecamatan = Kecamatan;