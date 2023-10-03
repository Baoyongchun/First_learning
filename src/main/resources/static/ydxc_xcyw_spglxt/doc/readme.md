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
## 遵循分支命名规范
必须严格按照 git flow 的分支命名


- master 暂时无用


- develop gitlab 上默认展示的分支。主要用于收集需求。完成的 feature 分支要通过主程审查后合并到此分支


- feature/**-姓名 功能（需求）分支，开发人员在自建的该类分支上完成领到的需求。每个 feature 分支上的需求要尽可能地小，即便领到的是复杂需求也请尽可能拆分数个分支进行开发，以便部分功能可以发布并快速迭代。


- release/**-姓名 develop 分支收集一定量的需求，到了规定的时间点后创建此分支。开发人员需要创建 bugfix 分支修改此分支上发现的问题，经主程审查后合并到当前 release 分支


- bugfix/**-姓名 修改开发过程中 bug 的分支，视当前开发进度，该类分支可能基于 develop 或者 release 分支创建


- hotfix/**-姓名 修改线上问题的分支，问题修复后，需要合并到 develop master，并视情况合并到仍然活跃（现场还在使用）的 release 分支上


- 公用模块修改，应该及时提交合并请求， 合并完在团队群中发通知，其他人及时更新。 【！important】


- 团队成员，每人每天 至少从develop拉取一次代码，防止代码冲突  【！important】
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


# a6项目需要注意的点

### <font color=red>1. 禁止使用ES6语法</font>
### <font color=red>2. 开发那边修改前端相关的,需要提交合并请求给前端负责人（王会锋）这边进行合并,如有问题不于合并</font>




    