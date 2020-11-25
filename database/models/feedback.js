'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Feedback.belongsTo(models.Passenger, {
        foreignKey: 'passengerId',
        onDelete: 'CASCADE'
      })
      Feedback.belongsTo(models.Driver, {
        foreignKey: 'driverId',
        onDelete: 'CASCADE'
      })
      Feedback.belongsTo(models.Ride, {
        foreignKey: 'rideId',
        onDelete: 'CASCADE'
      })
    }
  };
  Feedback.init({
    message: DataTypes.STRING,
    passengerId: DataTypes.INTEGER,
    sender : DataTypes.ENUM('passenger', 'driver'),
    driverId: DataTypes.INTEGER,
    rideId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Feedback',
  });
  return Feedback;
};