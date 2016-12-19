'use strict';
module.exports = function(sequelize, DataTypes) {
  var Person = sequelize.define('Person', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    // height: DataTypes.INTEGER,
    height: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    email: DataTypes.STRING,
    additional_data: DataTypes.TEXT,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // Task.belongsTo(models.User);
        Person.hasMany(models.Pet);
      }
    }
  });
  return Person;
};