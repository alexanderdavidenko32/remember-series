var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [3, 'The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).']
    },
    name: String,
    email: String
});

module.exports = mongoose.model('User', userSchema);
