/* eslint-disable no-param-reassign */
const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tweet.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likeCounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Tweets',
  });
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.user, { foreignKey: 'user', as: 'user' });
  };
  return Tweet;
};
