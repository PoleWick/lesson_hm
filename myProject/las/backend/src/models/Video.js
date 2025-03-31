"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class Video extends sequelize_1.Model {
}
Video.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    videoUrl: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    coverUrl: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    summary: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    views: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    likes: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        comment: '视频时长（秒）',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('processing', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'processing',
    },
}, {
    sequelize: database_1.default,
    modelName: 'Video',
    tableName: 'videos',
});
// 设置关联关系
Video.belongsTo(User_1.default, { foreignKey: 'userId', as: 'author' });
User_1.default.hasMany(Video, { foreignKey: 'userId', as: 'videos' });
exports.default = Video;
