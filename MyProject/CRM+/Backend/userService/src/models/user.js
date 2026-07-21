'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: {
      type:DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING, // New email field
      allowNull: true, // Ensure it's required
      unique: true // Ensure unique emails
    },
    password: {
      type: DataTypes.STRING
    },
    token: {
      type: DataTypes.STRING
    },
    expireAt:{
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(async (user)=>{
    console.log('Before Create Hook:', user.password);
    if (!user.password) {
        throw new Error('Password is required');
    }
    const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  });
  return User;
};