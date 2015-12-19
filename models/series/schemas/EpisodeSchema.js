var mongoose = require('mongoose');

var episodeSchema = mongoose.Schema({
    number: {
        type: Number,
        required: true,
        min: 0
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
    creator: {
        type: String,
        ref: 'User',
        required: true
    }
});

module.exports = episodeSchema;
