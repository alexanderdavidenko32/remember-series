var express = require('express'),
    router = express.Router({mergeParams: true}),
    mongoose = require('mongoose'),

    form = require('express-form2'),
    field = form.field,

    errorHandler = require('../../../lib/error-handler'),
    Helper = require('../../../lib/Helper'),
    models = require('../../../models');

routes = function () {
    var data = {
        title: 'Season add',
        message: 'Season add page'
    };
    router
        .route('/')
        .get(function (req, res) {

            if (!req.user) {
                res.redirect('/series/' + req.params.seriesId +  '/season');
            } else {
                data.user = req.user;
                data._csrf = res.locals._csrf;
                data.form = {};
                data.errors = {};
                data.series = {_id: req.params.seriesId};

                res.render('series/season/add', data);
            }
        })
        .post(
            form(
                field('number').isNumeric('number should be numeric').required(),
                field('name').trim().required(),
                field('description'),
                field('poster').isUrl('poster should be an url'),
                field('year').isNumeric('year should be numeric')//.min(1900, 'year should be greater than 1900').max(2100, 'year should be less than 2100')
            ),
            function(req, res) {

                if (!req.user) {
                    res.redirect('/series/' + req.params.seriesId + '/season');
                } else if (!req.form.isValid) {
                    data.errors = req.form.getErrors();
                    data.form = req.form;
                    data.series = {_id: req.params.seriesId};

                    res.render('series/season/add', data);
                } else {
                    var seriesId = req.params.seriesId,
                        season = {
                            number: req.form.number,
                            name: req.form.name,
                            description: req.form.description,
                            poster: req.form.poster,
                            year: req.form.year,
                            creator: req.user._id
                        };

                    data.errors = {};
                    data.series = {_id: seriesId};
                    data.form = req.form;

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

        });
    return router;
};

module.exports = routes();
