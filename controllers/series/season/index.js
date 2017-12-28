let express = require('express'),
    router = express.Router({mergeParams: true}),

    EpisodeRoute = require('./episode');

routes = function () {
    let Season = require('./Season');

    // TODO: 404 page for not present put/post and so on
    router
        .route('/')
        .get(Season.getSeasons)
        .post(Season.addSeason);

    //TODO: get rid when json api is enabled
    router.use('/add', Season.addSeasonRoute());

    router
        .route('/:seasonId')
        .get(Season.getSeason.bind(Season))
        .put(Season.editSeason);

    //TODO: get rid when json api is enabled
    router.use('/:seasonId/edit', Season.editSeasonRoute());

    router.use('/:seasonId/episode', EpisodeRoute);

    return router;
};

module.exports = routes();
