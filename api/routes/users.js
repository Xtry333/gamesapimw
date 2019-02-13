const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const mongoose = require('mongoose');

const User = require('../models/user');

function hash(str) {
    const hash = crypto.createHash('sha256');
    return hash.update(str).digest('hex').toString('hex');
}

router.get('/', (req, res, next) => {
    User.find().exec().then((result) => {
        if (result) {
            res.status(200).json({
                length: result.length,
                users: result
            });
        } else {
            res.status(404).json({
                err: 'Not Found'
            });
        }
    }).catch((err) => {
        res.status(500).json({
            shorterror: 'Something went wrong',
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email.toLowerCase(),
        password: hash(req.body.password)
    });

    user.save().then((result) => {
        res.status(200).json({
            message: "Created user",
            user: result
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: "Error",
            error: err
        });
    });
});

router.get('/:username', (req, res, next) => {
    const username = req.params.username;
    User.findOne({username: username}).exec().then((result) => {
        if (result) {
            res.status(200).json({
                user: result
            });
        } else {
            next();
        }
    }).catch((err) => {
        res.status(500).json({
            shorterror: 'Invalid username',
            error: err
        });
    });
});

router.get('/:email', (req, res, next) => {
    const email = req.params.email;
    User.findOne({email: email}).exec().then((result) => {
        if (result) {
            res.status(200).json({
                user: result
            });
        } else {
            res.status(404).json({
                error: 'User not found',
                reqUsername: username
            });
        }
    }).catch((err) => {
        res.status(500).json({
            shorterror: 'Invalid username',
            error: err
        });
    });
});

router.patch('/:username', (req, res, next) => {
    const username = req.params.username;
    const newUser = req.body;
    newUser.username = username;
    if (newUser.hasOwnProperty('password')) {
        newUser.password = hash(newUser.password);
    }
    User.findOneAndUpdate({username: username}, {$set: newUser}, {runValidators: true}).exec().then((oldUser) => {
        res.status(200).json({
            message: "User updated",
            oldUser: oldUser,
            newUser: newUser,
        });
    }).catch(callError);

    function callError(err) {
        res.status(500).json({
            error: err,
            reqUsername: username,
            newUser: newUser
        });
    }
});

router.delete('/:username', (req, res, next) => {
    const username = req.params.username;
    User.findOneAndDelete({username: username}).exec().then((result) => {
        if (result) {
            res.status(200).json({
                message: "User removed from database",
                reqUsername: req.params.username,
                user: result
            });
        } else {
            res.status(404).json({
                message: "User not found",
                reqUsername: req.params.username,
            });
        }
    }).catch((err) => {
        res.status(500).json({
            error: err,
        })
    });
});

router.purge('/', (req, res, next) => {
    const date = new Date();
    if (req.body.confirm && req.body.month == date.getMonth() + 1) {
        User.deleteMany().exec().then((result) => {
            res.status(200).json({
                message: "Users purged",
            })
        }).catch((err) => {
            res.status(500).json({
                error: err,
            })
        });
    } else {
        const date = new Date();
        res.status(403).json({
            message: "Expected confirmation and current month",
            newBody: {
                confirm: true,
                month: date.getMonth() + 1
            }
        })
    }
});

module.exports = router;