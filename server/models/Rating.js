module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    score: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.STRING, allowNull: true }
  });
  return Rating;
};
