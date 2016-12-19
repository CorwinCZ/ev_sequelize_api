'use strict';
module.exports = function(sequelize, DataTypes) {
  var Pet = sequelize.define('Pet', {
    name: DataTypes.STRING,
    type: DataTypes.ENUM('dog', 'cat', 'fish'),
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // Task.belongsTo(models.User);
        Pet.belongsTo(models.Person);
      }
    }
  });
  return Pet;
};