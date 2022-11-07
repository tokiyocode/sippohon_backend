const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Role } = require('../models/role');
const {authorizer, superAdminAuthorizer} = require('../middleware');
const {User, validate} = require('../models/user');

const router = express.Router();

router.get('/me', authorizer, async (req, res) => {
    const token = req.headers['x-auth-token'];
    if (!token)
        return res.status(401).send('access denied, no token provided')
   try {
        const payload = jwt.verify(token, config.get('jwtPrivateKey'));
        const currentUser = await User
                                    .findById(payload._id)
                                    .select('-password');
        res.send(currentUser);
   } 
   catch {
        return res.status(400).send('token is not valid');
   }

});

router.get('/', [authorizer, superAdminAuthorizer], async (req, res) => {
    const users = await User
                        .find()
                        .select('-password');
    res.send(users);
});

router.post('/', [authorizer, superAdminAuthorizer], async (req, res) => {
    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const inputs = _.pick(req.body, ['nama']);
    inputs.password = await hashPassword(req.body.password);

    const {username} = req.body;
    const user = await User.findOne({username});
    if (user)
        return res.status(400).send('the "username" has already been used');
    inputs.username = username;

    const {roleId} = req.body;
    const role = await Role
                        .findById(roleId)
                        .select('-__v');
    if (!role)
        return res.status(400).send('"role ID" is not valid');
    inputs.role = role;

    let newUser = new User(inputs);
    newUser = await newUser.save();
    newUser.role = role;

    res.send(_.pick(newUser, ['_id', 'nama', 'username', 'role']));
});

router.get('/:id', [authorizer, superAdminAuthorizer], async (req, res) => {
    const {id} = req.params;
    const {status, message} = notFoundError;

    const isValidObjectId = mongoose.isValidObjectId(id);
    if (!isValidObjectId)
        return res.status(status).send(message);
    
    const user = await User
                        .findById(id)
                        .select('-password');
    if (!user)
        return res.status(status).send(message);
    
    res.send(user);
});

router.put('/:id', [authorizer, superAdminAuthorizer], async (req, res) => {
    const {id} = req.params;
    const {roleId, username} = req.body;
    const {status, message} = notFoundError;
    
    const error = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const inputs = _.pick(req.body, ['nama']);
    inputs.password = await hashPassword(req.body.password);

    const user = await User.findOne({username});
    if (user && user.id !== id)
        return res.status(400).send('the "username" has already been used');
    inputs.username = username;

    const role = await Role.findById(roleId);
    if (!role)
        return res.status(400).send('"role ID" is not valid');
    inputs.role = role;

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);
    
    const updatedUser = await User
                                .findByIdAndUpdate(id, inputs, {new: true});
    if (!updatedUser)
        return res.status(status).send(message);

    res.send(_.pick(updatedUser, ['_id', 'nama', 'username', 'role']));
});

router.delete('/:id', [authorizer, superAdminAuthorizer], async (req, res) => {
    const {id} = req.params;
    const {status, message} = notFoundError;

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
        return res.status(status).send(message);

    const deletedUser = await User
                                .findByIdAndDelete(id)
                                .select('-password')
                                .populate('role', 'label');
    if (!deletedUser)
        return res.status(status).send(message);

    res.send(deletedUser);
});

const notFoundError = {
    status: 404,
    message: 'the "user" with the given ID was not found'
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

module.exports = router;