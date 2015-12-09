var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: String,
    name: String,
    password: String,
    email: String
});

module.exports = mongoose.model('User', userSchema);
