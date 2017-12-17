/**
 * Created by Alexander Davidenko
 * @date 12/3/17.
 */

var mongoose = require('mongoose'),
    AddEpisodeRoute = require('./AddEpisodeRoute'),

    models = require('../../../../models'),
    Error404 = require('../../../../lib/Error404'),
    errorHandler = require('../../../../lib/error-handler'),
    Helper = require('../../../../lib/Helper'),

    baseData = {
        title: 'Episode',
        message: 'Episode page'
    },

    episode;

class Episode {
    getEpisodes(req, res) {
        let data = {...baseData};

        if (!mongoose.Types.ObjectId.isValid(req.params.seriesId)) {
            // TODO: refactor
            res.redirect('/errors/404');
            return;
            //throw new Error404('wrong series id');
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.seasonId)) {
            // TODO: refactor
            res.redirect('/errors/404');
            return;
            //throw new Error404('wrong season id');
        }

        models.series
            .aggregate(
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.seriesId),
                        $and: [
                            { 'seasons._id': mongoose.Types.ObjectId(req.params.seasonId) }
                        ]
                    }
                }
            )
            .then(function (result) {
                if (!result.length) {
                    throw new Error404('wrong series or season id');
                }

                return models.series
                    .aggregate(
                        {
                            $match: {
                                _id: mongoose.Types.ObjectId(req.params.seriesId)
                            }
                        },
                        {
                            $unwind: { path: '$seasons', preserveNullAndEmptyArrays: true }
                        },
                        {
                            $unwind: { path: '$seasons.episodes' }
                        },
                        {
                            $match: {
                                $or: Helper.getCreatorCondition('seasons.creator', req),
                                $and: [
                                    { 'seasons._id': mongoose.Types.ObjectId(req.params.seasonId) }
                                ]
                            }
                        },
                        {
                            $match: {
                                $or: [
                                    { 'seasons.episodes': { $exists: false } },
                                    { 'seasons.episodes.creator': Helper.getAdminId() },
                                    { 'seasons.episodes.creator': Helper.getUserId(req) }
                                ]
                            }
                        },
                        {
                            $group: {
                                _id: '$seasons.episodes._id',
                                name: {$first: '$seasons.episodes.name'},
                                description: {$first: '$seasons.episodes.description'},
                                poster: {$first: '$seasons.episodes.poster'},
                                creator: {$first: '$seasons.episodes.creator'}
                            }
                        }
                    )
                    .then(function(result) {
                        // aggregate always returns array
                        data.series = {_id: req.params.seriesId};
                        data.season = {_id: req.params.seasonId};
                        data.episodes = result;
                        //data.message = data.series.name + ' ' + data.season.name + ' ' + data.message;

                        //res.json({data: result});
                        res.render('series/season/episode/index', data);
                    })
            }).catch(function(err) {
                errorHandler(err, res);
            });

    }

    getEpisode(req, res) {
        let data = {...baseData};

        if (!mongoose.Types.ObjectId.isValid(req.params.seriesId)) {
            // TODO: refactor
            res.redirect('/errors/404');
            return;
            //throw new Error404('wrong series id');
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.seasonId)) {
            // TODO: refactor
            res.redirect('/errors/404');
            return;
            //throw new Error404('wrong season id');
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.episodeId)) {
            // TODO: refactor
            res.redirect('/errors/404');
            return;
            //throw new Error404('wrong season id');
        }

        models.series
            .aggregate(
                {
                    $match: {
                        $and: [
                            { _id: mongoose.Types.ObjectId(req.params.seriesId) },
                            {
                                $or: Helper.getCreatorCondition('creator', req)
                            }
                        ]
                    }
                },
                {
                    $unwind: '$seasons'
                },
                {
                    $match: {
                        'seasons._id': mongoose.Types.ObjectId(req.params.seasonId)
                    }
                },
                {
                    $unwind: '$seasons.episodes'
                },
                {
                    $match: {
                        $or: Helper.getCreatorCondition('seasons.creator', req),
                        $and: [
                            { 'seasons._id': mongoose.Types.ObjectId(req.params.seasonId) }
                        ]
                    }
                },
                {
                    $match: {
                        $or: Helper.getCreatorCondition('seasons.episodes.creator', req),
                        $and: [
                            { 'seasons.episodes._id': mongoose.Types.ObjectId(req.params.episodeId) }
                        ]
                    }
                },
                {
                    $group: {
                        _id: '$seasons.episodes._id',
                        name: {$first: '$seasons.episodes.name'},
                        number: {$first: '$seasons.episodes.number'},
                        description: {$first: '$seasons.episodes.description'},
                        poster: {$first: '$seasons.episodes.poster'},
                        creator: {$first: '$seasons.episodes.creator'},
                    }
                }
            )
            .then(function(result) {
                let episode = result[0];

                if (!episode) {
                    throw new Error404('wrong episode id');
                }

                return episode;
            })
            .then(function (episode) {
                data.series = { _id: req.params.seriesId };
                data.season = { _id: req.params.seasonId };
                data.episode = episode;
                // data.message = data.series.name + ' ' + data.season.name + ' ' + data.message;

                // res.json({ data: episode });
                res.render('series/season/episode/episode', data)
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }

    addEpisodeRoute() {
        return AddEpisodeRoute;
    }
}

episode = new Episode();

module.exports = episode;