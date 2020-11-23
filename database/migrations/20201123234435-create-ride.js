'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Rides', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      departure: {
        type: Sequelize.STRING
      },
      destination: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATEONLY
      },
      time: {
        type: Sequelize.TIME
      },
      seats: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      checkedStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ratedStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      stop1: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      stop2: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      stop3: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      stop4: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      driverId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Drivers',
          key: 'id',
          as: 'driverId',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Rides');
  }
};