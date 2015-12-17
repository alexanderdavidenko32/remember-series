var mongoose = require('mongoose');

var episodeSchema = mongoose.Schema({
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
