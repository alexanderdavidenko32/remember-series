module.exports = function (req, res) {
    let data = {
        title: 'Hello',
        message: 'Index page',
        user: req.user
    };

    let models = require.main.require('./models');
    let Helper = require.main.require('./lib/Helper');

    models.series.aggregate(
        {
            $match: {
                $or: [
                    { 'creator': Helper.getAdminId() },
                    { 'creator': Helper.getUserId(req) }
                ]
            }
        },
        // {
        //     $unwind: { path: '$progress', preserveNullAndEmptyArrays: true }
        // },
        {
            $project: {
                _id: 1,
                name: 1,
                year: 1,
                poster: 1,
                description: 1,
                creator: 1,
                progress: {
                    $max: {
                       $filter: {
                           input: '$progress',
                           as: 'progress',
                           cond: {
                               $eq: [ '$$progress._id', Helper.getUserId(req) ]
                           }
                       }
                    }
                },
                seasons: {
                    $filter:  {
                        input: {
                           $map: {
                               input: '$seasons',
                               as: 'season',
                               in: {
                                   _id: '$$season._id',
                                   name: '$$season.name',
                                   creator: '$$season.creator',
                                   year: '$$season.year',
                                   poster: '$$season.poster',
                                   description: '$$season.description',
                                   progress: {
                                       $max: {
                                           $filter: {
                                               input: '$$season.progress',
                                               as: 'progress',
                                               cond: {
                                                   $eq: [ '$$progress._id', Helper.getUserId(req) ]
                                               }
                                           },
                                       }
                                   },
                                   episodes: {
                                       $filter: {
                                           input: {
                                               $map: {
                                                   input: '$$season.episodes',
                                                   as: 'episode',
                                                   in: {
                                                       _id: '$$episode._id',
                                                       name: '$$episode.name',
                                                       creator: '$$episode.creator',
                                                       year: '$$episode.year',
                                                       poster: '$$episode.poster',
                                                       description: '$$episode.description',
                                                       progress: {
                                                           $max: {
                                                               $filter: {
                                                                   input: '$$episode.progress',
                                                                   as: 'progress',
                                                                   cond: {
                                                                       $eq: [ '$$progress._id', Helper.getUserId(req) ]
                                                                   }
                                                               },
                                                           }
                                                       }
                                                   }
                                               }
                                           },
                                           as: 'episode',
                                           cond: {
                                               $and: [
                                                   {
                                                       $ne: ['$$episode.progress', null]
                                                   },
                                                   {
                                                        $or: [
                                                            {
                                                               $eq: [ '$$episode.creator', Helper.getAdminId() ]
                                                            },
                                                            {
                                                                $eq: [ '$$episode.creator', Helper.getUserId(req) ]
                                                            }
                                                       ]
                                                   }
                                               ]
                                           }
                                       }
                                   }
                               }
                           }
                        },
                        as: 'seasons',
                        cond: {
                            $and: [
                                {
                                    $or: [
                                        {
                                            $eq: [ '$$seasons.creator', Helper.getAdminId() ]
                                        },
                                        {
                                            $eq: [ '$$seasons.creator', Helper.getUserId(req) ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $match: {
                $or: [
                    {'progress': {$exists: true, $ne:null}},
                    {'seasons.progress': {$exists: true, $ne:null}},
                    {'seasons.episodes.progress': {$exists: true, $ne:null}}
                ]
            }
        }
    ).then((series) => {
        data.seriesList = series;
        // res.json(series);
        res.render('index', data);
    });
};
