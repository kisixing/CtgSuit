# CtgSuit 胎监工作站

Electron example with [umi](https://github.com/umijs/umi/)
## 目录说明
```bash

├── app ## electron 入口 
├── config ## umi 配置相关
├── docs ## 文档
├── fired ## 辅助更新的程序
├── gulpfile.js ## 构建相关
├── libSrc ## 运行时依赖的库
├── main ## 运行时源代码
├── makefile ## makefile
├── mock ## umi mock 文件
├── public ## 静态资源
├── scripts ## 脚本工具
├── src ## 业务代码
├── tsconfig.json ## tsc 配置
├── webpack.config.js ## 给编辑器看的
├── node_modules
├── package.json
├── build
├── jsconfig.json 
├── README.md
├── yarn-error.log
└── yarn.lock
```
## 描述

 自己搭建的UmiJs与electron的框架,主要思路是将纯前端项目打包到./app/render目录下,然后在./app/main 文件下放置主进程代码。通过打包./app文件生成相应的可执行程序

## 使用

```bash
  # 安装依赖
  npm install
  # 安装完成后，需链接lianmed依赖
  npm run link:lianmed 

  # 安装运行时依赖
  cd app
  npm install

  #本地运行(启动前端项目和主进程)
  npm start // 无法直接在浏览器打开
  npm run dev:main

  #脱离electron单独运行
  npm start:runtime

  # 打包(不打 dmg、exe 包，本地验证时用) --win-unpacked
  npm run pack

  # 生成exe安装文件（先执行npm run pack）
  npm run dist

  # 发布
  npm run deploy:desktop
```

### 如何在 renderer 端引用 electron、node 原生模块、以及 app 里的依赖

 直接 import 就好，已处理 externals。

## 参考

https://github.com/umijs/umi-example-electron

https://github.com/electron/electron-quick-start

## git flow开发规则

```bash
  # 在分支develop上进行开发
  git checkout develop
```
