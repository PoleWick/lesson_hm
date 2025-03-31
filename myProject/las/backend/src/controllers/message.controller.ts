import { Request, Response } from 'express';
import Message from '../models/Message';
import User from '../models/User';
import Comment from '../models/Comment';
import { Op } from 'sequelize';

// 获取所有留言
export const getAllMessages = async (req: Request, res: Response) => {
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

    return res.status(200).json({
      messages,
      totalCount: count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum
    });
  } catch (error) {
    console.error('获取留言列表错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 创建新留言
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.user?.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: '留言内容不能为空' });
    }

    const message = await Message.create({
      content,
      userId
    });

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

    return res.status(201).json({
      message: '留言发布成功',
      data: newMessage
    });
  } catch (error) {
    console.error('创建留言错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取单个留言详情
export const getMessageById = async (req: Request, res: Response) => {
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
      return res.status(404).json({ message: '留言不存在' });
    }

    return res.status(200).json({ message });
  } catch (error) {
    console.error('获取留言详情错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 更新留言
export const updateMessage = async (req: Request, res: Response) => {
  try {
    const messageId = parseInt(req.params.id);
    const { content } = req.body;
    const userId = req.user?.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: '留言内容不能为空' });
    }

    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: '留言不存在' });
    }

    // 验证用户是否有权限修改
    if (message.userId !== userId) {
      return res.status(403).json({ message: '无权修改该留言' });
    }

    // 更新留言
    message.content = content;
    await message.save();

    return res.status(200).json({
      message: '留言更新成功',
      data: message
    });
  } catch (error) {
    console.error('更新留言错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 删除留言
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const messageId = parseInt(req.params.id);
    const userId = req.user?.id;

    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: '留言不存在' });
    }

    // 验证用户是否有权限删除
    if (message.userId !== userId) {
      return res.status(403).json({ message: '无权删除该留言' });
    }

    // 删除留言
    await message.destroy();

    return res.status(200).json({ message: '留言已删除' });
  } catch (error) {
    console.error('删除留言错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 点赞留言
export const likeMessage = async (req: Request, res: Response) => {
  try {
    const messageId = parseInt(req.params.id);

    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: '留言不存在' });
    }

    // 增加点赞数
    message.likes += 1;
    await message.save();

    return res.status(200).json({
      message: '点赞成功',
      likes: message.likes
    });
  } catch (error) {
    console.error('点赞留言错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取留言的评论
export const getMessageComments = async (req: Request, res: Response) => {
  try {
    const messageId = parseInt(req.params.id);
    
    // 验证留言是否存在
    const message = await Message.findByPk(messageId);
    
    if (!message) {
      return res.status(404).json({ message: '留言不存在' });
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
    
    return res.status(200).json({ comments });
  } catch (error) {
    console.error('获取留言评论错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
}; 