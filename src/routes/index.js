
// Render the homepage

exports.index = function(req, res) {
    if (req.session.user) {
        req.session.success = 'Authenticated as ' + req.session.user.username
        + ' click to <a href="/logout">logout</a>. '
        + ' You may now access <a href="/restricted">/restricted</a>.';
    }
    res.render('index');
};

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};