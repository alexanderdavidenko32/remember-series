module.exports = function (router) {
    router.get('/', function (req, res) {
        var data = {
            title: 'Hello',
            message: 'Index page',
            session: req.session
        };
        console.log(req.session.id);
        res.render('index', data);
    });
};
