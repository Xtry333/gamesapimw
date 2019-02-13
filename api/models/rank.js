const mongoose = require('mongoose');

const rankSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    power: Number
});

module.exports = mongoose.model("Rank", rankSchema);