/**
 * Created by Alexander Davidenko
 * @date 12/26/17.
 */
var express = require('express'),
    router = express.Router({mergeParams: true}),

    form = require('express-form2'),
    field = form.field,

    mongoose = require('mongoose'),

    errorHandler = require('../../../../lib/error-handler'),
    Error404 = require('../../../../lib/Error404'),
    Helper = require('../../../../lib/Helper'),
    models = require('../../../../models');

routes = function () {
    var data = {
        title: 'Episode edit',
        message: 'Episode edit page'
    };
    router
        .route('/')
        .get(function (req, res) {

            if (!req.user) {
                res.redirect(`/series/${req.params.seriesId}/season/${req.params.seasonId}/episode/${req.params.episodeId}`);
            } else {
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
                        data.form.mode = `${data.form._id}/edit`;
                        // data.message = data.series.name + ' ' + data.season.name + ' ' + data.message;

                        // res.json({ data: episode });
                        res.render('series/season/episode/add', data)
                    })
                    .catch(function(err) {
                        errorHandler(err, res);
                    });

            }
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

                if (!req.user) {
                    res.redirect(`/series/${req.params.seriesId}/season/${req.params.seasonId}/episode`);
                } else if (!req.form.isValid) {
                    data.errors = req.form.getErrors();
                    data.form = req.form;
                    data.series = {_id: req.params.seriesId};
                    data.season = {_id: req.params.seasonId};

                    res.render('series/season/episode/add', data);
                } else {
                    let seriesId = req.params.seriesId,
                        seasonId = req.params.seasonId,
                        episodeId = req.params.episodeId;

                    data.errors = {};
                    data.series = {_id: seriesId};
                    data.season = {_id: seasonId};
                    data.form = req.form;

                    models.series
                        .findOne({
                            _id: seriesId,
                            $or: Helper.getCreatorCondition('creator', req)
                        })
                        .then(function (series) {
                            let season = series.seasons.id(seasonId);

                            if (!season || !Helper.checkAccessToObject(season, req.user._id)) {
                                throw new Error404('wrong season id');
                            }

                            let episode = season.episodes.id(episodeId);

                            if (!episode || !Helper.checkAccessToObject(episode, req.user._id)) {
                                throw new Error404('wrong episode id');
                            }

                            episode.set({
                                name: req.form.name,
                                description: req.form.description,
                                poster: req.form.poster,
                                year: req.form.year,
                            });

                            let progress = episode.progress.id(Helper.getUserId(req));

                            if (!progress) {
                                episode.progress.push(new models.progress({
                                    _id: req.user._id,
                                    isWatched: !!req.form.isWatched,
                                    time: req.form.time || 0
                                }));
                            } else {
                                progress.set({
                                    isWatched: !!req.form.isWatched,
                                    time: req.form.time || progress.time
                                })
                            }

                            series.save();
                        })
                        .then(function () {
                            res.redirect(`/series/${seriesId}/season/${seasonId}/episode/${episodeId}`);
                        })
                        .catch(function(err) {
                            errorHandler(err, res);
                        });
                }

        });
    return router;
};

module.exports = routes();