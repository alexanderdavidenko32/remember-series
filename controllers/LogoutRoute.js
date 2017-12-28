let errorHandler = require.main.require('./lib/error-handler');

module.exports = function (req, res) {
    req.session.destroy(function(err) {
        if (err) {
            errorHandler(err);
        } else {
            console.log('session destroyed');
            res.redirect('/');
        }
    });
};
