function reverseStr(str){
    // 类型检测
    if (typeof str !== 'string'){
        return 
    }
    // 字符数组
    // 反转的字符数组
    // 变成字符串
    return str.split('');
}

const str = 'abcdefg';
console.log(reverseStr(str));