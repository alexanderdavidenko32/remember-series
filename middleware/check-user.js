var models = require('../models'),
    errorHandler = require('../lib/error-handler');

module.exports = function() {
    return function(req, res, next) {
        models.user.findById(req.session.userId, function(err, user) {
            if (err) {
                errorHandler(err, res);
            } else {
                req.user = user;
            }
            next();
        });

        //console.log('sid', req.cookies);
        //console.log('user', req.session.user);
    }
};
