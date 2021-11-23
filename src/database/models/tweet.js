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
      Tweet.belongsTo(models.user, { foreignKey: 'userId' });
      Tweet.hasMany(models.comments, { foreignKey: 'tweetId' });
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
    userId: {
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
    modelName: 'Tweet',
  });

  return Tweet;
};
