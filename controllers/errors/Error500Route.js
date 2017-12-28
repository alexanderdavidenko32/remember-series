module.exports = function (req, res) {
    //TODO: replace with following when json api is enabled
    /*res.status(500).json({
        error: {
            code: 500,
            text: 'Server error'
        }
    });*/
    res.render('errors/500', {});
};
