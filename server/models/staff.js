'use strict';
module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define('Staff', {
    role: DataTypes.STRING
  }, {});
  Staff.associate = function(models) {
    // associations can be defined here
  };
  return Staff;
};