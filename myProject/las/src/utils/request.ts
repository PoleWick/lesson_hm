import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API } from '../apis';

// 定义请求配置接口
interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  skipAuthRefresh?: boolean;
}

// 定义响应结构
interface ApiResponse<T = any> {
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

// 请求错误处理
const errorHandler = (error: AxiosError): Promise<never> => {
  const { response } = error;
  
  // 网络错误
  if (!response) {
    console.error('网络错误，请检查您的网络连接');
    return Promise.reject(new Error('网络错误，请检查您的网络连接'));
  }
  
  // 服务器返回的错误信息
  const errorMessage = (response.data as any)?.message || '请求失败';
  const errorCode = response.status;
  
  // 根据状态码处理不同错误
  switch (errorCode) {
    case 400:
      console.error(`请求错误: ${errorMessage}`);
      break;
    case 401:
      console.error(`未授权: ${errorMessage}`);
      // 可以在这里处理登出逻辑
      break;
    case 403:
      console.error(`权限不足: ${errorMessage}`);
      break;
    case 404:
      console.error(`请求的资源不存在: ${errorMessage}`);
      break;
    case 500:
      console.error(`服务器错误: ${errorMessage}`);
      break;
    default:
      console.error(`未知错误${errorCode}: ${errorMessage}`);
  }
  
  return Promise.reject(error);
};

// 创建请求函数
export const request = async <T = any>(
  config: RequestConfig
): Promise<ApiResponse<T>> => {
  try {
    // 使用API实例发送请求
    const response: AxiosResponse<ApiResponse<T>> = await API.request(config);
    return response.data;
  } catch (error) {
    // 如果配置中指定跳过错误处理，则直接抛出错误
    if (config.skipErrorHandler) {
      throw error;
    }
    return errorHandler(error as AxiosError);
  }
};

// 封装GET请求
export const get = <T = any>(
  url: string,
  params?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>({
    method: 'GET',
    url,
    params,
    ...config,
  });
};

// 封装POST请求
export const post = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>({
    method: 'POST',
    url,
    data,
    ...config,
  });
};

// 封装PUT请求
export const put = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>({
    method: 'PUT',
    url,
    data,
    ...config,
  });
};

// 封装PATCH请求
export const patch = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>({
    method: 'PATCH',
    url,
    data,
    ...config,
  });
};

// 封装DELETE请求
export const del = <T = any>(
  url: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>({
    method: 'DELETE',
    url,
    ...config,
  });
}; 