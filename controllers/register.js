var bcrypt = require('bcrypt'),
    form = require('express-form2'),
    field = form.field,

    models = require('../models'),
    errorHandler = require('../lib/error-handler');

module.exports = function (router) {
    var data = {
        title: 'Register',
        message: 'Register page'
    };

    router.get('/', function (req, res) {
        data._csrf = res.locals._csrf;
        data.errors = {};
        res.render('register', data);
    });
    router.post('/',
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
                res.render('register', data);
            } else {

                var login = req.form.login,
                    password = req.form.password;

                models.user.findById(login).then(function(user) {
                    // if user exists
                    if (user) {
                        data.errors.userExists = 'User already exists';
                        res.render('register', data);

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

};
