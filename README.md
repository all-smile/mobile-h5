# financial-innovation-h5

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

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
