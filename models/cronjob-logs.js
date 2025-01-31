const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
return sequelize.define("CronJobLogs", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    runAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Record the time the cron job started
    },
    successCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Number of successful updates
    },
    failureCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Number of failed updates
    },
    room_ids: {
        type: DataTypes.JSON, // Use JSON to store an array of failed room IDs
        allowNull: true,
      },
}, {
    timestamps: true,
  });
  }
