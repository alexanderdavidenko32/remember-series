var mongoose = require('mongoose');

var sessionSchema = mongoose.Schema({
    _id: String,
    user: String
});

module.exports = mongoose.model('Session', sessionSchema);
