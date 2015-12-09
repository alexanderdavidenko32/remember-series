module.exports = function(req, err) {
    console.log(err);
    req.redirect('/errors/500');
};
