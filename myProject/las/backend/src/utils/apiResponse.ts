import { Response } from 'express';

/**
 * 标准API响应格式
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
  timestamp: number;
}

/**
 * 成功响应
 * @param res Express响应对象
 * @param data 响应数据
 * @param message 成功消息
 * @param code HTTP状态码
 */
export const success = <T>(
  res: Response,
  data: T,
  message: string = '操作成功',
  code: number = 200
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: Date.now()
  };
  return res.status(code).json(response);
};

/**
 * 带分页的成功响应
 * @param res Express响应对象
 * @param data 响应数据
 * @param total 总记录数
 * @param currentPage 当前页码
 * @param pageSize 每页大小
 * @param message 成功消息
 */
export const successWithPagination = <T>(
  res: Response,
  data: T,
  total: number,
  currentPage: number,
  pageSize: number,
  message: string = '操作成功'
) => {
  const totalPages = Math.ceil(total / pageSize);
  
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      total,
      currentPage,
      totalPages,
      pageSize
    },
    timestamp: Date.now()
  };
  
  return res.status(200).json(response);
};

/**
 * 错误响应
 * @param res Express响应对象
 * @param message 错误消息
 * @param code HTTP状态码
 */
export const error = (
  res: Response,
  message: string = '操作失败',
  code: number = 400
) => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    timestamp: Date.now()
  };
  return res.status(code).json(response);
};

/**
 * 服务器错误响应
 * @param res Express响应对象
 * @param err 错误对象
 */
export const serverError = (res: Response, err: Error) => {
  console.error('服务器错误:', err);
  
  const isDev = process.env.NODE_ENV === 'development';
  const message = isDev ? err.message : '服务器内部错误';
  
  const response: ApiResponse<null> = {
    success: false,
    message,
    timestamp: Date.now()
  };
  
  if (isDev) {
    // @ts-ignore
    response.stack = err.stack;
  }
  
  return res.status(500).json(response);
}; 