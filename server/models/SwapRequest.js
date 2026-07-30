module.exports = (sequelize, DataTypes) => {
  const SwapRequest = sequelize.define('SwapRequest', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'), defaultValue: 'pending' },
    location: { type: DataTypes.STRING, allowNull: true },
  });
  return SwapRequest;
};
