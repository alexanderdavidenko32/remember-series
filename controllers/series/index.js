let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),

    SeasonRoute = require('./season'),
    AddSeriesRoute = require('./AddSeriesRoute'),

    models = require.main.require('./models'),
    Helper = require.main.require('./lib/Helper'),
    errorHandler = require.main.require('./lib/error-handler');

routes = function () {
    let data = {
        title: 'Series',
        message: 'Series page'
    };

    router
        .route('/')
        .get(function (req, res) {
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
                        $group: {
                            _id: '$_id',
                            name: {$first: '$name'},
                            description: {$first: '$description'},
                            poster: {$first: '$poster'},
                            year: {$first: '$year'},
                            creator: {$first: '$creator'},
                            progress: {
                                $max: {
                                    $cond: {
                                        if: {
                                            $or: [
                                                {
                                                    $eq: ['$progress._id', Helper.getUserId(req)]
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
                    // res.json({data: series})
                    res.render('series/index', data);
                })
        });

    router.use('/add', AddSeriesRoute);

    router
        .route('/:seriesId')
        .get(function(req, res) {
            data.user = req.user;

            if (!mongoose.Types.ObjectId.isValid(req.params.seriesId)) {
                // TODO: refactor
                //console.log('error');
                //throw new Error404('wrong series id');
                res.redirect('/errors/404');
                return;
            }

            let nullProgress = new models.progress({
                _id: Helper.getUserId(req)
            });

            models.series
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
                        $group: {
                            _id: '$_id',
                            name: {$first: '$name'},
                            description: {$first: '$description'},
                            poster: {$first: '$poster'},
                            year: {$first: '$year'},
                            creator: {$first: '$creator'},
                            progress: {
                                $max: {
                                    $cond: {
                                        if: {
                                            $or: [
                                                {
                                                    $eq: ['$progress._id', Helper.getUserId(req)]
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
                .then(function(series) {
                    data.series = series[0];

                    // res.json({data: series[0]});
                    res.render('series/series', data)
                })
                .catch(function(err) {
                    errorHandler(err, res);
                });
        });

    router.use('/:seriesId/season', SeasonRoute);


    return router;
};
module.exports = routes();
