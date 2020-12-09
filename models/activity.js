const Sequelize = require('sequelize');

module.exports = (db) => {
  const Activity = db.define(
    'Activity',
    {
      // attributes
      id: {
        type: Sequelize.NUMBER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.NUMBER,
        allowNull: false,
      },
      postId: {
        type: Sequelize.NUMBER,
        allowNull: true,
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
    { tableName: 'activities' }
  );
  return Activity;
};
