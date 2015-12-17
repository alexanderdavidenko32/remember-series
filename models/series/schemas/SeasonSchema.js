var mongoose = require('mongoose'),
    episodeSchema = require('./EpisodeSchema');

var seasonSchema = mongoose.Schema({
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
    number: {
        type: Number,
        required: true
    },
    episodes: [episodeSchema]

});

module.exports = seasonSchema;
