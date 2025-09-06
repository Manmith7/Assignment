import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.model.js';

const Doctor = sequelize.define('Doctor', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  specialization: { type: DataTypes.STRING, allowNull: true },
  mobile: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'doctors',
  timestamps: true,
});

Doctor.belongsTo(User, { foreignKey: 'userId' });

export default Doctor;
