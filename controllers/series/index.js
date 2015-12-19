var express = require('express'),
    router = express.Router(),

    SeasonRoute = require('./season'),
    AddSeriesRoute = require('./AddSeriesRoute'),

    models = require('../../models'),
    errorHandler = require('../../lib/error-handler');

routes = function () {
    var data = {
        title: 'Series',
        message: 'Series page',
    };

    router
        .route('/')
        .get(function (req, res) {
            data.user = req.user;

            models.series.find({})
            .then(function(series) {
                data.seriesList = series;
                res.render('series/index', data);
            })
        });

    router.use('/add', AddSeriesRoute);

    router
        .route('/:seriesId')
        .get(function(req, res) {
            data.user = req.user;

            models.series.findById(req.params.seriesId)
            .populate('creator')
            .then(function(series) {
                // TODO: filter series by ownerId (admin or userId)
                data.series = series;
                res.render('series/series', data)
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
        });

    router.use('/:seriesId/season', SeasonRoute);


    return router;
};
module.exports = routes();
