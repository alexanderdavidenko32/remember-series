module.exports = function (req, res) {
    //TODO: replace with following when json api is enabled
    /*res.status(403).json({
        error: {
            code: 403,
            text: 'Forbidden'
        }
    });*/
    res.render('errors/403', {});
};
