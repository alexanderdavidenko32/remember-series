module.exports = function (router) {
    router.get('/', function (req, res) {
        var data = {
        };
        res.render('errors/500', data);
    });
};
