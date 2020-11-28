'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Driver extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Driver.hasOne(models.Car, {
        foreignKey: 'driverId',
      })
      Driver.hasMany(models.Ride, {
        foreignKey: 'driverId',
      })
      Driver.hasMany(models.Feedback, {
        foreignKey: 'driverId',
      })
    }
  };
  Driver.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    ICN: DataTypes.INTEGER,
    driverLicense: DataTypes.INTEGER,
    timesRated: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Driver',
  });
  return Driver;
};

