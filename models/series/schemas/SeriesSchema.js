var mongoose = require('mongoose'),
    seasonSchema = require('./SeasonSchema');

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
    creatorId: {
        type: String,
        required: true
    },
    //genre: {
        //type: Array
    //},
    //
    seasons: [seasonSchema]

});

module.exports = seriesSchema;
