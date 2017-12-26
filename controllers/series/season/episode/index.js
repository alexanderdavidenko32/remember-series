/**
 * Created by Alexander Davidenko
 * @date 11/28/17.
 */
var express = require('express'),
    router = express.Router({mergeParams: true}),

    episodeRouter = require('./Episode');

routes = function () {
    router
        .route('/')
        .get(episodeRouter.getEpisodes);

    router.use('/add', episodeRouter.addEpisodeRoute());
    // todo: edit route
    // router.use('/edit', episodeRouter.addEpisodeRoute());

    router
        .route('/:episodeId')
        .get(episodeRouter.getEpisode);

    return router;
};

module.exports = routes();
