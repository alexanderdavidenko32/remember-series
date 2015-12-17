var models = require('../../models'),
    errorHandler = require('../../lib/error-handler');

module.exports = function (router) {
    router.get('/', function (req, res) {
        var data = {
            title: 'Series',
            message: 'Series page',
            user: req.user
        };

        models.series.find({})
        .then(function(series) {
            data.seriesList = series;
            res.render('series/index', data);
        })
    });
    router.get('/:id', function(req, res) {
        var data = {
            title: 'Series',
            message: 'Series page',
            user: req.user
        };

        models.series.findById(req.params.id)
        .then(function(series) {
            data.series = series;
            res.render('series/series', data)
        })
        .catch(function(err) {
            errorHandler(err, res);
        });
    });
};
