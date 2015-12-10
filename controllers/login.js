var bcrypt = require('bcrypt'),
    models = require('../models'),
    errorHandler = require('../lib/error-handler');

module.exports = function (router) {
    var data = {
        title: 'Login',
        message: 'Login page',
        errors: {}
    };
    router.get('/', function (req, res) {
        data._csrf = res.locals._csrf;
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
            models.user.findById(login).then(function(user) {
                if (user && bcrypt.compareSync(password, user.password)) {
                    req.session.userId = user._id;
                    res.redirect('/');
                } else {
                    data.errors.error = 'wrong username or password';
                    res.render('login', data);
                }
                return;
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
        }
    });
};
