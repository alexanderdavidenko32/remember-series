/**
 * Created by Alexander Davidenko
 * @date 12/3/17.
 */

var mongoose = require('mongoose'),
    AddEpisodeRoute = require('./AddEpisodeRoute'),

    models = require('../../../../models'),
    errorHandler = require('../../../../lib/error-handler'),

    baseData = {
        title: 'Episode',
        message: 'Episode page'
    },

    episode;

class Episode {
    getEpisodes(req, res) {
        let data = {...baseData};

        models.series
            .aggregate({
                $unwind: '$seasons'
            },
            {
                $match: {
                    'seasons._id': mongoose.Types.ObjectId(req.params.seasonId)
                }
            })
            .then(function(result) {
                // aggregate always returns array
                data.series = result[0];
                data.season = result[0].seasons;
                data.message = data.series.name + ' ' + data.season.name + ' ' + data.message;

                res.render('series/season/episode/index', data);
            })
    }

    getEpisode(req, res) {
        let data = {...baseData};

        models.series
            .aggregate({
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
                    'seasons.episodes._id': mongoose.Types.ObjectId(req.params.episodeId)
                }
            })
            .then(function (series) {
                let result = series[0];

                if (!result) {
                    //TODO: 404 page
                    throw 'wrong episode id';
                }

                data.series = result;
                data.season = result.seasons;
                data.episode = result.seasons.episodes;
                data.message = data.series.name + ' ' + data.season.name + ' ' + data.message;

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