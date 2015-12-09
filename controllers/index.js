module.exports = function (router) {
    router.get('/', function (req, res) {
        var data = {
            title: 'Hello',
            message: 'Index page',
            user: req.session.user
        };
        //console.log(req.session.id, req.session.user);
        res.render('index', data);
    });
};
