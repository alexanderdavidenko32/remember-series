var express = require('express'),
    router = express.Router({mergeParams: true}),

    EpisodeRoute = require('./episode'),

    seasonRouter = require('./Season');

routes = function () {

    router
        .route('/')
        .get(seasonRouter.getSeasons);

    router.use('/add', seasonRouter.addSeasonRoute());

    router
        .route('/:seasonId')
        .get(seasonRouter.getSeason);

    router.use('/:seasonId/episode', EpisodeRoute);

    return router;
};

module.exports = routes();
