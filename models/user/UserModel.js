var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    email: String
});

module.exports = mongoose.model('User', userSchema);
