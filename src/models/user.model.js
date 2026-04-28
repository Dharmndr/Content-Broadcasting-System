import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';
import { config } from '../config/env.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('principal', 'teacher'),
    allowNull: false,
    defaultValue: 'teacher',
  },
}, {
  timestamps: true,
  underscored: true,
  defaultScope: {
    attributes: { exclude: ['password_hash'] },
  },
  scopes: {
    withPassword: { attributes: {} },
  },
});

// Instance methods
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// Override toJSON to ensure password is never sent
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password_hash;
  return values;
};

// Hooks for password hashing
User.beforeSave(async (user) => {
  if (user.changed('password_hash')) {
    const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
  }
});

export default User;
