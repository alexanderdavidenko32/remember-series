/**
 * Created by Alexander Davidenko
 * @date 11/30/17.
 */
var models = require('../../../models'),
    Helper = require('../../../lib/Helper'),
    Error404 = require('../../../lib/Error404'),
    errorHandler = require('../../../lib/error-handler'),

    AddSeasonRoute = require('./AddSeasonRoute'),
    mongoose = require('mongoose'),

    baseData = {
        title: 'Seasons',
        message: 'Seasons page'
    },
    season;

class Season {
    getSeasons (req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.seriesId)) {
            // TODO: refactor
            res.redirect('/errors/404');
            return;
            //throw new Error404('wrong series id');
        }

        // check if series exists
        models.series
            .findOne(
                {
                    _id: mongoose.Types.ObjectId(req.params.seriesId),
                    $or: [
                        { creator : Helper.getAdminId() },
                        { creator: Helper.getUserId(req) }
                    ]
                }
            )
            .then(function (result) {
                if (!result) {
                    throw new Error404('wrong series id');
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
                            $unwind: { path: '$seasons.episodes', preserveNullAndEmptyArrays: true }
                        },
                        {
                            $match: {
                                $or:[
                                    { 'seasons': { $exists: false } },
                                    { 'seasons.creator': Helper.getAdminId() },
                                    { 'seasons.creator': Helper.getUserId(req) }
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
                                'seasons': { $exists: true, $ne: null }
                            }
                        },
                        {
                            $group: {
                                _id: '$seasons._id',
                                name: {$first: '$seasons.name'},
                                number: {$first: '$seasons.number'},
                                description: {$first: '$seasons.description'},
                                poster: {$first: '$seasons.poster'},
                                year: {$first: '$seasons.year'},
                                creator: {$first: '$seasons.creator'},
                                episodes: {$push: '$seasons.episodes'}
                            }
                        }
                    )
                    .then(function(seasons) {
                        let data = {...baseData};

                        data.seasons = seasons;
                        data.series = {_id: req.params.seriesId};
                        //data.title = data.title;
                        //data.message = data.message;

                        //res.json({data: seasons});
                        res.render('series/season/index', data);
                    })
            }).catch(function(err) {
                errorHandler(err, res);
            });
    }

    getSeason(req, res) {
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
                        $and: [
                            { _id: mongoose.Types.ObjectId(req.params.seriesId) },
                            {
                                $or: [
                                    { 'creator': Helper.getAdminId() },
                                    { 'creator': Helper.getUserId(req) }
                                ]
                            }
                        ]
                    }
                },
                {
                    $unwind: { path: '$seasons', preserveNullAndEmptyArrays: true }
                },
                {
                    $unwind: { path: '$seasons.episodes', preserveNullAndEmptyArrays: true }
                },
                {
                    $match: {
                        $or:[
                            { 'seasons.creator': Helper.getAdminId() },
                            { 'seasons.creator': Helper.getUserId(req) }
                        ],
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
                        _id: '$seasons._id',
                        name: {$first: '$seasons.name'},
                        number: {$first: '$seasons.number'},
                        description: {$first: '$seasons.description'},
                        poster: {$first: '$seasons.poster'},
                        year: {$first: '$seasons.year'},
                        creator: {$first: '$seasons.creator'},
                        episodes: {$push: '$seasons.episodes'}
                    }
                    // TODO: progress
                }
            )
                   //.populate('creator')
            .then(function(result) {
                let series = result[0];

                if (!series) {
                    throw new Error404('wrong season id');
                }

                let season = series.seasons;

                return result[0];
            })
            .then(function (result) {
                let data = {...baseData};

                data.series = {_id: req.params.seriesId};
                data.season = result;
                //data.message = result.series.name + ' ' + data.message;
                //res.json({data: result});
                res.render('series/season/season', data)
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }

    addSeasonRoute() {
        return AddSeasonRoute;
    }
}

season = new Season();

module.exports = season;