require('dotenv').config();
const mongoose = require('mongoose');
const inMemoryAdapter = require('./inMemoryAdapter');
const mongoAdapter = require('./mongoAdapter');

let activeAdapter = null;

const connectDB = async () => {
  // 1. Try MongoDB
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('✅ Connected to MongoDB');
      activeAdapter = mongoAdapter;
      return 'mongodb';
    } catch (err) {
      console.warn('⚠️  MongoDB connection failed:', err.message);
    }
  }

  // 2. Try MySQL via Sequelize
  if (process.env.MYSQL_HOST && process.env.MYSQL_USER) {
    try {
      const { Sequelize, DataTypes } = require('sequelize');
      const sequelize = new Sequelize(
        process.env.MYSQL_DATABASE || 'projectdb',
        process.env.MYSQL_USER,
        process.env.MYSQL_PASSWORD,
        {
          host: process.env.MYSQL_HOST,
          port: process.env.MYSQL_PORT || 3306,
          dialect: 'mysql',
          logging: false,
          dialectOptions: { connectTimeout: 3000 },
        }
      );
      await sequelize.authenticate();
      const sequelizeAdapter = require('./sequelizeAdapter')(sequelize, DataTypes);
      await sequelizeAdapter.sync();
      console.log('✅ Connected to MySQL');
      activeAdapter = sequelizeAdapter;
      return 'mysql';
    } catch (err) {
      console.warn('⚠️  MySQL connection failed:', err.message);
    }
  }

  // 3. Try PostgreSQL via Sequelize
  if (process.env.PG_HOST && process.env.PG_USER) {
    try {
      const { Sequelize, DataTypes } = require('sequelize');
      const sequelize = new Sequelize(
        process.env.PG_DATABASE || 'projectdb',
        process.env.PG_USER,
        process.env.PG_PASSWORD,
        {
          host: process.env.PG_HOST,
          port: process.env.PG_PORT || 5432,
          dialect: 'postgres',
          logging: false,
          dialectOptions: { connectionTimeoutMillis: 3000 },
        }
      );
      await sequelize.authenticate();
      const sequelizeAdapter = require('./sequelizeAdapter')(sequelize, DataTypes);
      await sequelizeAdapter.sync();
      console.log('✅ Connected to PostgreSQL');
      activeAdapter = sequelizeAdapter;
      return 'postgres';
    } catch (err) {
      console.warn('⚠️  PostgreSQL connection failed:', err.message);
    }
  }

  // 4. Fallback to in-memory
  console.log('💾 Using in-memory database (data will not persist on restart)');
  activeAdapter = inMemoryAdapter;
  return 'in-memory';
};

const getAdapter = () => {
  if (!activeAdapter) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return activeAdapter;
};

module.exports = { connectDB, getAdapter };
