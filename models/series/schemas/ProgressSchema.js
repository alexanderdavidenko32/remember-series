/**
 * Created by Alexander Davidenko
 * @date 12/17/17.
 */
let mongoose = require('mongoose');

let progressSchema = mongoose.Schema({
    _id: {
        type: String,
        ref: 'User',
        required: true
    },
    isWatched: {
        type: Boolean,
        default: false
    },
    time: {
        type: Number,
        default: 0
    }
}, { usePushEach: true });

module.exports = progressSchema;

