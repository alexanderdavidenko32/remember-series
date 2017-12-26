var mongoose = require('mongoose'),
    seasonSchema = require('./schemas/SeasonSchema');

module.exports = mongoose.model('Season', seasonSchema);
