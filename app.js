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


// Initialize ORM
var sequelize = new Sequelize('angularexpress', 'root', 'password', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});


// Import our User model
var User = sequelize.import(__dirname + '/models/user');

// Automaticaly generates the user table
User.sync();
// User.sync({force:true});//Used to update database if model changes (DROPS TABLE FIRST!)


// Session-persisted message middleware
app.locals.use(function(req,res){
    var err = req.session.error,
        msg = req.session.success,
        user = req.session.user;

    delete req.session.error;
    delete req.session.success;

    res.locals.message = '';
    res.locals.user = req.session.user; // Used to allow for easy processing of user session values in templates.
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
});


// Routes
app.get('/', routes.index);
app.get('/restricted', restrict, function(req, res){
    res.render('restricted');
});


// User login in and restriction supports
function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/');
    }
}


// Used to generate a hash of the plain-text password + salt
function hash(msg, key) {
    return crypto
        .createHmac('sha256', key)
        .update(msg)
        .digest('hex');
}

// Authenticate using MySQL
function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);
    var user;
    User.find({
        where: { username: name },
    }).success(function(user_query) {
        if (!user_query) {
            // query the db for the given username
            if (!user) {
                console.log("No User By That Name");
                return fn(new Error('Cannot find user'));
            }
        } else {
            console.log("User Found.");
            user = new Object();
            user.id = user_query.id;
            user.username = user_query.username;
            user.password = user_query.password;
            if (user.password == hash(pass,user_query.salt)) return fn(null, user);
            console.log("Invalid Password.");
            fn(new Error('Invalid password'));
        }
    });
}

app.post('/', function(req, res){
    authenticate(req.body.username, req.body.password, function(err, user){
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function() {
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                res.redirect('back');
            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.';
            res.redirect('login');
        }
    });
});


/*
    User Registration
*/

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

// Register our new user
app.post('/register', function(req, res){
    register(req.body.username, req.body.password, function(err, user){
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function(){
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.error = 'Registration should have succeded.';
                req.session.user = user;
                res.redirect('/restricted');
            });
        } else {
            req.session.error = 'Registration Failed.';
            res.redirect('index');
        }
    });
});


// Start the server
if (!module.parent) {
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });

    // app.listen(3000);
    // console.log('Express started on port 3000');
}
