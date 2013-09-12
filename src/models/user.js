
// User Model
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("User", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: DataTypes.TEXT,
        password: DataTypes.TEXT,
        salt: DataTypes.TEXT,
        email: DataTypes.TEXT
    })
}