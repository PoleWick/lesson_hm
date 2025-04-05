import { Request, Response } from 'express';
import Message from '../models/Message';
import User from '../models/User';
import Comment from '../models/Comment';
import { Op } from 'sequelize';

// 获取所有留言
export const getAllMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const { count, rows: messages } = await Message.findAndCountAll({
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

    res.status(200).json({
      messages,
      totalCount: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum
    });
    return;
  } catch (error) {
    console.error('获取留言列表错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
    return;
  }
};

// 创建新留言
export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    // 获取表单数据
    const { title, subtitle, content, color } = req.body;
    const userId = req.user?.id;
    const file = req.file; // multer中间件处理的文件

    // 基本验证
    if (!title || title.trim() === '') {
      res.status(400).json({ 
        success: false,
        message: '标题不能为空' 
      });
      return;
    }

    // 检查用户是否已登录
    if (!userId) {
      res.status(401).json({ 
        success: false,
        message: '请先登录' 
      });
      return;
    }

    // 将字符串ID转换为数字
    const userIdNum = parseInt(userId, 10);

    // 准备创建消息的数据
    const messageData: any = {
      title,
      content: content || '',
      subtitle: subtitle || '',
      color: color || '#ffffff',
      userId: userIdNum
    };

    // 如果有文件上传，处理文件路径
    if (file) {
      messageData.mediaUrl = `/uploads/images/${file.filename}`;
      messageData.mediaType = 'image';
    }

    // 创建消息
    const message = await Message.create(messageData);

    // 获取包含用户信息的完整留言
    const newMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    // 返回成功响应
    res.status(201).json({
      success: true,
      message: '留言发布成功',
      data: newMessage
    });
    return;
  } catch (error) {
    console.error('创建留言错误:', error);
    res.status(500).json({ 
      success: false,
      message: '服务器错误，请稍后再试' 
    });
    return;
  }
};

// 获取单个留言详情
export const getMessageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const messageId = parseInt(req.params.id);

    const message = await Message.findByPk(messageId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    if (!message) {
      res.status(404).json({ message: '留言不存在' });
      return;
    }

    res.status(200).json({ message });
    return;
  } catch (error) {
    console.error('获取留言详情错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
    return;
  }
};

// 更新留言
export const updateMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const messageId = parseInt(req.params.id);
    const { content } = req.body;
    const userId = req.user?.id;

    if (!content || content.trim() === '') {
      res.status(400).json({ message: '留言内容不能为空' });
      return;
    }

    const message = await Message.findByPk(messageId);

    if (!message) {
      res.status(404).json({ message: '留言不存在' });
      return;
    }

    // 验证用户是否有权限修改
    const userIdNum = userId ? parseInt(userId, 10) : 0;
    if (message.userId !== userIdNum) {
      res.status(403).json({ message: '无权修改该留言' });
      return;
    }

    // 更新留言
    message.content = content;
    await message.save();

    res.status(200).json({
      message: '留言更新成功',
      data: message
    });
    return;
  } catch (error) {
    console.error('更新留言错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
    return;
  }
};

// 删除留言
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const messageId = parseInt(req.params.id);
    const userId = req.user?.id;

    const message = await Message.findByPk(messageId);

    if (!message) {
      res.status(404).json({ message: '留言不存在' });
      return;
    }

    // 验证用户是否有权限删除
    const userIdNum = userId ? parseInt(userId, 10) : 0;
    if (message.userId !== userIdNum) {
      res.status(403).json({ message: '无权删除该留言' });
      return;
    }

    // 删除留言
    await message.destroy();

    res.status(200).json({ message: '留言已删除' });
    return;
  } catch (error) {
    console.error('删除留言错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
    return;
  }
};

// 点赞留言
export const likeMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const messageId = parseInt(req.params.id);

    const message = await Message.findByPk(messageId);

    if (!message) {
      res.status(404).json({ message: '留言不存在' });
      return;
    }

    // 增加点赞数
    message.likes += 1;
    await message.save();

    res.status(200).json({
      message: '点赞成功',
      likes: message.likes
    });
    return;
  } catch (error) {
    console.error('点赞留言错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
    return;
  }
};

// 获取留言的评论
export const getMessageComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const messageId = parseInt(req.params.id);
    
    // 验证留言是否存在
    const message = await Message.findByPk(messageId);
    
    if (!message) {
      res.status(404).json({ message: '留言不存在' });
      return;
    }
    
    // 获取所有一级评论（没有父评论的评论）
    const comments = await Comment.findAll({
      where: {
        messageId,
        parentId: null
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
    
    res.status(200).json({ comments });
    return;
  } catch (error) {
    console.error('获取留言评论错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
    return;
  }
}; 