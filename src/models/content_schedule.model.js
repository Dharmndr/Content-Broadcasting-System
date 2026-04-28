import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Content from './content.model.js';

const ContentSchedule = sequelize.define('ContentSchedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Content,
      key: 'id',
    },
  },
  rotation_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // minutes
  },
}, {
  timestamps: true,
  underscored: true,
});

ContentSchedule.belongsTo(Content, { foreignKey: 'content_id', as: 'content' });
Content.hasOne(ContentSchedule, { foreignKey: 'content_id', as: 'schedule' });

export default ContentSchedule;
