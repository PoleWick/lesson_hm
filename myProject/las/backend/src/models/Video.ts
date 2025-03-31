import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface VideoAttributes {
  id: number;
  title: string;
  description?: string;
  videoUrl: string;
  coverUrl?: string;
  summary?: string;
  userId: number;
  views: number;
  likes: number;
  duration?: number;
  status: 'processing' | 'completed' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

interface VideoCreationAttributes extends Optional<VideoAttributes, 'id' | 'description' | 'coverUrl' | 'summary' | 'views' | 'likes' | 'duration'> {}

class Video extends Model<VideoAttributes, VideoCreationAttributes> implements VideoAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public videoUrl!: string;
  public coverUrl!: string;
  public summary!: string;
  public userId!: number;
  public views!: number;
  public likes!: number;
  public duration!: number;
  public status!: 'processing' | 'completed' | 'failed';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Video.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    coverUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '视频时长（秒）',
    },
    status: {
      type: DataTypes.ENUM('processing', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'processing',
    },
  },
  {
    sequelize,
    modelName: 'Video',
    tableName: 'videos',
  }
);

// 设置关联关系
Video.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Video, { foreignKey: 'userId', as: 'videos' });

export default Video; 