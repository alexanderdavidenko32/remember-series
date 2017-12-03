/**
 * Created by Alexander Davidenko
 * @date 11/30/17.
 */
var models = require('../../../models'),
    errorHandler = require('../../../lib/error-handler'),
    AddSeasonRoute = require('./AddSeasonRoute'),
    baseData = {
        title: 'Seasons',
        message: 'Seasons page'
    },
    season;

class Season {
    getSeasons (req, res) {
        models.series
            .findById(req.params.seriesId)
            .then(function(series) {
                let data = {...baseData};

                data.series = series;
                data.title = data.title + ' ' + series.name;
                data.message = series.name + ' ' + data.message;

                res.render('series/season/index', data);
            })
    }

    getSeason(req, res) {
        models.series
            .findById(req.params.seriesId)
            .populate('creator')
            .then(function(series) {
                var season = series.seasons.id(req.params.seasonId);
                if (!season) {
                    //TODO: 404 page
                    throw 'wrong season id';
                }
                return {series: series, season: season};
            })
            .then(function (result) {
                let data = {...baseData};

                data.series = result.series;
                data.season = result.season;
                data.message = result.series.name + ' ' + data.message;
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