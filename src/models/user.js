
// User Model
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("User", {
        id: DataTypes.INTEGER,
        username: DataTypes.TEXT,
        password: DataTypes.TEXT,
        salt: DataTypes.TEXT,
    })
}