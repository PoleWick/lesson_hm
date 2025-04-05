function hongbao (total,num) {
    const arr = [];
    let restAmount = total;
    let restNum = num;
    for (let i = 0; i < num - 1; i++) {
        let amount = Math.floor(Math.random() * restAmount / restNum * 2);
        restAmount -= amount;
        restNum--;
        arr.push(amount);
    }
    return arr;
}