module.exports =  function (req, res) {
    //TODO: replace with following when json api is enabled
    /*res.status(404).json({
        error: {
            code: 404,
            text: 'Not found'
        }
    });*/
    res.render('errors/404', {});
};
