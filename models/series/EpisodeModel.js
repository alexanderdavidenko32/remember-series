var mongoose = require('mongoose'),
    episodeSchema = require('./schemas/EpisodeSchema');

module.exports = mongoose.model('Episode', episodeSchema);
