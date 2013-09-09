var sequelize = new Sequelize('angularexpress', 'root', 'password', {
    // custom host; default: localhost
    // host: 'my.server.tld',

    // mysql is the default dialect, but you know...
    // for demo purporses we are defining it nevertheless :)
    // so: we want mysql!
    dialect: 'mysql'

    // custom port; default: 3306
    // port: 3000,

    // custom protocol
    // - default: 'tcp'
    // - added in: v1.5.0
    // - postgres only, useful for heroku
    // protocol: null,

    // disable logging; default: console.log
    // logging: false,

    // max concurrent database requests; default: 50
    // maxConcurrentQueries: 100,

    // the sql dialect of the database
    // - default is 'mysql'
    // - currently supported: 'mysql', 'sqlite', 'postgres'
    // dialect: 'mysql',

    // the storage engine for sqlite
    // - default ':memory:'
    // storage: 'path/to/database.sqlite',

    // disable inserting undefined values as NULL
    // - default: false
    // omitNull: true,

    // Specify options, which are used when sequelize.define is called.
    // The following example:
    //   define: {timestamps: false}
    // is basically the same as:
    //   sequelize.define(name, attributes, { timestamps: false })
    // so defining the timestamps for each model will be not necessary
    // Below you can see the possible keys for settings. All of them are explained on this page
    // define: {
    //     underscored: false
    //     freezeTableName: false,
    //     syncOnAssociation: true,
    //     charset: 'utf8',
    //     collate: 'utf8_general_ci',
    //     classMethods: {method1: function() {}},
    //     instanceMethods: {method2: function() {}},
    //     timestamps: true
    // },

    // similiar for sync: you can define this to always force sync for models
    // sync: { force: true },

    // sync after each association (see below). If set to false, you need to sync manually after setting all associations. Default: true
    // syncOnAssociation: true,

    // use pooling in order to reduce db connection overload and to increase speed
    // currently only for mysql and postgresql (since v1.5.0)
    // pool: { maxConnections: 5, maxIdleTime: 30},

    // language is used to determine how to translate words into singular or plural form based on the [lingo project](https://github.com/visionmedia/lingo)
    // options are: en [default], es
    // language: 'en'


    // You can also define a custom function for the logging part. Just pass a function.
    // The first parameter will be the string that is logged.
});

// Callee is the model definition. This allows you to easily map a query
// to a predefined model for sequelizejs e.g:
sequelize.query('SELECT * FROM projects', Projects).success(function(projects){
  console.log(projects) // Each record will now be mapped to the Projects DAO/factory.
});


// Models
var Project = sequelize.define('Project', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT
});

var Task = sequelize.define('Task', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    deadline: Sequelize.DATE
});

// You can also set some options on each column:
var SomeModel = sequelize.define('SomeModel', {
  // instantiating will automatically set the flag to true if not set
  flag: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},

  // default values for dates => current time
  myDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },

  // setting allowNull to false will add NOT NULL to the column, which means an error will be
  // thrown from the DB when the query is executed if the column is null. If you want to check that a value
  // is not null before querying the DB, look at the validations section below.
  title: { type: Sequelize.STRING, allowNull: false},

  // Creating two objects with the same value will throw an error. Currently composite unique
  // keys can only be created 'addIndex' from the migration-section below
  someUnique: {type: Sequelize.STRING, unique: true},
  // Go on reading for further information about primary keys

  identifier: { type: Sequelize.STRING, primaryKey: true},

  // autoIncrement can be used to create auto_incrementing integer columns
  incrementMe: { type: Sequelize.INTEGER, autoIncrement: true }

  // Comments can be specified for each field for MySQL and PG
  hasComment: { type: Sequelize.INTEGER, comment: "I'm a comment!" }
});

