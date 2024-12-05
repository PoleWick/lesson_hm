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
function inOrder(root) {
  // 树可以是空树
  //退出条件
  if (!root) return;

  // 递归式
  inOrder(root.left);
  console.log(root.val);
  inOrder(root.right);
}

inOrder(root);