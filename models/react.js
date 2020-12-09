const Sequelize = require('sequelize');

module.exports = (db) => {
  const React = db.define(
    'React',
    {
      // attributes
      id: {
        type: Sequelize.NUMBER,
        autoIncrement: true,
        primaryKey: true,
      },
      postId: {
        type: Sequelize.STRING,
        allowNull: false,
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
    { tableName: 'reacts' }
  );
  return React;
};
