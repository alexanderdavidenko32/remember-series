var form = require('express-form2'),
    field = form.field,

    express = require('express'),
    router = express.Router({mergeParams: true}),

    errorHandler = require('../../lib/error-handler'),
    models = require('../../models');

routes = function () {
    var data = {
        title: 'Series add',
        message: 'Series add page'
    };
    router
        .route('/')
        .get(function (req, res) {

            if (!req.user) {
                res.redirect('/series');
            } else {
                data.user = req.user;
                data._csrf = res.locals._csrf;
                data.form = {};
                data.errors = {};
                res.render('series/add', data);
            }
        })
        .post(
            form(
                field('name').trim().required(),
                field('description'),
                field('poster').isUrl('poster should be an url'),
                field('year').isNumeric('year should be numeric')//.min(1900).max(2100)
            ),
            function(req, res) {

                if (!req.user) {
                    res.redirect('/series');
                } else if (!req.form.isValid) {
                    data.errors = req.form.getErrors();
                    data.form = req.form;
                    res.render('series/add', data);
                } else {
                    let series = new models.series({
                        name: req.form.name,
                        description: req.form.description,
                        poster: req.form.poster,
                        year: req.form.year,
                        creator: req.user._id
                    });

                    data.errors = {};

                    models.series.create(series)
                    .then(function(series) {
                        res.redirect('/series/' + series._id);
                    })
                    .catch(function(err) {
                        errorHandler(err, res);
                    });
                }

        });

    return router;
};

module.exports = routes();
