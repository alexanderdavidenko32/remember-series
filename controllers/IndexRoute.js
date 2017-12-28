module.exports = function (req, res) {
    let data = {
        title: 'Hello',
        message: 'Index page',
        user: req.user
    };
    //console.log(req.session.id, req.session.user);
    res.render('index', data);
};
