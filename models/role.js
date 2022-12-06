const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    label: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 50,
        required: true
    }
});

const Role = mongoose.model('Role', roleSchema);

exports.roleSchema = roleSchema;
exports.Role = Role;