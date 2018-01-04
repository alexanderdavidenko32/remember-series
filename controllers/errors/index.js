/**
 * Created by chrno on 12/19/15.
 */
let express = require('express'),
    router = express.Router({mergeParams: true}),

    Error500Route = require('./Error500Route'),
    Error403Route = require('./Error403Route'),
    Error404Route = require('./Error404Route');

let routes = function () {
    router
        .route('/500')
        .get(Error500Route);

    router
        .route('/403')
        .get(Error403Route);

    router
        .route('/404')
        .get(Error404Route);

    return router;
};

module.exports = routes();