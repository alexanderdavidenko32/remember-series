//TODO: get rid when json api is enabled
let express = require('express'),
    router = express.Router({mergeParams: true}),

    form = require('express-form2'),
    field = form.field,

    mongoose = require('mongoose'),

    errorHandler = require.main.require('./lib/error-handler'),
    Helper = require.main.require('./lib/Helper'),
    models = require.main.require('./models');

routes = function () {
    let data = {
        title: 'Episode add',
        message: 'Episode add page'
    };
    router
        .route('/')
        .get(function (req, res) {

            if (!req.user) {
                res.redirect(`/series/${req.params.seriesId}/season/${req.params.seasonId}/episode`);
            } else {
                data.user = req.user;
                data._csrf = res.locals._csrf;
                data.form = { method: 'post', _id: '' };
                data.errors = {};
                data.series = {_id: req.params.seriesId};
                data.season = {_id: req.params.seasonId};

                res.render('series/season/episode/add', data);
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
