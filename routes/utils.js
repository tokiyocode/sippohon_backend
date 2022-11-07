const express = require("express");
const mongoose = require("mongoose");
const {Pohon} = require("../models/pohon");
const {BankSampah} = require("../models/bankSampah");
const {TempatPembuanganSampah} = require("../models/tempatPembuanganSampah");
const {TempatPembuanganAkhir} = require("../models/tempatPembuanganAkhir");
const {RuangTerbukaHijau} = require("../models/ruangTerbukaHijau");
const { authorizer } = require("../middleware");
const { User } = require("../models/user");

const router = express.Router();

router.get('/numOfDocuments', authorizer, async (req, res) => {
    const pohonLength = await Pohon.countDocuments();
    const bankSampahLength = await BankSampah.countDocuments();
    const tPSLength = await TempatPembuanganSampah.countDocuments();
    const tPALength = await TempatPembuanganAkhir.countDocuments();
    const rthLength = await RuangTerbukaHijau.countDocuments();

    const tableLengths = {
        "Pohon": pohonLength,
        "Bank Sampah": bankSampahLength,
        "Tempat Pembuangan Sampah": tPSLength,
        "Tempat Pembuangan Akhir": tPALength,
        "Ruang Terbuka Hijau": rthLength
    };

    res.send(tableLengths);
});

module.exports = router;