require('express-async-errors');
const error = require('./middleware/error');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const dbDebugger = require('debug')('sippohon:db');
const defaultDebugger = require('debug')('sippohon:default')
const helmet = require('helmet');
const cors = require('cors');
const {
    kecamatan,
    pohon,
    tempatPembuanganAkhir,
    tempatPembuanganSampah,
    bankSampah,
    ruangTerbukaHijau,
    users,
    roles,
    auth,
    utils
} = require('./routes');

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: token private key should be set to perform authentication');
    process.exit();
}

mongoose.connect(config.get('db_connection'))
    .then(() => dbDebugger('Connected to the database...'))
    .catch((error) => dbDebugger(error));

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/kecamatan', kecamatan);
app.use('/pohon', pohon);
app.use('/ruangTerbukaHijau', ruangTerbukaHijau);
app.use('/tempatPembuanganSampah', tempatPembuanganSampah);
app.use('/tempatPembuanganAkhir', tempatPembuanganAkhir);
app.use('/bankSampah', bankSampah);
app.use('/users', users); 
app.use('/roles', roles);
app.use('/auth', auth);
app.use('/utils', utils);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => defaultDebugger(`Listening on port ${port} ...`));