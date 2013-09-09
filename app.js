

// Module dependencies
var express   = require('express'),
    http      = require('http'),
    crypto    = require('crypto'),

    routes    = require('./src/routes'),
    // database  = require('./src/database'),
    api       = require('./src/routes/api'),
    // models    = require('./src/models.js'),
    app       = express();

// Configuration
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: false
    });
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'somethingkindofridiculousthatmakesnosenseatallexceptonlytoyou' }));
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// var connection = mysql.createConnection({
//         host     : 'localhost',
//         user     : 'root',
//         password : 'password',
//         database : 'angularexpress'
//     });

// var app = module.exports = express.createServer();

// Database setup

// connection.query('CREATE DATABASE IF NOT EXISTS test', function (err) {
//     if (err) throw err;
//     connection.query('USE test', function (err) {
//         if (err) throw err;
//         connection.query('CREATE TABLE IF NOT EXISTS users('
//             + 'id INT NOT NULL AUTO_INCREMENT,'
//             + 'PRIMARY KEY(id),'
//             + 'name VARCHAR(60)'
//             +  ')', function (err) {
//                 if (err) throw err;
//             });
//     });
// });


// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/posts', api.posts);
app.get('/api/post/:id', api.post);
app.post('/api/post', api.addPost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server
// app.listen(3000, function(){
//     console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
// });

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});