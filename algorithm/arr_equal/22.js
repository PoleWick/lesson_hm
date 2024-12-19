const arr1 = ['apple', 'banna', NaN];
const arr2 = ['apple', NaN, 'banna'];
function compareArray1(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false
    }
    return arr1.every((item, index) => {
      return item === arr2[index]
    })
  }
  console.log(compareArray1(arr1, arr2))
  

  function compareArray2(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false
    }
    for (let i = 0; i < arr1.length; i++) {
      if (!arr2.includes(arr1[i])) {
        return false
      }
    }
  }
  console.log(compareArray2(arr1, arr2))