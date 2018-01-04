let express = require('express'),
    router = express.Router(),

    SeasonRoute = require('./season'),
    AddSeriesRoute = require('./AddSeriesRoute'),
    EditSeriesRoute = require('./EditSeriesRoute');

routes = function () {
    let Series = require('./Series');

    router
        .route('/')
        .get(Series.getSeries)
        .post(Series.addSeries);

    //TODO: get rid when json api is enabled
    router.use('/add', AddSeriesRoute);

    router
        .route('/:seriesId')
        .get(Series.getSingleSeries.bind(Series))
        .put(Series.editSeries)
        .delete(Series.deleteSeries);

    //TODO: get rid when json api is enabled
    router.use('/:seriesId/edit', EditSeriesRoute);

    router.use('/:seriesId/season', SeasonRoute);


    return router;
};

module.exports = routes();
