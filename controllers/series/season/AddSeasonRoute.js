//TODO: get rid when json api is enabled
let express = require('express'),
    router = express.Router({mergeParams: true}),
    mongoose = require('mongoose'),

    form = require('express-form2'),
    field = form.field,

    errorHandler = require.main.require('./lib/error-handler'),
    Helper = require.main.require('./lib/Helper'),
    models = require.main.require('./models');

routes = function () {
    let data = {
        title: 'Season add',
        message: 'Season add page'
    };
    router
        .route('/')
        .get(function (req, res) {

            if (!req.user) {
                res.redirect('/series/' + req.params.seriesId +  '/season');
            } else {
                data.user = req.user;
                data._csrf = res.locals._csrf;
                // TODO: get rid after json api enabled
                data.form = {_id: '', method: 'POST'};
                data.errors = {};
                data.series = {_id: req.params.seriesId};

                res.render('series/season/add', data);
            }
        })
        .post(
            form(
                field('number').isNumeric('number should be numeric').required(),
                field('name').trim().required(),
                field('description'),
                field('poster').isUrl('poster should be an url'),
                field('year').isNumeric('year should be numeric')//.min(1900, 'year should be greater than 1900').max(2100, 'year should be less than 2100')
            ),
            function(req, res) {



        });
    return router;
};

module.exports = routes();
