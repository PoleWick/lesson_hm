import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface MessageAttributes {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  color?: string;
  userId: number;
  likes: number;
  mediaUrl?: string;
  mediaType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'likes' | 'subtitle' | 'color' | 'mediaUrl' | 'mediaType'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public title!: string;
  public subtitle!: string;
  public content!: string;
  public color!: string;
  public userId!: number;
  public likes!: number;
  public mediaUrl!: string;
  public mediaType!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '#ffffff',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    mediaUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mediaType: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
  }
);

// 设置关联关系
Message.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Message, { foreignKey: 'userId', as: 'userMessages' });

export default Message; 