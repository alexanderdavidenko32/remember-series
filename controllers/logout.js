var errorHandler = require('../lib/error-handler');

module.exports = function (router) {
    router.get('/', function (req, res) {
        req.session.destroy(function(err) {
            // TODO: remove session from database, then redirect
            if (err) {
                errorHandler(err);
            } else {
                console.log('session destroyed');
                res.redirect('/');
            }
        });
    });
};
