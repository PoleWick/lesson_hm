// 不考虑重复
const arr1 = ['apple', 'banana', 1]
const arr2 = ['apple', 1, 'banana']

function compareArray(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }
  return !arr1.some(item => arr2.indexof(item) === -1)
}
console.log(compareArray(arr1, arr2))

