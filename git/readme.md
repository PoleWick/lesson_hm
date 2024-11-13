- git 有哪些命令？
  版本控制软件 多人协作，  几个亿的项目
  写项目？ 电脑坏了 保存代码的版本且安全， 团队间代码的协作
  git 帮我们在本地 管理代码版本，  分布式远程仓库
  常用操作， 自我代码管理和简单的协作
  - git init 初始化
  把代码加入仓库分3步
  - git add .  
  - git commit -m ""
  - git push origin main

  - git branch 分支
  - git checkout  切换分支
  - git merge 合并分支

## 大厂需要的git 能力
  - git 是必备技能
  - 高级技巧,考点
  - git 文档内置
    git help 常用的 git 命令
    git help -a 列出所有的名单
    vi 编辑器  :j :k 上下翻页  :q 退出
    *git help add   深入了解某个命令
     你是如何了解git命令的作用和参数的？

## 代码仓库
  文件夹 -> 开发目录(网站) -> 代码仓库()
  - 好处
   项目代码的版本(version)  git关注的是代码的版本
   时光穿梭机  文件的任何版本都可以找到  有时候我们要代码回退
  - *git 仓库里存的是啥？
   文件？  文件的版本(对)
   拿着相机一直拍照
   .git 目录 就是 仓库  
   git 相关的内容就放在.git这个目录里
  - git config 配置操作 留下的责任人， 多人协作思想
    老板就知道谁提交的代码
    git config --global user.name "xxx"
    git config --global user.email "EMAIL" 本地 远程 比对

  - git status  查看当前仓库的状态
    on branch main 主分支上 默认分支

    untracked file  未被跟踪的文件  还没被纳入版本控制
    use commit 
  
  添加到仓库是一件比较严谨的事情
  - git add file
    将文件的当前版本 先添加到暂存区
    git status

  - *为什么需要暂存区， 仓库 两个概念
    - 后悔药 
    - 分几次add, 然后一次性commit
      进货 ， 一辆买菜车 (git add 多次)  买完了(git commit一次)   买好菜了

