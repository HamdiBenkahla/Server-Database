'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RidePassenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  RidePassenger.init({
    rideId: DataTypes.INTEGER,
    passengerId: DataTypes.INTEGER,
    ratedStatus: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'RidePassenger',
  });
  return RidePassenger;
};