/**
 * Created by Alexander Davidenko
 * @date 11/28/17.
 */
let express = require('express'),
    router = express.Router({mergeParams: true});

routes = function () {
    let Episode = require('./Episode');

    // TODO: 404 page for not present put/post and so on
    router
        .route('/')
        .get(Episode.getEpisodes)
        .post(Episode.addEpisode);

    //TODO: get rid when json api is enabled
    router.use('/add', Episode.addEpisodeRoute());

    router
        .route('/:episodeId')
        .get(Episode.getEpisode.bind(Episode))
        .put(Episode.editEpisode)
        .delete(Episode.deleteEpisode);

    //TODO: get rid when json api is enabled
    router.use('/:episodeId/edit', Episode.editEpisodeRoute());

    return router;
};

module.exports = routes();
