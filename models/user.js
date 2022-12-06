const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);
const bcrypt = require('bcrypt');
const config = require('config');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { roleSchema, Role } = require("./role");

const userSchema = new mongoose.Schema({
    nama: {
        type: String,
        minlength: 5,
        maxlength: 50,
        trim: true,
        required: true
    },
    username: {
        type: String,
        minlength: 5,
        maxlength: 50,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true
    },
    role: roleSchema
});

userSchema.methods.generateToken = function() {
    const token = jwt.sign({_id: this._id, role: this.role}, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('User', userSchema);

function validate(object) {
    const validationSchema = Joi.object({
        nama: Joi.string().min(5).max(50).required(),
        username: Joi.string().alphanum().min(5).max(50).required(),
        password: Joi.string().alphanum().min(5).max(30).required(),
        roleId: Joi.ObjectId().required()
    });

    const {error} = validationSchema.validate(object);
    return error;
}

exports.User = User;
exports.validate = validate;