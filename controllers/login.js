module.exports = function (router) {
    router.get('/', function (req, res) {
        var data = {
            title: 'Login',
            message: 'Login page'
        };
        // TODO: add session to database, then render
        res.render('login', data);
    });
};
