var mongoose = require('mongoose');

var episodeSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    poster: {
        type: String
    },
    number: {
        type: Number,
        required: true
    }
});

module.exports = episodeSchema;
