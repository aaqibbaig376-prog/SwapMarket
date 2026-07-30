module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    contactDetails: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
    averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
    ratingCount: { type: DataTypes.INTEGER, defaultValue: 0 }
  });
  return User;
};
