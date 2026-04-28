import { Sequelize } from 'sequelize';
import { config } from './env.js';

const sequelizeOptions = {
  dialect: 'postgres',
  logging: config.env === 'development' ? console.log : false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  dialectOptions: config.env === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
};

let sequelize;
if (config.db.url) {
  sequelize = new Sequelize(config.db.url, sequelizeOptions);
} else {
  sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, {
    ...sequelizeOptions,
    host: config.db.host,
    port: config.db.port,
  });
}

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection has been established successfully.');
    
    // Sync models in development
    if (config.env === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized.');
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
