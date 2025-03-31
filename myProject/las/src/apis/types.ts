// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  username?: string;
  email?: string;
  password: string;
}

export interface UserUpdateData {
  username?: string;
  email?: string;
  bio?: string;
  notificationPreferences?: {
    email?: boolean;
    comments?: boolean;
    likes?: boolean;
  };
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountData {
  password: string;
}

// 视频相关类型
export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  userId: string;
  user: User;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoUploadData {
  title: string;
  description?: string;
  videoFile: File;
  thumbnailFile?: File;
}

export interface VideoUpdateData {
  title?: string;
  description?: string;
  thumbnailFile?: File;
}

// 评论相关类型
export interface Comment {
  id: string;
  content: string;
  userId: string;
  user: User;
  videoId: string;
  parentId?: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface CommentData {
  content: string;
  parentId?: string | null;
}

// 消息相关类型
export interface Message {
  id: string;
  content: string;
  userId: string;
  user: User;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface MessageData {
  content: string;
  mediaFile?: File;
}

// 聊天相关类型
export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  chatId: string;
  senderId: string;
  sender: User;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageData {
  content: string;
}

// 上传相关类型
export interface FileUploadResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface ChunkUploadInit {
  uploadId: string;
  chunkSize: number;
  totalChunks: number;
}

export interface ChunkInfo {
  uploadId: string;
  chunkNumber: number;
}

// 通用API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
} 