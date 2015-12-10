var models = require('../models'),
    errorHandler = require('../lib/error-handler');

module.exports = function() {
    return function(req, res, next) {
        models.user.findById(req.session.userId).then(function(user) {
            req.user = user;
            next();
        }).catch(function(err) {
            errorHandler(err, res);
            next();
        });
    }
};
