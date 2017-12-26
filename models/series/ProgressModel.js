var mongoose = require('mongoose'),
    progressSchema = require('./schemas/ProgressSchema');

module.exports = mongoose.model('Progress', progressSchema);
