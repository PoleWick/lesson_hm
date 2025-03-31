import { Request, Response } from 'express';
import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// 获取所有视频
export const getAllVideos = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const { count, rows: videos } = await Video.findAndCountAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset
    });

    return res.status(200).json({
      videos,
      totalCount: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum
    });
  } catch (error) {
    console.error('获取视频列表错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 上传视频
export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!title) {
      return res.status(400).json({ message: '视频标题不能为空' });
    }

    if (!req.file) {
      return res.status(400).json({ message: '请上传视频文件' });
    }

    const videoFile = req.file;
    const videoUrl = `/uploads/videos/${videoFile.filename}`;

    // 创建视频记录
    const video = await Video.create({
      title,
      description: description || '',
      videoUrl,
      userId,
      status: 'processing'
    });

    // 触发异步处理（实际项目中这应该放入队列）
    // processVideo(video.id, videoUrl);

    return res.status(201).json({
      message: '视频上传成功，正在处理中',
      video: {
        id: video.id,
        title: video.title,
        description: video.description,
        status: video.status
      }
    });
  } catch (error) {
    console.error('上传视频错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 分片上传初始化
export const initChunkUpload = async (req: Request, res: Response) => {
  try {
    const { filename, totalChunks, fileSize } = req.body;
    const userId = req.user?.id;

    if (!filename || !totalChunks || !fileSize) {
      return res.status(400).json({ message: '缺少必要参数' });
    }

    // 生成唯一上传ID
    const uploadId = crypto.randomBytes(16).toString('hex');
    
    // 创建临时目录存储分片
    const chunkDir = path.join(__dirname, '../../uploads/chunks', uploadId);
    
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir, { recursive: true });
    }

    // 存储上传信息（实际项目中应该保存到数据库或Redis中）
    // tempUploads[uploadId] = { userId, filename, totalChunks: parseInt(totalChunks), fileSize, receivedChunks: 0 };

    return res.status(200).json({
      uploadId,
      message: '上传初始化成功'
    });
  } catch (error) {
    console.error('初始化分片上传错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 上传分片
export const uploadChunk = async (req: Request, res: Response) => {
  try {
    const { uploadId } = req.params;
    const { chunkNumber } = req.query;
    const userId = req.user?.id;

    if (!uploadId || !chunkNumber) {
      return res.status(400).json({ message: '缺少必要参数' });
    }

    if (!req.file) {
      return res.status(400).json({ message: '请上传分片文件' });
    }

    // 验证上传ID是否有效
    // const uploadInfo = tempUploads[uploadId];
    // if (!uploadInfo || uploadInfo.userId !== userId) {
    //   return res.status(404).json({ message: '上传ID无效' });
    // }

    // 保存分片
    const chunkDir = path.join(__dirname, '../../uploads/chunks', uploadId);
    const chunkPath = path.join(chunkDir, `chunk-${chunkNumber}`);
    
    // fs.renameSync(req.file.path, chunkPath);
    
    // 更新已接收分片数量
    // uploadInfo.receivedChunks += 1;

    return res.status(200).json({
      message: '分片上传成功',
      chunkNumber
    });
  } catch (error) {
    console.error('上传分片错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 完成分片上传
export const completeChunkUpload = async (req: Request, res: Response) => {
  try {
    const { uploadId } = req.params;
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!uploadId || !title) {
      return res.status(400).json({ message: '缺少必要参数' });
    }

    // 验证上传ID是否有效
    // const uploadInfo = tempUploads[uploadId];
    // if (!uploadInfo || uploadInfo.userId !== userId) {
    //   return res.status(404).json({ message: '上传ID无效' });
    // }

    // // 验证所有分片是否上传完成
    // if (uploadInfo.receivedChunks !== uploadInfo.totalChunks) {
    //   return res.status(400).json({ 
    //     message: '分片上传尚未完成',
    //     receivedChunks: uploadInfo.receivedChunks,
    //     totalChunks: uploadInfo.totalChunks
    //   });
    // }

    // 合并分片
    const chunkDir = path.join(__dirname, '../../uploads/chunks', uploadId);
    const videosDir = path.join(__dirname, '../../uploads/videos');
    
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    // 生成最终文件名
    const fileExt = path.extname(req.body.filename || 'video.mp4');
    const finalFilename = `video-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${fileExt}`;
    const finalPath = path.join(videosDir, finalFilename);
    
    // const writeStream = fs.createWriteStream(finalPath);
    
    // 按顺序合并分片
    // for (let i = 1; i <= uploadInfo.totalChunks; i++) {
    //   const chunkPath = path.join(chunkDir, `chunk-${i}`);
    //   const chunkBuffer = fs.readFileSync(chunkPath);
    //   writeStream.write(chunkBuffer);
    //   fs.unlinkSync(chunkPath); // 删除分片
    // }
    
    // writeStream.end();
    
    // 删除临时目录
    // fs.rmdirSync(chunkDir);
    
    // 删除上传信息
    // delete tempUploads[uploadId];

    // 创建视频记录
    const video = await Video.create({
      title,
      description: description || '',
      videoUrl: `/uploads/videos/${finalFilename}`,
      userId,
      status: 'processing'
    });

    // 触发异步处理（实际项目中这应该放入队列）
    // processVideo(video.id, finalPath);

    return res.status(201).json({
      message: '视频上传成功，正在处理中',
      video: {
        id: video.id,
        title: video.title,
        description: video.description,
        status: video.status
      }
    });
  } catch (error) {
    console.error('完成分片上传错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取单个视频详情
export const getVideoById = async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id);

    const video = await Video.findByPk(videoId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }

    // 增加观看次数
    video.views += 1;
    await video.save();

    return res.status(200).json({ video });
  } catch (error) {
    console.error('获取视频详情错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 更新视频信息
export const updateVideo = async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id);
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!title) {
      return res.status(400).json({ message: '视频标题不能为空' });
    }

    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }

    // 验证用户是否有权限修改
    if (video.userId !== userId) {
      return res.status(403).json({ message: '无权修改该视频' });
    }

    // 更新视频信息
    video.title = title;
    video.description = description || '';
    await video.save();

    return res.status(200).json({
      message: '视频信息更新成功',
      video
    });
  } catch (error) {
    console.error('更新视频信息错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 删除视频
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id);
    const userId = req.user?.id;

    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }

    // 验证用户是否有权限删除
    if (video.userId !== userId) {
      return res.status(403).json({ message: '无权删除该视频' });
    }

    // 删除视频文件
    const videoPath = path.join(__dirname, '../..', video.videoUrl);
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // 删除封面文件（如果有）
    if (video.coverUrl) {
      const coverPath = path.join(__dirname, '../..', video.coverUrl);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    // 删除视频记录
    await video.destroy();

    return res.status(200).json({ message: '视频已删除' });
  } catch (error) {
    console.error('删除视频错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 点赞视频
export const likeVideo = async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id);

    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }

    // 增加点赞数
    video.likes += 1;
    await video.save();

    return res.status(200).json({
      message: '点赞成功',
      likes: video.likes
    });
  } catch (error) {
    console.error('点赞视频错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取视频的评论
export const getVideoComments = async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id);
    
    // 验证视频是否存在
    const video = await Video.findByPk(videoId);
    
    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }
    
    // 获取所有一级评论（没有父评论的评论）
    const comments = await Comment.findAll({
      where: {
        videoId,
        parentId: { [Op.is]: null }
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'avatar']
            }
          ]
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [{ model: Comment, as: 'replies' }, 'createdAt', 'ASC']
      ]
    });
    
    return res.status(200).json({ comments });
  } catch (error) {
    console.error('获取视频评论错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// AI生成视频摘要
export const generateVideoSummary = async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id);
    const userId = req.user?.id;

    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }

    // 验证用户是否有权限操作
    if (video.userId !== userId) {
      return res.status(403).json({ message: '无权操作该视频' });
    }

    // 模拟AI摘要生成
    // 实际项目中，这里应该调用阿里云OCR分析视频内容，然后使用DeepSeek生成摘要
    const summary = `这是视频"${video.title}"的AI自动生成摘要。实际项目中应使用阿里云OCR和DeepSeek API生成。`;

    // 更新视频摘要
    video.summary = summary;
    await video.save();

    return res.status(200).json({
      message: '视频摘要生成成功',
      summary
    });
  } catch (error) {
    console.error('生成视频摘要错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 智能生成视频封面
export const generateVideoCover = async (req: Request, res: Response) => {
  try {
    const videoId = parseInt(req.params.id);
    const userId = req.user?.id;

    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ message: '视频不存在' });
    }

    // 验证用户是否有权限操作
    if (video.userId !== userId) {
      return res.status(403).json({ message: '无权操作该视频' });
    }

    // 模拟生成封面
    // 实际项目中，这里应该调用阿里云GenerateVideoCover API
    const coverFilename = `cover-${Date.now()}-${crypto.randomBytes(6).toString('hex')}.jpg`;
    const coverUrl = `/uploads/images/${coverFilename}`;

    // 更新视频封面
    video.coverUrl = coverUrl;
    await video.save();

    return res.status(200).json({
      message: '视频封面生成成功',
      coverUrl
    });
  } catch (error) {
    console.error('生成视频封面错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
}; 