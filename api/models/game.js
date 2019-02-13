const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {type: String, required: true, index: true},
    description: {type: String, required: false},
    image: {type: String, required: false},
    keywords: {type: Array, required: false}
});

module.exports = mongoose.model("Game", gameSchema);