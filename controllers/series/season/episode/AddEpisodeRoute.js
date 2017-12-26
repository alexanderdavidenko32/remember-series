var express = require('express'),
    router = express.Router({mergeParams: true}),

    form = require('express-form2'),
    field = form.field,

    mongoose = require('mongoose'),

    errorHandler = require('../../../../lib/error-handler'),
    Helper = require('../../../../lib/Helper'),
    models = require('../../../../models');

routes = function () {
    var data = {
        title: 'Episode add',
        message: 'Episode add page'
    };
    router
        .route('/')
        .get(function (req, res) {

            if (!req.user) {
                res.redirect(`/series/${req.params.seriesId}/season/${req.params.seasonId}/episode`);
            } else {
                data.user = req.user;
                data._csrf = res.locals._csrf;
                data.form = {};
                data.errors = {};
                data.series = {_id: req.params.seriesId};
                data.season = {_id: req.params.seasonId};

                res.render('series/season/episode/add', data);
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
                    res.redirect(`/series/${req.params.seriesId}/season/${req.params.seasonId}/episode`);
                } else if (!req.form.isValid) {
                    data.errors = req.form.getErrors();
                    data.form = req.form;
                    data.series = {_id: req.params.seriesId};
                    data.season = {_id: req.params.seasonId};

                    res.render('series/season/episode/add', data);
                } else {
                    let seriesId = req.params.seriesId,
                        seasonId = req.params.seasonId;

                    let episode = new models.episode({
                        _id: mongoose.Types.ObjectId(),
                        number: req.form.number,
                        name: req.form.name,
                        description: req.form.description,
                        poster: req.form.poster,
                        year: req.form.year,
                        creator: req.user._id
                    });

                    data.errors = {};
                    data.series = {_id: seriesId};
                    data.season = {_id: seasonId};
                    data.form = req.form;

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

        });
    return router;
};

module.exports = routes();
