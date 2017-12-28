//TODO: get rid when json api is enabled
/**
 * Created by Alexander Davidenko
 * @date 12/26/17.
 */
let express = require('express'),
    router = express.Router({mergeParams: true}),

    form = require('express-form2'),
    field = form.field,

    mongoose = require('mongoose'),

    errorHandler = require.main.require('./lib/error-handler'),
    Error404 = require.main.require('./lib/Error404'),
    Helper = require.main.require('./lib/Helper'),
    models = require.main.require('./models');


routes = function () {
    let data = {
        title: 'Episode edit',
        message: 'Episode edit page'
    };
    router
        .route('/')
        .get(function (req, res) {

            if (!req.user) {
                res.redirect(`/series/${req.params.seriesId}/season/${req.params.seasonId}/episode/${req.params.episodeId}`);
                return;
            }

            let Episode = require('./Episode');

            Episode.getEpisodeQuery(req)
                .then(function (episode) {
                    data.user = req.user;
                    data._csrf = res.locals._csrf;
                    data.errors = {};
                    data.series = { _id: req.params.seriesId };
                    data.season = { _id: req.params.seasonId };
                    data.form = episode;

                    // TODO: get rid after json api enabled
                    data.form.method = 'PUT';
                    // data.message = data.series.name + ' ' + data.season.name + ' ' + data.message;

                    // res.json({ data: episode });
                    res.render('series/season/episode/add', data)
                })
                .catch(function(err) {
                    errorHandler(err, res);
                });

        })
        .put(
            form(
                field('number').isNumeric('number should be numeric').required(),
                field('name').trim().required(),
                field('description'),
                field('poster').isUrl('poster should be an url'),
                field('year').isNumeric('year should be numeric'),//.min(1900, 'year should be greater than 1900').max(2100, 'year should be less than 2100')
                field('isWatched'),
                field('time')
            ),
            function(req, res) {


        });
    return router;
};

module.exports = routes();