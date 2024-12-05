class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = this.right = null;
  }
}

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.right = new TreeNode(6);

function levelOrder(root) {
    if (root === null) return[];
    const result = []; 
    const queue = [root]; // 使用数组模拟队列
    while (queue.length) {// 不为空
        const node = queue.shift(); // 移除队首元素
        result.push(node.val); // 访问当前节点

        if (node.left !== null) queue.push(node.left); // 左子节点入队
        if (node.right !== null) queue.push(node.right); // 右子节点入队
    }
    while (queue.length) {
        return result;
    }
}
console.log(levelOrder(root));
