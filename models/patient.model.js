import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const Patient = sequelize.define('Patient', {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  gender: { 
    type: DataTypes.ENUM('male', 'female', 'other'), // ✅ specify enum values
    allowNull: false 
  },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  mobile: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: true },
  date_of_birth: { type: DataTypes.DATE, allowNull: true },
  user_id: { // ✅ foreign key column
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    }
  }
}, {
  tableName: 'patients',
  timestamps: true,
  underscored: true, // ✅ uses snake_case in DB
});

// Associate Patient with User
Patient.belongsTo(User, { foreignKey: 'user_id' });

export default Patient;
