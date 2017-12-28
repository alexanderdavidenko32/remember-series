/**
 * Created by Alexander Davidenko
 * @date 12/28/17.
 */
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
        title: 'Series edit',
        message: 'Series edit page'
    };


    router
        .route('/')
        .get(function (req, res) {

            if (!req.user) {
                res.redirect('/series/' + req.params.seriesId);
                return;
            }

            let Series = require('./Series');

            Series.getSingleSeriesQuery(req)
                .then((series) => {
                    data.user = req.user;
                    data._csrf = res.locals._csrf;
                    data.form = series;
                    data.errors = {};

                    // TODO: get rid after json api enabled
                    data.form.method = 'PUT';

                    res.render('series/add', data);
                }).catch(function(err) {
                    errorHandler(err, res);
                });
        });

    return router;
};

module.exports = routes();
