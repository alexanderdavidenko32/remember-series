var express = require('express'),
    router = express.Router({mergeParams: true}),

    form = require('express-form2'),
    field = form.field,

    errorHandler = require('../../../lib/error-handler'),
    models = require('../../../models');

routes = function () {
    var data = {
        title: 'Season add',
        message: 'Season add page'
    };
    router.route('/').get(function (req, res) {

        if (!req.user) {
            res.redirect('/series' + req.params.seriesId +  '/season');
        } else {
            data.user = req.user;
            data._csrf = res.locals._csrf;
            data.form = {};
            data.errors = {};
            res.render('series/season/add', data);
        }
    })
    .post(
        form(
            field('number').isNumeric('number should be numeric').required(),
            field('name').trim().required(),
            field('description'),
            field('poster').isUrl('poster should be an url'),
            field('year').isNumeric('year should be numeric').min(1900).max(2100)
        ),
        function(req, res) {

            if (!req.user) {
                res.redirect('/series/' + req.params.seriesId);
            } else if (!req.form.isValid) {
                data.errors = req.form.getErrors();
                data.form = req.form;
                res.render('series/season/add', data);
            } else {
                var number = req.form.number,
                    name = req.form.name,
                    description = req.form.description,
                    poster = req.form.poster,
                    year = req.form.year;

                data.errors = {};

                //models.series.create({
                    //name: name,
                    //description: description,
                    //poster: poster,
                    //year: year,
                    //creatorId: req.user._id,
                    //seasons: []
                //})
                //.then(function(series) {
                    //res.redirect('/series/' + series._id);
                //})
                //.catch(function(err) {
                    //errorHandler(err, res);
                //});
            }

    });
    return router;
};

module.exports = routes();
