// 先序遍历
const root = {
    val:'A',
    left:{
        val:'B',
        left:{
            val:'D'
        },
        right:{
            val:'E'
        }
    },
    right:{
        val:'C',
        right:{
            val:'F'
        }
    }
}
function preOrder(root) {
  // 树可以是空树
  //退出条件
  if (!root) return;

  // 递归式
  console.log(root.val);
  preOrder(root.left);
  preOrder(root.right);
}

preOrder(root);