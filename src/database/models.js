

// Put this in your server file - e.g. app.js
var Project = sequelize.import(__dirname + '/path/to/models/project');


// The model definition is done in /src/database/models.js (this file)
// As you might notice, the DataTypes are the very same as explained in orm.js model examples
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Project', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT
    });
}
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Pub', {
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