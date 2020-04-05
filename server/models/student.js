'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    registrationNumber: DataTypes.STRING,
    studentType: DataTypes.ENUM('M.Sc.', 'Ph.D.'),
    entryYear: DataTypes.STRING,
    userId: DataTypes.UUID,
  }, {});

  Student.associate = function (models) {
    Student.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });
  };
  return Student;
};
