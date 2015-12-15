var mongoose = require('mongoose'),
    seriesSchema = require('./schemas/SeriesSchema');

module.exports = mongoose.model('Series', seriesSchema);
