var mongoose = require('mongoose'),
    seasonSchema = require('./SeasonSchema'),
    progressSchema = require('./ProgressSchema');

var seriesSchema = mongoose.Schema({
    //_id: {
        //type: String,
        //required: true,
        //unique: true
    //},
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
    //genre: {
        //type: Array
    //},
    //
    progress: [progressSchema],
    seasons: [seasonSchema]

});

module.exports = seriesSchema;
