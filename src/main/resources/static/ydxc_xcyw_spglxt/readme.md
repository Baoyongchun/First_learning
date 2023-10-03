# project 开发流程

## git 常用命令使用
-  git branch  
   获取所有分支
-  git branch <name>
    创建分支   
-  git checkout <name>
   切换分支
-  git branch -d <name>
   删除本地分支   


## 代码开发流程

## 在git上创建项目代码

- 主程序员创建 master 分支，
  - master 为主分支，稳定的主干版本
  
- 主程序员创建develop分支
  - develop 为开发分支， 渐进式开发的版本

## 团队成员拉取develop分支，创建自己的 feature 
   - feature:  团队成员各自的功能分支

## 团队成员创建自己的分支
> 分支命名  feature/ydxc_xcyw_name

ydxc_xcyw: 为项目名称
name: 为开发者的姓名简称
```
   feature/ydxc_xcyw_wanghuifeng
   
``` 

## 提交合并请求给主程序员,主程序员审核代码，并合并到develop
提交代码之前一定要记得优先从develop拉取代码

## 团队成员时刻拉取develop代码

主程序员合并代码可以在项目群里发一个通知，告诉全体项目前端成员拉取代码



## 项目地址
http://gitlab.thunisoft.com/jcw/zjw_ydxc_source.git




    