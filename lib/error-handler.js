let Error404 = require('./Error404');

module.exports = function(err, res) {
    console.error(err);

    if (err instanceof Error404) {
        res.redirect('/errors/404');

        return;
    }

    res.redirect('/errors/500');
};
