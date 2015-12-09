module.exports = function() {
    return function(req, res, next) {
        //console.log('sid', req.cookies);
        //console.log('user', req.session.user);
        next();
    }
};
