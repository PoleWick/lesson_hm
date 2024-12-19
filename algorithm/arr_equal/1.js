const scores = [85, 90, 70, 68, 80, 75, 95];

// array es6 新增的方法
const hasHigherScore = scores.some(score => score > 90);
console.log(hasHigherScore);

console.log(scores.every(score => score > 60));

const hasEvenNumber = scores.some(score => score % 2 === 0);

console.log([1, 2, 3].indexOf(2),[1, 2, 3].indexOf(4),[1, 2, 3].indexOf(1));

