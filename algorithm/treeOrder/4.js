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
function postOrder(root) {
  // 树可以是空树
  //退出条件
  if (!root) return;

  // 递归式
  postOrder(root.left);
  postOrder(root.right);
  console.log(root.val);
}

postOrder(root);