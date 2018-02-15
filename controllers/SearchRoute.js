/**
 * Created by Alexander Davidenko
 * @date 2/15/18.
 */
let express = require('express'),
    router = express.Router(),

    models = require.main.require('./models'),
    Helper = require.main.require('./lib/Helper');

routes = function () {
    router
        .route('/')
        .get((req, res) => {
            let promise = Promise.resolve();

            if (req.query.name) {
                //TODO: use elasticsearch for partial word search support
                promise = models.series.find({
                    $or: [
                        { 'creator': Helper.getAdminId() },
                        { 'creator': Helper.getUserId(req) }
                    ],
                    $text: {
                        $search: req.query.name
                    }
                });
            }
            
            promise.then((results) => {
                let data = {
                    results: results || [],
                    user: req.user
                };

                res.render('search', data);
            })
        });

    return router;
};

module.exports = routes();