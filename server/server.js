const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const swapRoutes = require('./routes/swaps');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const favoriteRoutes = require('./routes/favorites');
const notificationRoutes = require('./routes/notifications');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'SwapMarket API Server is running successfully!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
const seedData = require('./seed');

// Database connection and server start
sequelize.sync({ alter: true }).then(async () => {
  console.log('Database connected and synced');
  try {
    const { User } = require('./models');
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('Database empty, seeding default initial records...');
      await seedData();
      console.log('Database auto-seeded successfully!');
    } else {
      console.log('Existing database records preserved.');
    }
  } catch (e) {
    console.error('Auto-seed check error:', e);
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
