import { Request, Response } from 'express';
import Comment from '../models/Comment';
import User from '../models/User';
import Message from '../models/Message';
import Video from '../models/Video';
import { Op } from 'sequelize';

// 创建新评论
export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, messageId, videoId, parentId } = req.body;
    const userId = req.user?.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: '评论内容不能为空' });
    }

    // 验证必须指定留言ID或视频ID
    if (!messageId && !videoId) {
      return res.status(400).json({ message: '必须指定留言ID或视频ID' });
    }

    // 如果有父评论ID，验证父评论是否存在
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) {
        return res.status(404).json({ message: '父评论不存在' });
      }
    }

    // 验证留言或视频是否存在
    if (messageId) {
      const message = await Message.findByPk(messageId);
      if (!message) {
        return res.status(404).json({ message: '留言不存在' });
      }
    } else if (videoId) {
      const video = await Video.findByPk(videoId);
      if (!video) {
        return res.status(404).json({ message: '视频不存在' });
      }
    }

    // 创建评论
    const comment = await Comment.create({
      content,
      userId,
      messageId: messageId || undefined,
      videoId: videoId || undefined,
      parentId: parentId || undefined
    });

    // 获取包含用户信息的评论
    const newComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    return res.status(201).json({
      message: '评论发布成功',
      comment: newComment
    });
  } catch (error) {
    console.error('创建评论错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取评论详情（包括回复）
export const getCommentById = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);

    const comment = await Comment.findByPk(commentId, {
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
      ]
    });

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    return res.status(200).json({ comment });
  } catch (error) {
    console.error('获取评论详情错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 更新评论
export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const { content } = req.body;
    const userId = req.user?.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: '评论内容不能为空' });
    }

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 验证用户是否有权限修改
    if (comment.userId !== userId) {
      return res.status(403).json({ message: '无权修改该评论' });
    }

    // 更新评论
    comment.content = content;
    await comment.save();

    return res.status(200).json({
      message: '评论更新成功',
      comment
    });
  } catch (error) {
    console.error('更新评论错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 删除评论
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = req.user?.id;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 验证用户是否有权限删除
    if (comment.userId !== userId) {
      return res.status(403).json({ message: '无权删除该评论' });
    }

    // 删除评论
    await comment.destroy();

    return res.status(200).json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 点赞评论
export const likeComment = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 增加点赞数
    comment.likes += 1;
    await comment.save();

    return res.status(200).json({
      message: '点赞成功',
      likes: comment.likes
    });
  } catch (error) {
    console.error('点赞评论错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 回复评论
export const replyToComment = async (req: Request, res: Response) => {
  try {
    const parentId = parseInt(req.params.id);
    const { content } = req.body;
    const userId = req.user?.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: '回复内容不能为空' });
    }

    // 验证父评论是否存在
    const parentComment = await Comment.findByPk(parentId);
    if (!parentComment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 创建回复
    const reply = await Comment.create({
      content,
      userId,
      messageId: parentComment.messageId,
      videoId: parentComment.videoId,
      parentId
    });

    // 获取包含用户信息的回复
    const newReply = await Comment.findByPk(reply.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    return res.status(201).json({
      message: '回复发布成功',
      reply: newReply
    });
  } catch (error) {
    console.error('回复评论错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// AI生成评论回复
export const generateAIReply = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = req.user?.id;

    // 验证评论是否存在
    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 模拟AI生成的回复内容
    // 实际项目中，这里应该调用DeepSeek API生成回复
    const aiResponse = `这是对"${comment.content}"的AI自动回复。实际项目中应使用DeepSeek API生成。`;

    // 创建AI回复
    const reply = await Comment.create({
      content: aiResponse,
      userId,  // 使用当前用户ID作为AI回复的发布者
      messageId: comment.messageId,
      videoId: comment.videoId,
      parentId: commentId
    });

    // 获取包含用户信息的AI回复
    const aiReply = await Comment.findByPk(reply.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    return res.status(201).json({
      message: 'AI回复生成成功',
      reply: aiReply
    });
  } catch (error) {
    console.error('生成AI回复错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
}; 