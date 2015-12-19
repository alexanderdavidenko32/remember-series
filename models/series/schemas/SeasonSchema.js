var mongoose = require('mongoose'),
    episodeSchema = require('./EpisodeSchema');

var seasonSchema = mongoose.Schema({
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
    year: {
        type: Number
    },
    creator: {
        type: String,
        ref: 'User',
        required: true
    },
    episodes: [episodeSchema]

});

module.exports = seasonSchema;
