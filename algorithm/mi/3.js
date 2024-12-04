function func(x,n){
    if (n === 0){
        return 1
    }
    let t = func(x,Math.floor(n/2))
    if (n % 2 === 0){
        return t * t
    }else{
        return t * t * x
    }

}