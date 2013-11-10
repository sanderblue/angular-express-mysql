// Initialize ORM
var sequelize = new Sequelize('angularexpress', 'root', 'password', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

var User = sequelize.import(__dirname + './src/database/models/user');
User.sync();