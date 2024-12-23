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
        // 当辅助栈为空时，将stack1中的元素全部压入stack2中
        // 这样stack2中的元素就是stack1的逆序，即先进先出
        if(this.stack2.length===0) {
            while(this.stack1.length) {
                this.stack2.push(this.stack1.pop())
            }
        }
        return this.stack2.pop()
    }
    peek() {
        if(this.stack2.length===0) {
            while(this.stack1.length) {
                this.stack2.push(this.stack1.pop())
            }
        }
        return this.stack2[this.stack2.length-1]
    }
    empty() {
        return !this.stack1.length && !this.stack2.length
    }

}