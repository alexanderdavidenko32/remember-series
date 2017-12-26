/**
 * Created by chrno on 12/19/15.
 */
var express = require('express'),
    router = express.Router({mergeParams: true}),
    Error500Route = require('./Error500Route'),
    Error404Route = require('./Error404Route'),
    routes;

routes = function () {
    router
        .route('/500')
        .get(Error500Route);

    router
        .route('/404')
        .get(Error404Route);

    return router;
};

module.exports = routes();