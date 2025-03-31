import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Message from './Message';
import Video from './Video';

interface CommentAttributes {
  id: number;
  content: string;
  userId: number;
  messageId?: number | null;
  videoId?: number | null;
  parentId?: number | null;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id' | 'likes'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> {
  public id!: number;
  public content!: string;
  public userId!: number;
  public messageId!: number | null;
  public videoId!: number | null;
  public parentId!: number | null;
  public likes!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 关联
  public readonly author?: User;
  public readonly message?: Message;
  public readonly video?: Video;
  public readonly parent?: Comment;
  public readonly replies?: Comment[];
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'messages',
        key: 'id',
      },
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'videos',
        key: 'id',
      },
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id',
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
  }
);

// 设置关联关系
Comment.belongsTo(User, { as: 'author', foreignKey: 'userId' });
Comment.belongsTo(Message, { foreignKey: 'messageId' });
Comment.belongsTo(Video, { foreignKey: 'videoId' });
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parentId' });
Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentId' });

export default Comment; 