/**
 * Created by Alexander Davidenko
 * @date 12/28/17.
 */
let models = require.main.require('./models'),
    Helper = require.main.require('./lib/Helper'),
    Error404 = require.main.require('./lib/Error404'),
    errorHandler = require.main.require('./lib/error-handler'),

    // EditSeasonRoute = require('./EditSeasonRoute'),
    mongoose = require('mongoose'),

    data = {
        title: 'Series',
        message: 'Series page'
    };

class Series {
    getSeries(req, res) {
        data.user = req.user;

        let nullProgress = new models.progress({
            _id: Helper.getUserId(req)
        });

        models.series
            .aggregate(
                {
                    $match: {
                        $or: [
                            { 'creator': Helper.getAdminId() },
                            { 'creator': Helper.getUserId(req) }
                        ]
                    }
                },
                {
                    $unwind: { path: '$progress', preserveNullAndEmptyArrays: true }
                },
                {
                    $group: {
                        _id: '$_id',
                        name: { $first: '$name' },
                        description: { $first: '$description' },
                        poster: { $first: '$poster' },
                        year: { $first: '$year' },
                        creator: { $first: '$creator' },
                        progress: {
                            $max: {
                                $cond: {
                                    if: {
                                        $or: [
                                            {
                                                $eq: [ '$progress._id', Helper.getUserId(req) ]
                                            }
                                        ]
                                    },
                                    then: '$progress',
                                    else: nullProgress
                                }
                            }
                        }
                    }
                }
            )
            .then(function(series) {
                data.seriesList = series;
                // res.json({data: series});
                res.render('series/index', data);
            })
    }

    getSingleSeriesQuery(req) {
        let nullProgress = new models.progress({
            _id: Helper.getUserId(req)
        });

        return models.series
            .aggregate(
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.seriesId),
                        $or: [
                            { 'creator': Helper.getAdminId() },
                            { 'creator': Helper.getUserId(req) }
                        ]
                    }
                },
                {
                    $unwind: { path: '$progress', preserveNullAndEmptyArrays: true }
                },
                {
                    $group: {
                        _id: '$_id',
                        name: { $first: '$name' },
                        description: { $first: '$description' },
                        poster: { $first: '$poster' },
                        year: { $first: '$year' },
                        creator: { $first: '$creator' },
                        progress: {
                            $max: {
                                $cond: {
                                    if: {
                                        $or: [
                                            {
                                                $eq: [ '$progress._id', Helper.getUserId(req) ]
                                            }
                                        ]
                                    },
                                    then: '$progress',
                                    else: nullProgress
                                }
                            }
                        }
                    }
                }
                // {
                //     $project: {
                //         _id: 1,
                //         name: 1,
                //         year: 1,
                //         poster: 1,
                //         description: 1,
                //         creator: 1,
                //         seasons: {
                //             $filter:  {
                //                 input: {
                //                    $map: {
                //                        input: '$seasons',
                //                        as: 'season',
                //                        in: {
                //                            _id: '$$season._id',
                //                            name: '$$season.name',
                //                            creator: '$$season.creator',
                //                            year: '$$season.year',
                //                            poster: '$$season.poster',
                //                            description: '$$season.description',
                //                            episodes: {
                //                                $filter: {
                //                                    input: '$$season.episodes',
                //                                    as: 'episode',
                //                                    cond: {
                //                                        $or: [
                //                                            {
                //                                                $eq: [ '$$episode.creator', Helper.getAdminId() ]
                //                                            },
                //                                            {
                //                                                $eq: [ '$$episode.creator', Helper.getUserId(req) ]
                //                                            }
                //                                        ]
                //                                    }
                //                                }
                //                            }
                //                        }
                //                    }
                //                 },
                //                 as: 'seasons',
                //                 cond: {
                //                     $and: [
                //                         {
                //                             $or: [
                //                                 {
                //                                     $eq: [ '$$seasons.creator', Helper.getAdminId() ]
                //                                 },
                //                                 {
                //                                     $eq: [ '$$seasons.creator', Helper.getUserId(req) ]
                //                                 }
                //                             ]
                //                         }
                //                     ]
                //                 }
                //             }
                //         }
                //     }
                // }
            )
            .then(result => {
                let series = result[0];

                if (!series) {
                    throw new Error404('wrong season id');
                }

                return series;
            });
    }

    getSingleSeries(req, res) {
        data.user = req.user;

        if (!mongoose.Types.ObjectId.isValid(req.params.seriesId)) {
            // TODO: refactor
            //console.log('error');
            //throw new Error404('wrong series id');
            res.redirect('/errors/404');
            return;
        }

        this.getSingleSeriesQuery(req)
            .then(function(series) {
                data.series = series;

                // res.json({data: series});
                res.render('series/series', data)
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }

    addSeries(req, res) {
        if (!req.user) {
            res.redirect('/series');
            return;
        }
        // } else if (!req.form.isValid) {
        //     data.errors = req.form.getErrors();
        //     data.form = req.form;
        //     res.render('series/add', data);
        // } else {
        let requestBody = req.body;
        let progress = new models.progress({_id: req.user.id});
        let series = new models.series({
            name: requestBody.name,
            description: requestBody.description,
            poster: requestBody.poster,
            year: requestBody.year,
            creator: req.user._id,
            progress: [progress]
        });

        data.errors = {};

        models.series.create(series)
            .then(function(series) {
                res.redirect('/series/' + series._id);
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }

    editSeries(req, res) {
        if (!req.user) {
            res.redirect(`/series/${req.params.seriesId}`);
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
        let seriesId = req.params.seriesId;

        let requestBody = req.body;

        data.errors = {};
        data.series = {_id: seriesId};
        data.form = requestBody;

        models.series
            .findOne({
                _id: seriesId,
                $or: Helper.getCreatorCondition('creator', req)
            })
            .then(series => {
                if (!series) {
                    throw new Error404('Wrong series Id');
                }

                return series;
            })
            .then(function (series) {

                console.log(series);
                if (Helper.isUsersObject(series, req.user._id)) {
                    series.set({
                        name: requestBody.name,
                        description: requestBody.description,
                        poster: requestBody.poster,
                        year: requestBody.year,
                    });
                }

                let progress = series.progress.id(Helper.getUserId(req));

                if (!progress) {
                    series.progress.push(new models.progress({
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
                res.redirect(`/series/${seriesId}`);
            })
            .catch(function(err) {
                errorHandler(err, res);
            });
    }
}

let series = new Series();

module.exports = series;