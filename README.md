# mobile-h5

## 访问地址

本项目由 GitHub Actions 强力驱动

地址：https://home.i-xiao.space/mobile-h5/
## 项目介绍

本工程是移动端H5的框架模板，集成了前端工程设计的基础模块

- 移动端适配
- 菜单权限
- 提供基础控件，支持页面配置化开发
- 通用业务组件（移动端头部组件、空页面、错误页面、加载页面）
- 工具函数（指令、过滤器、utils）
- svg引用封装
- 全局Store存取
- 接口调用封装
- 接口报文传输加解密
- 接口重发控制
- 打包配置
- github workflows 配置
- 百度人脸活体检测
## 安装依赖

```
yarn

or: npm install
```

### 本地开发

```
npm run dev
```

### 本地打包

```
# 1. 生成dist包
npm run build

# 2. 生成zip包
npm run zip
```

### lint检测

```
npm run lint
```

## Git 规范 (\*建议)

提交格式（注意冒号后面有空格）
git commit -m <type>[optional scope]: <description>

使用 [commitlint](https://github.com/conventional-changelog/commitlint) 工具，常用有以下几种类型：

- feat ：新功能
- fix ：修复 bug
- chore ：对构建或者辅助工具的更改
- refactor ：既不是修复 bug 也不是添加新功能的代码更改
- style ：不影响代码含义的更改 (例如空格、格式化、少了分号)
- docs ： 只是文档的更改
- perf ：提高性能的代码更改
- revert ：撤回提交
- test ：添加或修正测试
- ci : 主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle 等)的提交

举例
git commit -m 'feat: 增加 xxx 功能'
