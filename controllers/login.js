module.exports = function (router) {
    router.get('/', function (req, res) {
        var data = {
            title: 'Login',
            message: 'Login page'
        };
        res.render('login', data);
    });
};
