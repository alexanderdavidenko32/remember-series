var express = require('express'),
    router = express.Router({mergeParams: true}),

    EpisodeRoute = require('./episode');

routes = function () {
    let Season = require('./Season');

    router
        .route('/')
        .get(Season.getSeasons);

    router.use('/add', Season.addSeasonRoute());

    router
        .route('/:seasonId')
        .get(Season.getSeason);

    router.use('/:seasonId/episode', EpisodeRoute);

    return router;
};

module.exports = routes();
