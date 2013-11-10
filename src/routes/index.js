
// Render the homepage
exports.index = function(req, res) {
    if (req.session.user) {
        res.render('index');
    } else {
        res.render('login');
    }
};

exports.restricted = function(req, res) {
    // var name = req.params.name;
    // console.log("Exports route: ", req.route, "\n");

    res.render('restricted');
};