import bcrypt from 'bcrypt';

/**
 * 密码处理工具函数
 */

// 默认盐轮数
const SALT_ROUNDS = 10;

/**
 * 对密码进行哈希加密
 * @param password 明文密码
 * @param saltRounds 盐轮数（默认10）
 * @returns 哈希后的密码
 */
export const hashPassword = async (password: string, saltRounds = SALT_ROUNDS): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('密码加密失败');
  }
};

/**
 * 验证密码是否匹配
 * @param password 明文密码
 * @param hashedPassword 哈希后的密码
 * @returns 是否匹配
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('密码验证失败');
  }
};

/**
 * 生成随机密码
 * @param length 密码长度（默认12）
 * @returns 随机生成的密码
 */
export const generateRandomPassword = (length = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let password = '';
  
  // 生成随机密码
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // 确保密码包含至少一个数字、一个小写字母、一个大写字母和一个特殊字符
  const hasNumber = /\d/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password);
  
  // 如果不满足条件，重新生成
  if (!hasNumber || !hasLower || !hasUpper || !hasSpecial) {
    return generateRandomPassword(length);
  }
  
  return password;
};

/**
 * 检查密码强度
 * @param password 密码
 * @returns 密码强度评分（0-100）和评估
 */
export const checkPasswordStrength = (password: string): { score: number; feedback: string } => {
  let score = 0;
  const feedback: string[] = [];
  
  // 长度检查
  if (password.length < 8) {
    feedback.push('密码太短');
  } else {
    score += Math.min((password.length * 2), 20); // 最多20分
  }
  
  // 多样性检查
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password);
  
  if (hasLower) score += 10;
  else feedback.push('添加小写字母');
  
  if (hasUpper) score += 10;
  else feedback.push('添加大写字母');
  
  if (hasNumber) score += 10;
  else feedback.push('添加数字');
  
  if (hasSpecial) score += 15;
  else feedback.push('添加特殊字符');
  
  // 检查重复
  const repeats = password.match(/(.)\1+/g);
  if (repeats) {
    score -= repeats.length * 2;
    feedback.push('避免重复字符');
  }
  
  // 综合评估
  score = Math.max(0, Math.min(score, 100)); // 确保分数在0-100之间
  
  let strengthFeedback = '非常弱';
  if (score >= 80) strengthFeedback = '非常强';
  else if (score >= 60) strengthFeedback = '强';
  else if (score >= 40) strengthFeedback = '中';
  else if (score >= 20) strengthFeedback = '弱';
  
  return {
    score,
    feedback: feedback.length > 0
      ? `密码强度: ${strengthFeedback}。建议: ${feedback.join(', ')}`
      : `密码强度: ${strengthFeedback}`
  };
}; 