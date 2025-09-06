import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  refreshToken: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'users',
  timestamps: false // ✅ Let Sequelize handle createdAt and updatedAt
});


export default User;
