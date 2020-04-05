'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lecturer = sequelize.define('Lecturer', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: DataTypes.UUID,
  }, {});

  Lecturer.associate = function(models) {
    Lecturer.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
  };
  return Lecturer;
};
