var models = require('../models'),
    errorHandler = require('../lib/errorHandler');

module.exports = function (router) {
    var data = {
        title: 'Login',
        message: 'Login page',
        errors: {}
    };
    router.get('/', function (req, res) {
        data.errors = {};
        res.render('login', data);
    });
    router.post('/', function(req, res) {
        if (req.user) {
            req.redirect('/');
        } else {
            var login = req.body.login,
                password = req.body.password;

            data.errors = {};
            models.user.findById(login, function(err, user) {
                if (err) {
                    errorHandler(err, res);
                } else {
                    if (user && user.password === password) {
                        req.session.userId = user._id;
                        res.redirect('/');
                    } else {
                        data.errors.wringUsernameOrPassword = 'wrong username or password';
                        res.render('login', data);
                    }
                }
            })
        }
    });
};
