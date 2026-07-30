module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    linkUrl: { type: DataTypes.STRING, allowNull: true },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  return Notification;
};
