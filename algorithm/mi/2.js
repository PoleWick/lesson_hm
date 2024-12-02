function powerUsingRecursion(x, n) {
    if (n === 0) {
        return 1;
    } else if (n > 0) {
        return x * powerUsingRecursion(x, n - 1);
    } else {
        return (1 / x) * powerUsingRecursion(x, n + 1);
    }
}
console.log(powerUsingRecursion(2, 3));