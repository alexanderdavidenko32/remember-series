
module.exports = function (router) {
    router.get('/', function (req, res) {
        req.session.destroy(function(err) {
            if (err) console.log(err);

            console.log('session destroyed');
            // TODO: remove session from database, then redirect
            res.redirect('/');
        });
    });
};
