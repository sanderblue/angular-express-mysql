
// Render the homepage
exports.index = function(req, res) {
    res.render('index');
};

exports.restricted = function(req, res) {
    // var name = req.params.name;
    console.log("Exports route: ", req.route, res.route, "\n", new Date().getTime(), "\n");

    res.render('restricted');
};