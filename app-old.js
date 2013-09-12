// Module dependencies
var express   = require('express'),
    http      = require('http'),
    crypto    = require('crypto'),
    mysql     = require('mysql'),

    routes    = require('./src/routes'),
    api       = require('./src/routes/api'),
    // database  = require('./src/database'),
    // models    = require('./src/models.js'),

    app       = module.exports = express();
    Sequelize = require(__dirname + '/node_modules/sequelize/index');

// Initialize ORM
// var sequelize = new Sequelize('angularexpress', 'root', 'password', {
//     host: 'localhost',
//     port: 3306,
//     dialect: 'mysql'
// });

// Import our User model
// var User = sequelize.import(__dirname + "/models/user");

// Automaticaly generates the user table
// User.sync();

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

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'password',
        database : 'angularexpress'
    });

// Optional Database Setup
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

//Generates user specific salt (Prevent Rainbow Table Attacks)
function makesalt()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 15; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// Register, Save user into MySQL
function register(name, pass, fn) {
  if (!module.parent) console.log('registering %s:%s', name, pass);
    var salt = makesalt();
    User
        .build({ username: name, password: hash(pass,salt), salt: salt })
        .save()
        .success(function(user_query) {
            user = new Object();
            user.id = user_query.id;
            user.username = user_query.username;
            user.password = user_query.password;
                return fn(null, user);
        })
}

app.post('/register', function (req, res) {
    console.log("POST: ", req);

    // Cross Domain Communication
    res.header('Access-Control-Allow-Origin', 'http://localhost');
    res.header('Access-Control-Allow-Methods', 'GET, POST');

    connection.query('INSERT INTO users SET ?', req.body,
        function (err, result) {
            if (err) throw err;

            console.log('User added to database with ID: ' + result.insertId);
            res.send('User added to database with ID: ' + result.insertId);
        }
    );
});

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});