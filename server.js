import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import AuthRoutes from './routes/auth.routes.js';
import PatientRoutes from './routes/patients.routes.js'
import DoctorRoutes from './routes/doctor.routes.js'
import MappingRoutes from './routes/mappings.routes.js'

import sequelize from './models/index.js'; 
const app = express();

// Middleware
app.use(express.json());
app.get('/', (req, res) => {
    res.send('API is running');
});

// Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/patients', PatientRoutes);
app.use('/api/doctors',DoctorRoutes)
app.use('/api/mappings',MappingRoutes)
// Test DB connection and sync tables
const start = async () => {
    try {
        await sequelize.authenticate();
        //console.log('PostgreSQL connected (Sequelize)');

        await sequelize.sync({ alter: true }); // Creates/updates tables
        //console.log('Tables synced');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Unable to connect to DB:', err);
    }
};

start();
