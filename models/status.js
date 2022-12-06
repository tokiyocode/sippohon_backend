const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    label: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Status = mongoose.model('Status', statusSchema, 'status');

exports.Status = Status;