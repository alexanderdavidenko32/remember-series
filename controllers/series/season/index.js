var express = require('express'),
    router = express.Router({mergeParams: true}),

    AddSeasonRoute = require('./AddSeasonRoute'),

    models = require('../../../models'),
    errorHandler = require('../../../lib/error-handler');

routes = function () {
    var data = {
        title: 'Season',
        message: 'Season page',
    };

    router
        .route('/')
        .get(function (req, res) {
            console.log(req.params);

            models.series.findById(req.params.seriesId)
            .then(function(series) {
                data.series = series;
                res.render('series/season/index', data);
            })
        });

    router.use('/add', AddSeasonRoute);

    router
        .route('/:seasonId')
        .get(function(req, res) {

            models.series.findById(req.params.id)
            .then(function(series) {
                data.series = series;
                res.render('series/season/season', data)
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
        });
    return router;
};

module.exports = routes();
