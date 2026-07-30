const { sequelize, User, Item } = require('./models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync database and clear existing data
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    // Hash passwords
    const passwordHash = await bcrypt.hash('password123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);

    // Create Users
    const users = await User.bulkCreate([
      {
        name: 'Admin User',
        email: 'admin@swapstyle.com',
        password: adminHash,
        location: 'New York',
        role: 'admin'
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: passwordHash,
        location: 'Los Angeles',
        role: 'user'
      },
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: passwordHash,
        location: 'Chicago',
        role: 'user'
      },
      {
        name: 'Emily Chen',
        email: 'emily@example.com',
        password: passwordHash,
        location: 'New York',
        role: 'user'
      }
    ]);

    console.log('Users seeded successfully');

    // Create Realistic Items
    await Item.bulkCreate([
      {
        title: 'Vintage Levi\'s 501 Jeans',
        description: 'Classic straight-leg Levi\'s in medium wash. Barely worn, excellent condition. Selling because they don\'t fit me anymore.',
        type: 'Pants',
        brand: 'Levi\'s',
        size: '32x30',
        condition: 'Like New',
        estimatedValue: 1800,
        location: 'Mumbai',
        status: 'available',
        imageUrls: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        ownerId: users[1].id // Jane
      },
      {
        title: 'North Face Puffer Jacket',
        description: 'Warm, cozy black puffer jacket. Perfect for winter. Has a tiny scuff on the left sleeve but otherwise great.',
        type: 'Jacket',
        brand: 'The North Face',
        size: 'M',
        condition: 'Good',
        estimatedValue: 3500,
        location: 'Delhi',
        status: 'available',
        imageUrls: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        ownerId: users[2].id // John
      },
      {
        title: 'Zara Floral Summer Dress',
        description: 'Lightweight summer dress with a beautiful floral pattern. Worn only once for a wedding.',
        type: 'Dress',
        brand: 'Zara',
        size: 'S',
        condition: 'New with tags',
        estimatedValue: 1450,
        location: 'Bangalore',
        status: 'available',
        imageUrls: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        ownerId: users[3].id // Emily
      },
      {
        title: 'Patagonia Fleece Pullover',
        description: 'Super soft retro-X fleece. Grey with navy blue accents. Extremely comfortable for hiking.',
        type: 'Shirt',
        brand: 'Patagonia',
        size: 'L',
        condition: 'Good',
        estimatedValue: 2400,
        location: 'Mumbai',
        status: 'available',
        imageUrls: ['https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        ownerId: users[1].id // Jane
      },
      {
        title: 'Nike Air Force 1s',
        description: 'Classic white AF1s. Worn a few times, some minor creasing on the toe box but very clean overall.',
        type: 'Accessories',
        brand: 'Nike',
        size: '10',
        condition: 'Fair',
        estimatedValue: 1500,
        location: 'Delhi',
        status: 'available',
        imageUrls: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        ownerId: users[2].id // John
      }
    ]);

    console.log('Items seeded successfully');
    console.log('Database seeding complete!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
