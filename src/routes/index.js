// Render the homepage
exports.index = function(req, res) {
    if (req.session.user) {
        res.render('index');
    } else {
        res.render('login');
    }
};