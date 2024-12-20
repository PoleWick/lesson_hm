// es6 class 面向对象思想，引入了设计模式
class MyQueue{
    constructor() {
        // 后进后出
        this.stack1 = []
        // 辅助栈
        this.stack2 = []
    }
    push(x) {
        this.stack1.push(x)
    }
    pop() {
        if(this.stack2.length===0) {
            while(this.stack1.length) {
                this.stack2.push(this.stack1.pop())
            }
        }
        return this.stack2.pop()
    }
    peek() {
        const x = this.pop()
        this.stack2.push(x)
        return x
    }
    empty() {
        return !this.stack1.length && !this.stack2.length
    }

}