function lengthOfLongestSubstring(s) {
    // 创建一个Set来存储窗口内的字符
    const charSet = new Set();
    // 定义左指针和结果变量
    let left = 0, maxLength = 0;

    // 右指针遍历字符串
    for (let right = 0; right < s.length; right++) {
        // 如果Set中已经包含了当前字符，则移动左指针并移除字符，直到不再包含该字符
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        // 添加当前字符到Set中
        charSet.add(s[right]);
        // 更新最大长度
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

// 示例用法：
const s = "abcabcbb";
console.log(`无重复字符的最长子串的长度为: ${lengthOfLongestSubstring(s)}`);