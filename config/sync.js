import sequelize from '../models/index.js';
import User from '../models/user.js';
import Patient from '../models/patient.js';
import Doctor from '../models/doctor.js';
import Mapping from '../models/mapping.js';

const syncAll = async () => {
  try {
    await sequelize.authenticate();
    //console.log('Database connected');

    // Sync all models
    await sequelize.sync({ force: true }); // ✅ force: true drops existing tables
    //console.log('All tables synced successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error syncing tables:', error);
    process.exit(1);
  }
};

syncAll();
