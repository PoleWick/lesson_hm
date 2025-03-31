import axios from 'axios';
import type {
  UserRegisterData,
  UserLoginData,
  UserUpdateData,
  PasswordChangeData,
  DeleteAccountData,
  ApiResponse,
  User,
  VideoUploadData,
  VideoUpdateData,
  CommentData,
  MessageData,
  ChunkUploadInit,
  ChunkInfo,
  FileUploadResponse
} from './types';

// 创建axios实例
export const API = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // 如果请求已经重试过一定次数，不再重试
    if (originalRequest._retryCount >= 2) {
      console.error('请求失败次数过多，停止重试');
      return Promise.reject(error);
    }
    
    // 初始化重试计数
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 1;
    } else {
      originalRequest._retryCount++;
    }
    
    // 如果是401错误且没有重试过，尝试刷新token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // 如果没有刷新令牌，跳转到登录页
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // 尝试刷新token
        const response = await axios.post('/api/auth/refresh', { 
          refreshToken 
        });
        
        if (response.data.success) {
          // 更新tokens
          localStorage.setItem('accessToken', response.data.data.accessToken);
          localStorage.setItem('refreshToken', response.data.data.refreshToken);
          
          // 重新发送原请求
          originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
          return API(originalRequest);
        } else {
          // 刷新失败，跳转到登录页
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // 刷新失败，跳转到登录页
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // 连接被拒绝或服务器无响应，等待一段时间再重试
    if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED' || !error.response) {
      console.log(`API连接失败，${originalRequest._retryCount}/2次重试`);
      // 等待2秒后重试
      await new Promise(resolve => setTimeout(resolve, 2000));
      return API(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// 用户相关API
export const userApi = {
  // 注册
  register: (userData: UserRegisterData) => 
    API.post<ApiResponse<{accessToken: string, refreshToken: string, user: User}>>('/auth/register', userData),
  
  // 登录
  login: (credentials: UserLoginData) => 
    API.post<ApiResponse<{accessToken: string, refreshToken: string, user: User}>>('/auth/login', credentials),
  
  // 获取用户信息
  getUserInfo: () => 
    API.get<ApiResponse<User>>('/users/me'),
  
  // 更新用户信息
  updateUserInfo: (userData: UserUpdateData) => 
    API.patch<ApiResponse<User>>('/users/me', userData),
  
  // 更新用户头像
  updateAvatar: (formData: FormData) => 
    API.post<ApiResponse<{avatar: string}>>('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  // 修改密码
  changePassword: (passwordData: PasswordChangeData) => 
    API.post<ApiResponse<{success: boolean}>>('/users/me/password', passwordData),
  
  // 删除账号
  deleteAccount: (data: DeleteAccountData) => 
    API.delete<ApiResponse<{success: boolean}>>('/users/me', { data }),
  
  // 更改用户角色（管理员）
  changeUserRole: (userId: string, role: 'user' | 'admin') => 
    API.patch<ApiResponse<User>>(`/users/${userId}/role`, { role }),
  
  // 获取所有用户（管理员）
  getAllUsers: (page = 1, limit = 10) => 
    API.get<ApiResponse<{users: User[], total: number, page: number, limit: number}>>(`/users?page=${page}&limit=${limit}`),
};

// 视频相关API
export const videoApi = {
  // 获取视频列表
  getVideos: (page = 1, limit = 10) => API.get(`/videos?page=${page}&limit=${limit}`),
  
  // 获取视频详情
  getVideoById: (videoId) => API.get(`/videos/${videoId}`),
  
  // 发布视频
  uploadVideo: (videoData) => API.post('/videos', videoData),
  
  // 更新视频信息
  updateVideo: (videoId, videoData) => API.patch(`/videos/${videoId}`, videoData),
  
  // 删除视频
  deleteVideo: (videoId) => API.delete(`/videos/${videoId}`),
  
  // 点赞视频
  likeVideo: (videoId) => API.post(`/videos/${videoId}/like`),
  
  // 取消点赞
  unlikeVideo: (videoId) => API.delete(`/videos/${videoId}/like`),
};

// 评论相关API
export const commentApi = {
  // 获取评论列表
  getComments: (videoId, page = 1, limit = 10) => 
    API.get(`/videos/${videoId}/comments?page=${page}&limit=${limit}`),
  
  // 发布评论
  addComment: (videoId, content, parentId = null) => 
    API.post(`/videos/${videoId}/comments`, { content, parentId }),
  
  // 删除评论
  deleteComment: (commentId) => API.delete(`/comments/${commentId}`),
  
  // 获取AI回复
  getAIReply: (commentId) => API.get(`/comments/${commentId}/ai-reply`),
  
  // 点赞评论
  likeComment: (commentId) => API.post(`/comments/${commentId}/like`),
  
  // 取消点赞
  unlikeComment: (commentId) => API.delete(`/comments/${commentId}/like`),
};

// 消息相关API
export const messageApi = {
  // 获取消息列表
  getMessages: (page = 1, limit = 10) => API.get(`/messages?page=${page}&limit=${limit}`),
  
  // 获取单个消息详情
  getMessageById: (messageId) => API.get(`/messages/${messageId}`),
  
  // 获取用户自己的消息
  getUserMessages: (page = 1, limit = 10) => API.get(`/users/me/messages?page=${page}&limit=${limit}`),
  
  // 发送消息
  sendMessage: (content) => API.post('/messages', { content }),
  
  // 创建新消息（含文件上传）
  createMessage: (formData) => API.post('/messages/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // 删除消息
  deleteMessage: (messageId) => API.delete(`/messages/${messageId}`),
};

// 聊天相关API
export const chatApi = {
  // 获取聊天列表
  getChats: () => API.get('/chats'),
  
  // 获取聊天消息
  getChatMessages: (chatId, page = 1, limit = 20) => 
    API.get(`/chats/${chatId}/messages?page=${page}&limit=${limit}`),
  
  // 发送聊天消息
  sendChatMessage: (chatId, content) => 
    API.post(`/chats/${chatId}/messages`, { content }),
  
  // 创建新聊天
  createChat: (userId) => API.post('/chats', { userId }),
  
  // 获取未读消息数
  getUnreadCount: () => API.get('/chats/unread'),
  
  // 标记消息为已读
  markAsRead: (chatId) => API.patch(`/chats/${chatId}/read`),
};

// 上传相关API
export const uploadApi = {
  // 上传文件
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 分片上传初始化
  initChunkUpload: (fileInfo) => API.post('/upload/chunk/init', fileInfo),
  
  // 上传分片
  uploadChunk: (chunkInfo, chunkFile, onProgress) => {
    const formData = new FormData();
    formData.append('chunk', chunkFile);
    formData.append('uploadId', chunkInfo.uploadId);
    formData.append('chunkNumber', chunkInfo.chunkNumber);
    
    return API.post('/upload/chunk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onProgress
    });
  },
  
  // 完成分片上传
  completeChunkUpload: (uploadId) => API.post(`/upload/chunk/complete`, { uploadId }),
}; 