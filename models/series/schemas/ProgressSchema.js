/**
 * Created by Alexander Davidenko
 * @date 12/17/17.
 */
let mongoose = require('mongoose');

let progressSchema = mongoose.Schema({
    isWatched: {
        type: Boolean,
        default: false
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    time: {
        type: Number,
        default: 0
    }
});

module.exports = progressSchema;

