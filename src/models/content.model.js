import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.model.js';

const Content = sequelize.define('Content', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_url: {
    type: DataTypes.STRING,
  },
  file_type: {
    type: DataTypes.STRING,
  },
  file_size: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.ENUM('uploaded', 'pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  rejection_reason: {
    type: DataTypes.TEXT,
  },
  uploaded_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  approved_by: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  approved_at: {
    type: DataTypes.DATE,
  },
  start_time: {
    type: DataTypes.DATE,
  },
  end_time: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
  underscored: true,
});

Content.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });
Content.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });
User.hasMany(Content, { foreignKey: 'uploaded_by', as: 'uploadedContents' });

export default Content;
