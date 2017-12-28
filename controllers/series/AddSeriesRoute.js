//TODO: get rid when json api is enabled
let form = require('express-form2'),
    field = form.field,

    express = require('express'),
    router = express.Router({mergeParams: true}),

    errorHandler = require.main.require('./lib/error-handler'),
    models = require.main.require('./models');

routes = function () {
    let data = {
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
                data.form = {_id: '', method: 'POST'};
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

        });

    return router;
};

module.exports = routes();
