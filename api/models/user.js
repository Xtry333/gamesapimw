const mongoose = require('mongoose');

const userRegex = /^[a-z0-9_-]{4,32}$/i;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    username: {type: String, match: userRegex, required: [true, 'Username is required'], index: true, unique: [true, 'Username already registered']},
    password: {type: String, required: [true, 'Password is required']},
    email: {type: String, match: emailRegex, required: [true, 'Email is required'], lowercase: true, unique: [true, 'Email already registered']},
    gender: {type: String, enum: ['Male', 'Female'], required: false},
    image: {type: String, required: false},
    editpower: {type: Boolean, required: false, default: false},
    creationdate: {type: Date, required: false, default: Date.now},
    description: {type: String, required: false},
    firstname: {type: String, required: false},
    lastname: {type: String, required: false}
});

module.exports = mongoose.model("User", userSchema);