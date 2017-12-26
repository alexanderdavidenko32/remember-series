/**
 * Created by Alexander Davidenko
 * @date 11/28/17.
 */
var express = require('express'),
    router = express.Router({mergeParams: true});

routes = function () {
    let Episode = require('./Episode');

    router
        .route('/')
        .get(Episode.getEpisodes);

    router.use('/add', Episode.addEpisodeRoute());

    router
        .route('/:episodeId')
        .get(Episode.getEpisode.bind(Episode));

    router.use('/:episodeId/edit', Episode.editEpisodeRoute());

    return router;
};

module.exports = routes();
