import { Request, Response } from 'express';
import ChatMessage from '../models/ChatMessage';
import User from '../models/User';
import { Op } from 'sequelize';

// 获取用户的最近聊天
export const getRecentChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // 查找当前用户参与的所有聊天消息
    const chatMessages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });
    
    // 提取并去重聊天用户
    const chatUsersMap = new Map();
    
    chatMessages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser = message.senderId === userId ? message.receiver : message.sender;
      
      if (!chatUsersMap.has(otherUserId)) {
        chatUsersMap.set(otherUserId, {
          id: otherUserId,
          username: otherUser.username,
          avatar: otherUser.avatar,
          lastMessage: message.content,
          unread: message.senderId !== userId && !message.isRead ? 1 : 0,
          lastTime: message.createdAt
        });
      }
    });
    
    // 转换为数组并按最后消息时间排序
    const recentChats = Array.from(chatUsersMap.values()).sort((a, b) => 
      new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
    );
    
    return res.status(200).json({ recentChats });
  } catch (error) {
    console.error('获取最近聊天列表错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取与指定用户的聊天历史
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const otherUserId = parseInt(req.params.userId);
    
    // 验证对方用户是否存在
    const otherUser = await User.findByPk(otherUserId, {
      attributes: ['id', 'username', 'avatar']
    });
    
    if (!otherUser) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 获取聊天历史
    const chatHistory = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          {
            senderId: userId,
            receiverId: otherUserId
          },
          {
            senderId: otherUserId,
            receiverId: userId
          }
        ]
      },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });
    
    // 将未读消息标记为已读
    const unreadMessages = chatHistory.filter(
      message => message.senderId === otherUserId && !message.isRead
    );
    
    if (unreadMessages.length > 0) {
      await ChatMessage.update(
        { isRead: true },
        {
          where: {
            id: unreadMessages.map(message => message.id)
          }
        }
      );
    }
    
    return res.status(200).json({
      otherUser,
      chatHistory
    });
  } catch (error) {
    console.error('获取聊天历史错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 发送聊天消息
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user?.id;
    
    if (!receiverId || !content) {
      return res.status(400).json({ message: '缺少必要参数' });
    }
    
    // 验证接收者是否存在
    const receiver = await User.findByPk(receiverId);
    
    if (!receiver) {
      return res.status(404).json({ message: '接收用户不存在' });
    }
    
    // 创建消息
    const message = await ChatMessage.create({
      senderId,
      receiverId,
      content,
      isRead: false
    });
    
    // 获取完整的消息信息（包括发送者信息）
    const completedMessage = await ChatMessage.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });
    
    // 在实际项目中，这里应该通过WebSocket将消息推送给接收者
    
    return res.status(201).json({
      message: '消息发送成功',
      chatMessage: completedMessage
    });
  } catch (error) {
    console.error('发送聊天消息错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 标记消息为已读
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { messageIds } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ message: '请提供有效的消息ID列表' });
    }
    
    // 更新消息为已读（确保只更新发给当前用户的消息）
    const updateResult = await ChatMessage.update(
      { isRead: true },
      {
        where: {
          id: messageIds,
          receiverId: userId,
          isRead: false
        }
      }
    );
    
    return res.status(200).json({
      message: '消息已标记为已读',
      updatedCount: updateResult[0]
    });
  } catch (error) {
    console.error('标记消息已读错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 删除聊天消息
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const messageId = parseInt(req.params.id);
    
    // 查找消息
    const message = await ChatMessage.findByPk(messageId);
    
    if (!message) {
      return res.status(404).json({ message: '消息不存在' });
    }
    
    // 验证用户是否是发送者或接收者
    if (message.senderId !== userId && message.receiverId !== userId) {
      return res.status(403).json({ message: '无权删除该消息' });
    }
    
    // 删除消息
    await message.destroy();
    
    return res.status(200).json({
      message: '消息已删除'
    });
  } catch (error) {
    console.error('删除聊天消息错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 生成AI回复消息
export const generateAIReply = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: '消息内容不能为空' });
    }
    
    // 模拟AI回复
    // 实际项目中，这里应该调用DeepSeek API生成回复
    const aiReply = `这是对"${content}"的AI自动回复。实际项目中应使用DeepSeek API生成。`;
    
    // 创建AI用户（如果不存在）
    let aiUser = await User.findOne({
      where: { username: 'AI助手' }
    });
    
    if (!aiUser) {
      aiUser = await User.create({
        username: 'AI助手',
        email: 'ai@example.com',
        password: 'AI_SYSTEM_USER',
        avatar: '/uploads/images/ai-avatar.png',
        role: 'system'
      });
    }
    
    // 创建AI回复消息
    const message = await ChatMessage.create({
      senderId: aiUser.id,
      receiverId: userId,
      content: aiReply,
      isRead: false
    });
    
    // 获取完整的消息信息
    const completedMessage = await ChatMessage.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });
    
    return res.status(201).json({
      message: 'AI回复生成成功',
      chatMessage: completedMessage
    });
  } catch (error) {
    console.error('生成AI回复错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
}; 