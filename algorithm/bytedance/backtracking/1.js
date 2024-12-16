const letterMap = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"]

function letterCombinations(digit) {
    const result = [];
    const path = []; // 某一种路径

    if (digit.length === 0) return result;
    
    function backtracking(index){
        // backtracking();
        if (index === digit.length) {
            result.push(path.join(''));
            return;
        }
        const digit = dits[index] - '0';
        // console.log(digit);
        const letters = letterMap[digit];
        console.log(letters);
        for (let i = 0; i < letters.length; i++) {
            // letters[i]; 这一次是path收集的开始
            path.push(letters[i]);// 开始
            backtracking(index + 1);
            path.pop();
        }
        
        
    }
    backtracking(0);
    
    return result;

}

letterCombinations("23")