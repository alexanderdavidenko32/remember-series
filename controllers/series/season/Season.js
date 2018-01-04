/**
 * Created by Alexander Davidenko
 * @date 11/30/17.
 */
let models = require.main.require('./models'),
    Helper = require.main.require('./lib/Helper'),
    Error403 = require.main.require('./lib/Error403'),
    Error404 = require.main.require('./lib/Error404'),
    errorHandler = require.main.require('./lib/error-handler'),

    AddSeasonRoute = require('./AddSeasonRoute'),
    EditSeasonRoute = require('./EditSeasonRoute'),
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
                                'seasons': { $exists: true, $ne: null }
                            }
                        },
                        {
                            $group: {
                                _id: '$seasons._id',
                                name: { $first: '$seasons.name' },
                                number: { $first: '$seasons.number' },
                                description: { $first: '$seasons.description' },
                                poster: { $first: '$seasons.poster' },
                                year: { $first: '$seasons.year' },
                                creator: { $first: '$seasons.creator' },
                                progress: {
                                    $max: {
                                        $cond: {
                                            if: {
                                                $or: [
                                                    {
                                                        $eq: [ '$seasons.progress._id', Helper.getUserId(req) ]
                                                    }
                                                ]
                                            },
                                            then: '$seasons.progress',
                                            else: nullProgress
                                        }
                                    }
                                }
                            }
                        }
                    )
                    .then(function(seasons) {
                        let data = {...baseData};

                        data.seasons = seasons;
                        data.series = {_id: req.params.seriesId};
                        //data.title = data.title;
                        //data.message = data.message;

                        // res.json({data: seasons});
                        res.render('series/season/index', data);
                    })
            }).catch(function(err) {
                errorHandler(err, res);
            });
    }

    getSeasonQuery(req) {
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
                    $unwind: { path: '$seasons.progress', preserveNullAndEmptyArrays: true }
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
                    $group: {
                        _id: '$seasons._id',
                        name: { $first: '$seasons.name' },
                        number: { $first: '$seasons.number' },
                        description: { $first: '$seasons.description' },
                        poster: { $first: '$seasons.poster' },
                        year: { $first: '$seasons.year' },
                        creator: { $first: '$seasons.creator' },
                        progress: {
                            $max: {
                                $cond: {
                                    if: {
                                        $or: [
                                            {
                                                $eq: [ '$seasons.progress._id', Helper.getUserId(req) ]
                                            }
                                        ]
                                    },
                                    then: '$seasons.progress',
                                    else: nullProgress
                                }
                            }
                        }
                    }
                }
            )
            .then(function(result) {
                let series = result[0];

                if (!series) {
                    throw new Error404('wrong season id');
                }

                let season = series.seasons;

                return result[0];
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

        this.getSeasonQuery(req)
            .then(function (result) {
                let data = {...baseData};

                data._csrf = res.locals._csrf;
                data.series = { _id: req.params.seriesId };
                data.season = result;
                //data.message = result.series.name + ' ' + data.message;

                // res.json({data: result});
                res.render('series/season/season', data)
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }

    addSeason(req, res) {

        if (!req.user) {
            res.redirect('/series/' + req.params.seriesId + '/season');
            return;
        }
        // } else if (!req.form.isValid) {
        //     data.errors = req.form.getErrors();
        //     data.form = req.form;
        //     data.series = {_id: req.params.seriesId};
        //
        //     res.render('series/season/add', data);

        let data = {};
        let requestBody = req.body;

        let seriesId = req.params.seriesId;
        let progress = new models.progress({_id: req.user.id});
        let season = new models.season({
            number: requestBody.number,
            name: requestBody.name,
            description: requestBody.description,
            poster: requestBody.poster,
            year: requestBody.year,
            creator: req.user._id,
            progress: [progress]
        });

        data.errors = {};
        data.series = {_id: seriesId};
        data.form = requestBody;

        models.series
            .findOne({
                _id: seriesId,
                $or: Helper.getCreatorCondition('creator', req)
            })
            //.then(function (series) {
                //if (series.length) {
                //    data.errors.seasonExists = 'Season with this number already exist';
                //    res.render('series/season/add', data);
                //    throw data.errors.seasonExists;
                //}
                //return models.series.findById(seriesId);
            //})
            .then(function (series) {
                //console.log(series);
                series.seasons.push(season);
                return series.save();
            })
            .then(function (series) {
                res.redirect('/series/' + series._id + '/season')
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }

    editSeason(req, res) {
        if (!req.user) {
            res.redirect(`/series/${req.params.seriesId}/season/${req.params.seasonId}`);
            return;
        }
        // } else if (!req.form.isValid) {
        //     data.errors = req.form.getErrors();
        //     data.form = req.form;
        //     data.series = {_id: req.params.seriesId};
        //     data.season = {_id: req.params.seasonId};
        //
        //     res.render('series/season/episode/add', data);
        let data = {};
        let seriesId = req.params.seriesId,
            seasonId = req.params.seasonId;

        let requestBody = req.body;

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

                if (Helper.isUsersObject(season, req.user._id)) {
                    season.set({
                        name: requestBody.name,
                        description: requestBody.description,
                        poster: requestBody.poster,
                        year: requestBody.year,
                    });
                }

                let progress = season.progress.id(Helper.getUserId(req));

                if (!progress) {
                    season.progress.push(new models.progress({
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
                res.redirect(`/series/${seriesId}/season/${seasonId}`);
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }

    deleteSeason(req, res) {
        let seriesId = req.params.seriesId,
            seasonId = req.params.seasonId;

        if (!req.user) {
            res.redirect(`/series/${seriesId}/season/${seasonId}`);
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

                if (Helper.isUsersObject(season, req.user._id)) {
                    series.seasons.pull({
                        _id: mongoose.Types.ObjectId(seasonId)
                    });

                    series.save();
                } else {
                    throw new Error403('Forbidden');
                }

            })
            .then(function () {
                res.redirect(`/series/${seriesId}/season`);
                // res.end();
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }

    editSeasonRoute() {
        return EditSeasonRoute;
    }

    addSeasonRoute() {
        return AddSeasonRoute;
    }
}

season = new Season();

module.exports = season;