import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Patient from './patient.js';
import Doctor from './doctor.js';

const Mapping = sequelize.define('Mapping', {
  // no extra fields, just links
}, {
  tableName: 'mappings',
  timestamps: true,
});

Mapping.belongsTo(Patient, { foreignKey: 'patientId' });
Mapping.belongsTo(Doctor, { foreignKey: 'doctorId' });

export default Mapping;
