'use strict';
module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    headOfDepartmentId: DataTypes.UUID
  }, {});

  Department.associate = function(models) {
    Department.belongsTo(models.Lecturer, {
      as: 'headOfDepartment',
      foreignKey: 'headOfDepartmentId',
    });
  };
  return Department;
};
