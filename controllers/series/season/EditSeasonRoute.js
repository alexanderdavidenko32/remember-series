//TODO: get rid when json api is enabled
let express = require('express'),
    router = express.Router({mergeParams: true}),
    mongoose = require('mongoose'),

    form = require('express-form2'),
    field = form.field,

    errorHandler = require.main.require('./lib/error-handler'),
    Helper = require.main.require('./lib/Helper'),
    models = require.main.require('./models');

routes = function () {
    let data = {
        title: 'Season edit',
        message: 'Season edit page'
    };


    router
        .route('/')
        .get(function (req, res) {

            if (!req.user) {
                res.redirect('/series/' + req.params.seriesId +  '/season');
                return;
            }

            let Season = require('./Season');

            Season.getSeasonQuery(req)
                .then((season) => {
                    data.user = req.user;
                    data._csrf = res.locals._csrf;
                    data.form = season;
                    data.errors = {};
                    data.series = {_id: req.params.seriesId};

                    // TODO: get rid after json api enabled
                    data.form.method = 'PUT';

                    res.render('series/season/add', data);
                }).catch(function(err) {
                    errorHandler(err, res);
                });
        });

    return router;
};

module.exports = routes();
