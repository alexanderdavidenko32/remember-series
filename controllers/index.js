module.exports = function (router) {
    router.get('/', function (req, res) {
        var data = {
            title: 'Hello',
            message: 'Index page'
        };
        res.render('index', data);
    });
};
