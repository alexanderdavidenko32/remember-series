/**
 * Created by Alexander Davidenko
 * @date 12/3/17.
 */

let mongoose = require('mongoose'),
    AddEpisodeRoute = require('./AddEpisodeRoute'),
    EditEpisodeRoute = require('./EditEpisodeRoute'),

    models = require.main.require('./models'),
    Error403 = require.main.require('./lib/Error403'),
    Error404 = require.main.require('./lib/Error404'),
    errorHandler = require.main.require('./lib/error-handler'),
    Helper = require.main.require('./lib/Helper'),

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

                let nullProgress = new models.progress({
                    _id: Helper.getUserId(req)
                });

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
                            $unwind: { path: '$seasons.episodes', preserveNullAndEmptyArrays: true }
                        },
                        {
                            $unwind: { path: '$seasons.episodes.progress', preserveNullAndEmptyArrays: true }
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
                            $match: {
                                $or: Helper.getCreatorCondition('seasons.episodes.creator', req)
                            }
                        },
                        {
                            $group: {
                                _id: '$seasons.episodes._id',
                                number: { $first: '$seasons.episodes.number' },
                                name: { $first: '$seasons.episodes.name' },
                                description: { $first: '$seasons.episodes.description' },
                                poster: { $first: '$seasons.episodes.poster' },
                                creator: { $first: '$seasons.episodes.creator' },
                                progress: {
                                    $max: {
                                        $cond: {
                                            if: {
                                                $or: [
                                                    {
                                                        $eq: [ '$seasons.episodes.progress._id', Helper.getUserId(req) ]
                                                    }
                                                ]
                                            },
                                            then: '$seasons.episodes.progress',
                                            else: nullProgress
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                number: 1,
                                name: 1,
                                description: 1,
                                poster: 1,
                                creator: 1,
                                progress: 1
                            }
                        }
                    )
                    .then(function(result) {
                        // aggregate always returns array
                        data.series = {_id: req.params.seriesId};
                        data.season = {_id: req.params.seasonId};
                        data.episodes = result;
                        //data.message = data.series.name + ' ' + data.season.name + ' ' + data.message;

                        // res.json({data: result});
                        res.render('series/season/episode/index', data);
                    })
            }).catch(function(err) {
                errorHandler(err, res);
            });

    }

    getEpisodeQuery(req) {
        let nullProgress = new models.progress({
            _id: Helper.getUserId(req)
        });

        return models.series
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
                    $unwind: '$seasons.episodes'
                },
                {
                    $unwind: { path: '$seasons.episodes.progress', preserveNullAndEmptyArrays: true }
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
                    $match: {
                        $or: Helper.getCreatorCondition('seasons.episodes.creator', req)
                    }
                },
                {
                    $group: {
                        _id: '$seasons.episodes._id',
                        name: { $first: '$seasons.episodes.name' },
                        number: {$first: '$seasons.episodes.number' },
                        description: { $first: '$seasons.episodes.description' },
                        poster: { $first: '$seasons.episodes.poster' },
                        creator: { $first: '$seasons.episodes.creator' },
                        progress: {
                            $max: {
                                $cond: {
                                    if: {
                                        $or: [
                                            {
                                                $eq: [ '$seasons.episodes.progress._id', Helper.getUserId(req) ]
                                            }
                                        ]
                                    },
                                    then: '$seasons.episodes.progress',
                                    else: nullProgress
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        number: 1,
                        description: 1,
                        poster: 1,
                        creator: 1,
                        progress: 1
                    }
                }
            )
            .then(function(result) {
                let episode = result[0];

                if (!episode) {
                    throw new Error404('wrong episode id');
                }

                return episode;
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

        this.getEpisodeQuery(req)
            .then(function (episode) {
                data._csrf = res.locals._csrf;
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

    addEpisode(req, res) {
        if (!req.user) {
            res.redirect(`/series/${req.params.seriesId}/season/${req.params.seasonId}/episode`);
            return;
        }
        // } else if (!req.form.isValid) {
        //     data.errors = req.form.getErrors();
        //     data.form = req.form;
        //     data.series = {_id: req.params.seriesId};
        //     data.season = {_id: req.params.seasonId};
        //
        //     res.render('series/season/episode/add', data);
        // } else {
        let data = {};
        let requestBody = req.body;

        let seriesId = req.params.seriesId,
            seasonId = req.params.seasonId;

        let progress = new models.progress({_id: req.user._id});
        let episode = new models.episode({
            _id: mongoose.Types.ObjectId(),
            number: requestBody.number,
            name: requestBody.name,
            description: requestBody.description,
            poster: requestBody.poster,
            year: requestBody.year,
            creator: req.user._id,
            progress: [progress]
        });

        data.errors = {};
        data.series = { _id: seriesId };
        data.season = { _id: seasonId };
        data.form = requestBody;

        models.series
            .update(
                {
                    _id: seriesId,
                    $or: Helper.getCreatorCondition('creator', req),
                    $and: [
                        {
                            $or: Helper.getCreatorCondition('seasons.creator', req)
                        }
                    ],
                    'seasons._id': seasonId
                },
                {
                    $push: {
                        'seasons.$.episodes': episode
                    }
                }
            )
            .then(function (series) {
                res.redirect(`/series/${seriesId}/season/${seasonId}/episode/${episode._id.toString()}`);
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }

    editEpisode(req, res) {
        if (!req.user) {
            res.redirect(`/series/${req.params.seriesId}/season/${req.params.seasonId}/episode/${req.params.episodeId}`);
            return;
        }
        // } else if (!req.form.isValid) {
        //     data.errors = req.form.getErrors();
        //     data.form = req.form;
        //     data.series = {_id: req.params.seriesId};
        //     data.season = {_id: req.params.seasonId};
        //
        //     res.render('series/season/episode/add', data);
        // } else {
        let data = {};
        let requestBody = req.body;
        let seriesId = req.params.seriesId,
            seasonId = req.params.seasonId,
            episodeId = req.params.episodeId;

        data.errors = {};
        data.series = {_id: seriesId};
        data.season = {_id: seasonId};
        data.form = requestBody;

        models.series
            .findOne({
                _id: seriesId,
                $or: Helper.getCreatorCondition('creator', req)
            })
            .then(function (series) {
                let season = series.seasons.id(seasonId);

                if (!season || !Helper.checkAccessToObject(season, req.user._id)) {
                    throw new Error404('wrong season id');
                }

                let episode = season.episodes.id(episodeId);

                if (!episode || !Helper.checkAccessToObject(episode, req.user._id)) {
                    throw new Error404('wrong episode id');
                }

                if (Helper.isUsersObject(episode, req.user._id)) {
                    episode.set({
                        name: requestBody.name,
                        description: requestBody.description,
                        poster: requestBody.poster,
                        year: requestBody.year,
                    });
                }

                let progress = episode.progress.id(Helper.getUserId(req));

                if (!progress) {
                    episode.progress.push(new models.progress({
                        _id: req.user._id,
                        isWatched: !!requestBody.isWatched,
                        time: requestBody.time || 0
                    }));
                } else {
                    progress.set({
                        isWatched: !!requestBody.isWatched,
                        time: requestBody.time || progress.time
                    })
                }

                series.save();
            })
            .then(function () {
                res.redirect(`/series/${seriesId}/season/${seasonId}/episode/${episodeId}`);
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }

    deleteEpisode(req, res) {
        let seriesId = req.params.seriesId,
            seasonId = req.params.seasonId,
            episodeId = req.params.episodeId;

        if (!req.user) {
            res.redirect(`/series/${seriesId}/season/${seasonId}/episode/${episodeId}`);
            // res.status(401).end();
            return;
        }

        models.series
            .findOne({
                _id: seriesId,
                $or: Helper.getCreatorCondition('creator', req)
            })
            .then(function (series) {
                let season = series.seasons.id(seasonId);

                if (!season || !Helper.checkAccessToObject(season, req.user._id)) {
                    throw new Error404('wrong season id');
                }

                let episode = season.episodes.id(episodeId);

                if (Helper.isUsersObject(episode, req.user._id)) {
                    episode.remove();

                    series.save();
                } else {
                    throw new Error403('Forbidden');
                }

            })
            .then(function () {
                res.redirect(`/series/${seriesId}/season/${seasonId}/episode`);
                // res.end();
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }

    addEpisodeRoute() {
        return AddEpisodeRoute;
    }

    editEpisodeRoute() {
        return EditEpisodeRoute;
    }
}

episode = new Episode();

module.exports = episode;