const Sequelize = require('sequelize');

module.exports = (db) => {
  const Activity = db.define(
    'Activity',
    {
      // attributes
      id: {
        type: Sequelize.NUMBER,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {}
  );
  return Activity;
};