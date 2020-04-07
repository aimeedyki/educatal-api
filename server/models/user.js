import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: DataTypes.STRING,
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter an email',
      },
      unique: {
        args: true,
        msg: 'Email already exists, please log in or choose a new email',
      },
      validate: {
        isEmail: {
          msg: 'enter a valid email',
        },
      },
    },
    password:{
      type: DataTypes.STRING,
      allowNull: {
        args: true,
        msg: 'Please enter a password'
      }
    },
    lastUpdatedBy: DataTypes.STRING,
    departmentId: DataTypes.UUID,
    role: DataTypes.ENUM('ADMIN', 'LECTURER', 'STUDENT')
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }
  });

  User.associate = function(models) {
    User.belongsTo(models.Department, {
      as: 'department',
      foreignKey: 'departmentId',
    });
  };
  return User;
};
