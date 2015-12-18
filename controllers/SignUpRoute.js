var bcrypt = require('bcrypt'),
    form = require('express-form2'),
    field = form.field,
    express = require('express'),
    router = express.Router(),

    models = require('../models'),
    errorHandler = require('../lib/error-handler'),
    routes;

routes = function () {
    var data = {
        title: 'Sign up',
        message: 'Sign up page'
    };

    router.route('/').get(function (req, res) {
        data._csrf = res.locals._csrf;
        data.errors = {};
        res.render('signup', data);
    })
    .post(
        form(
            field('login').trim().required().isEmail('should be email'),
            field('password').required()
        ),
        function(req, res) {
            data.errors = {};
            //console.log('cookie:', req.cookies);
            //console.log('session:', req.session.id);
            //console.log('session cookie:', req.session.cookie.connect);
            if (!req.form.isValid) {
                data.errors = req.form.getErrors();
                res.render('signup', data);
            } else {

                var login = req.form.login,
                    password = req.form.password;

                models.user.findById(login).then(function(user) {
                    // if user exists
                    if (user) {
                        data.errors.userExists = 'User already exists';
                        res.render('signup', data);

                        throw 'User already exists';
                    }
                    return;
                })
                .then(function() {
                    var salt = bcrypt.genSaltSync(),
                        passwordHash = bcrypt.hashSync(password, salt);

                    return models.user.create({
                        _id: login,
                        email: login,
                        password: passwordHash
                    });
                })
                .then(function(user){
                    req.session.userId = user._id;
                    res.redirect('/');
                })
                .catch(function(err) {
                    errorHandler(err, res);
                });
            }
        });

    return router;
};
module.exports = routes();
