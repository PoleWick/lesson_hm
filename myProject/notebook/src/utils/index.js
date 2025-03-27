// 项目中的接口统一管理
import axios from './axios'

export const get = axios.get
export const post = axios.post

export const getUserInfo = async () => {
  return await get('/user/getUserInfo')
}

export const typeMap = {
  1: {
    icon: 'canyin',
    name: '餐饮'
  },
  2: {
    icon: 'fushi',
    name: '服饰'
  },
  3: {
    icon: 'jiaotong',
    name: '交通'
  },
  4: {
    icon: 'riyong',
    name: '日用'
  },
  5: {
    icon: 'gouwu',
    name: '购物'
  },
  6: {
    icon: 'xuexi',
    name: '学习'
  },
  7: {
    icon: 'yiliao',
    name: '医疗'
  },
  8: {
    icon: 'lvxing',
    name: '旅行'
  },
  9: {
    icon: 'songli',
    name: '送礼'
  },
  10: {
    icon: 'qita',
    name: '其他'
  },
  11: {
    icon: 'gongzi',
    name: '工资'
  },
  12: {
    icon: 'jiangjin',
    name: '奖金'
  },
  13: {
    icon: 'zhuanzhang',
    name: '转账'
  },
  14: {
    icon: 'licai',
    name: '理财'
  },
  15: {
    icon: 'tuikuang',
    name: '退款'
  },
  16: {
    icon: 'qita',
    name: '其他'
  },
  17: {
    icon: 'jia',
    name: '加号'
  }
}