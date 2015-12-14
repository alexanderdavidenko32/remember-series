var bcrypt = require('bcrypt'),
    form = require('express-form2'),
    field = form.field,

    models = require('../models'),
    errorHandler = require('../lib/error-handler');

module.exports = function (router) {
    var data = {
        title: 'Login',
        message: 'Login page',
        errors: {}
    };
    router.get('/', function (req, res) {
        if (req.user) {
            res.redirect('/');
        } else {
            data._csrf = res.locals._csrf;
            data.errors = {};
            res.render('login', data);
        }
    });
    router.post('/',
        form(
            field('login').trim().required().isEmail('should be email'),
            field('password').required()
        ),
        function(req, res) {
            if (req.user) {
                res.redirect('/');
            } else if (!req.form.isValid) {
                data.errors = req.form.getErrors();
                res.render('login', data);
            } else {
                var login = req.form.login,
                    password = req.form.password;

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
