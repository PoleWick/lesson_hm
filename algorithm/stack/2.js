// Stack 类
class ArrayStack{
    // 类的属性
    // public 公有  类的外部，内部，子类都可以访问
    // private 私有   类的外部不能访问，内部和子类可以访问 
    #stack;// 私有属性 正确
    constructor(){
        this.#stack = [];
        // this.items = 1;
    }
    // 类的方法
    // 入栈
    push(num){
        this.#stack.push(num);
    }
    // 出栈
    pop(){
        return this.#stack.pop();
    }
    // 查看栈顶元素
    peek(){
        if (this.isEmpty()) throw new Error("栈为空");
        else return this.#stack[this.#stack.length - 1];
    }
    // 栈是否为空
    isEmpty(){
        return this.#stack.length === 0;
    }
    // 栈的大小
    get size(){
        return this.#stack.length;
    }
    // 栈的打印
    toArray(){
        return this.#stack;
    }
}

const stack = new ArrayStack();

// console.log(stack.items);
stack.push(1)
stack.push(2)
stack.push(3)
console.log(stack.stack);