function greet(name) {
    return 'Hello ,${name}!';
}

greet('111');
greet.language = 'English';
greet.greetInSpanish = function (name) {
    return 'Hola,${name}!';
};

function invokeGreeting(greetingFn, name) {
    return greetingFn(name);
}
console.log(invokeGreeting(greet, '111'));