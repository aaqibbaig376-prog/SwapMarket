const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
});

const db = {
  sequelize,
  Sequelize,
};

db.User = require('./User')(sequelize, Sequelize);
db.Item = require('./Item')(sequelize, Sequelize);
db.SwapRequest = require('./SwapRequest')(sequelize, Sequelize);
db.Message = require('./Message')(sequelize, Sequelize);
db.Rating = require('./Rating')(sequelize, Sequelize);
db.Favorite = require('./Favorite')(sequelize, Sequelize);
db.Notification = require('./Notification')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Item, { foreignKey: 'ownerId', as: 'items' });
db.Item.belongsTo(db.User, { foreignKey: 'ownerId', as: 'owner' });

db.User.hasMany(db.SwapRequest, { foreignKey: 'requesterId', as: 'sentRequests' });
db.User.hasMany(db.SwapRequest, { foreignKey: 'receiverId', as: 'receivedRequests' });
db.SwapRequest.belongsTo(db.User, { foreignKey: 'requesterId', as: 'requester' });
db.SwapRequest.belongsTo(db.User, { foreignKey: 'receiverId', as: 'receiver' });

db.Item.hasMany(db.SwapRequest, { foreignKey: 'offeredItemId', as: 'offeredInRequests' });
db.Item.hasMany(db.SwapRequest, { foreignKey: 'requestedItemId', as: 'requestedInRequests' });
db.SwapRequest.belongsTo(db.Item, { foreignKey: 'offeredItemId', as: 'offeredItem' });
db.SwapRequest.belongsTo(db.Item, { foreignKey: 'requestedItemId', as: 'requestedItem' });

db.SwapRequest.hasMany(db.Message, { foreignKey: 'swapRequestId', as: 'messages' });
db.Message.belongsTo(db.SwapRequest, { foreignKey: 'swapRequestId', as: 'swapRequest' });

db.User.hasMany(db.Message, { foreignKey: 'senderId', as: 'sentMessages' });
db.User.hasMany(db.Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
db.Message.belongsTo(db.User, { foreignKey: 'senderId', as: 'sender' });
db.Message.belongsTo(db.User, { foreignKey: 'receiverId', as: 'receiver' });

// Ratings
db.User.hasMany(db.Rating, { foreignKey: 'revieweeId', as: 'receivedRatings' });
db.User.hasMany(db.Rating, { foreignKey: 'reviewerId', as: 'givenRatings' });
db.Rating.belongsTo(db.User, { foreignKey: 'revieweeId', as: 'reviewee' });
db.Rating.belongsTo(db.User, { foreignKey: 'reviewerId', as: 'reviewer' });
db.SwapRequest.hasOne(db.Rating, { foreignKey: 'swapRequestId', as: 'rating' });

// Favorites
db.User.hasMany(db.Favorite, { foreignKey: 'userId', as: 'favorites' });
db.Item.hasMany(db.Favorite, { foreignKey: 'itemId', as: 'favoritedBy' });
db.Favorite.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
db.Favorite.belongsTo(db.Item, { foreignKey: 'itemId', as: 'item' });

// Notifications
db.User.hasMany(db.Notification, { foreignKey: 'userId', as: 'notifications' });
db.Notification.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

module.exports = db;