// Model Validation Options (pick and choose your validation options)
var ValidateMe = sequelize.define('SomeOtherModel', {
    someothermodel: {
        type: Sequelize.STRING,
        validate: {
            is: ["[a-z]",'i'],        // will only allow letters
            not: ["[a-z]",'i'],       // will not allow letters
            isEmail: true,            // checks for email format (foo@bar.com)
            isUrl: true,              // checks for url format (http://foo.com)
            isIP: true,               // checks for IPv4 (129.89.23.1) or IPv6 format
            isIPv4: true,             // checks for IPv4 (129.89.23.1)
            isIPv6: true,             // checks for IPv6 format
            isAlpha: true,            // will only allow letters
            isAlphanumeric: true      // will only allow alphanumeric characters, so "_abc" will fail
            isNumeric: true           // will only allow numbers
            isInt: true,              // checks for valid integers
            isFloat: true,            // checks for valid floating point numbers
            isDecimal: true,          // checks for any numbers
            isLowercase: true,        // checks for lowercase
            isUppercase: true,        // checks for uppercase
            notNull: true,            // won't allow null
            isNull: true,             // only allows null
            notEmpty: true,           // don't allow empty strings
            equals: 'specific value', // only allow a specific value
            contains: 'foo',          // force specific substrings
            notIn: [['foo', 'bar']],  // check the value is not one of these
            isIn: [['foo', 'bar']],   // check the value is one of these
            notContains: 'bar',       // don't allow specific substrings
            len: [2,10],              // only allow values with length between 2 and 10
            isUUID: 4,                // only allow uuids
            isDate: true,             // only allow date strings
            isAfter: "2011-11-05",    // only allow date strings after a specific date
            isBefore: "2011-11-05",   // only allow date strings before a specific date
            max: 23,                  // only allow values <= 23
            min: 23,                  // only allow values >= 23
            isArray: true,            // only allow arrays
            isCreditCard: true,       // check for valid credit card numbers

            // custom validations are also possible:
            isEven: function(value) {
                if(parseInt(value) % 2 != 0) {
                    throw new Error('Only even values are allowed!')
                    // we also are in the model's context here, so this.otherField
                    // would get the value of otherField if it existed
                }
            }
        }
    }
});

// More explicit validation example of a Pub/Restaurant model
var Pub = sequelize.define('Pub', {
    name: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    latitude: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: { min: -90, max: 90 }
    },
    longitude: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: { min: -180, max: 180 }
    },
}, {
    // Any error messages collected are put in the validation result object alongside
    // the field validation errors, with keys named after the failed validation method's
    // key in the validate option object. Even though there can only be one error message
    // for each model validation method at any one time, it is presented as a single string
    // error in an array, to maximize consistency with the field errors.
    // Note that the structure of validate()'s output is scheduled to change
    // in v2.0 to avoid this awkward situation. In the mean time, an error is
    // issued if a field exists with the same name as a custom model validation.
    validate: {
        bothCoordsOrNone: function() {
            if ((this.latitude === null) === (this.longitude === null)) {
                throw new Error('Require either both latitude and longitude or neither')
            }
        }
    }
});

// When starting a new project you won't have a database structure and using Sequelize
// you won't need to. Just specify your model structures and let the library do the rest.
// Currently supported is the creation and deletion of tables shown below.

// Create the tables:
Project.sync(); // will emit success or failure event
Task.sync(); // will emit success or failure event

// Force the creation!
Project.sync({force: true}); // this will drop the table first and re-create it afterwards

// drop the tables:
Project.drop(); // will emit success or failure event
Task.drop(); // will emit success or failure event

// event handling:
Project.[sync|drop]().success(function() {
  // ok ... everything is nice!
}).error(function(error) {
  // oooh, did you entered wrong database credentials?
});


// Because synchronizing and dropping all of your tables might be a lot of
// lines to write, you can also let Sequelize do the work for you as shown below.

// create all tables... now!
sequelize.sync(); // will emit success or failure

// force it!
sequelize.sync({force: true}); // emit ... nomnomnom

// want to drop 'em all?
sequelize.drop(); // I guess you've got it (emit)

// emit handling:
sequelize.[sync|drop]().success(function() {
  // woot woot
}).error(function(error) {
  // whooops
});


// Of course you can also access the instance's data and generate virtual getters.
var User = sequelize.define('User', { firstname: Sequelize.STRING, lastname: Sequelize.STRING }, {
  instanceMethods: {
    getFullname: function() {
      return [this.firstname, this.lastname].join(' ')
    }
  }
})

// Example:
User.build({ firstname: 'foo', lastname: 'bar' }).getFullname(); // 'foo bar'


// Find - Search for one specific element in the database
// search for known ids
Project.find(123).success(function(project) {
  // project will be an instance of Project and stores the content of the table entry
  // with id 123. if such an entry is not defined you will get null
});

// search for attributes
Project.find({ where: {title: 'aProject'} }).success(function(project) {
  // project will be the first entry of the Projects table with the title 'aProject' || null
});

// since v1.3.0: only select some attributes and rename one
Project.find({
  where: {title: 'aProject'},
  attributes: ['id', ['name', 'title']]
}).success(function(project) {
  // project will be the first entry of the Projects table with the title 'aProject' || null
  // project.title will contain the name of the project
});





