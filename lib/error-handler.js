module.exports = function(err, res) {
    console.log(err);
    res.redirect('/errors/500');
};
