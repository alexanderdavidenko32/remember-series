var models = require('../models'),
    errorHandler = require('../lib/errorHandler');

module.exports = function (router) {
    var data = {
        title: 'Register',
        message: 'Register page',
        errors: {}
    };

    router.get('/', function (req, res) {
        data.errors = {};
        res.render('register', data);
    });
    router.post('/', function(req, res) {
        //console.log('cookie:', req.cookies);
        //console.log('session:', req.session.id);
        //console.log('session cookie:', req.session.cookie.connect);

        var login = req.body.login,
            password = req.body.password;
        //req.session.user = 'i am user';
        //res.redirect('/');

        models.user.find({"_id": login}, function(err, user) {
            if (err) {
                errorHandler(err, res);
            } else {
                data.errors = {};
                // if user exists
                if (user.length) {
                    data.errors.userExists = 'User already exists';
                    res.render('register', data);
                } else {
                    models.user.create({
                        _id: login,
                        email: login,
                        password: password
                    }, function(err, user) {
                        if (err) {
                            errorHandler(err, res);
                        } else {
                            //console.log(user);

                            req.session.userId = user._id;
                            res.redirect('/');
                        }
                    });
                }
            }
        });
    });
};
