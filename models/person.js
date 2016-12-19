'use strict';
module.exports = function(sequelize, DataTypes) {
  var Person = sequelize.define('Person', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    height: DataTypes.INTEGER,
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // Task.belongsTo(models.User);
      }
    }
  });
  return Person;
};