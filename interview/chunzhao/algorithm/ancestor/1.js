function lowestCommonAncestor(root, p, q) {
    if (!root || root === p || root === q) {
        return root;
    }
    // 二叉树 想想递归
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    // 左右都有值 说明当前节点就是最近的公共祖先
    if (left && right) {
        return root;
    }
    if (left) {
        return left;
    }
    if (right) {
        return right; 
    }
    return null;
}