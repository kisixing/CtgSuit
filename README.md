# CtgSuit 胎监工作站

Electron example with [umi](https://github.com/umijs/umi/)

## 描述

 自己搭建的UmiJs与electron的框架,主要思路是将纯前端项目打包到./app/render目录下,然后在./app/main 文件下放置主进程代码。通过打包./app文件生成相应的可执行程序

## 使用

```bash
  # 安装依赖
  npm install

  # 安装app目录依赖
  cd app
  npm install

  #本地运行(启动前端项目和主进程)
  npm start // 无法直接在浏览器打开
  npm run dev:main

  # 打包(不打 dmg、exe 包，本地验证时用) --win-unpacked
  npm run pack

  # 生成exe安装文件（先执行npm run pack）
  npm run dist
```

### 如何在 renderer 端引用 electron、node 原生模块、以及 app 里的依赖

 直接 import 就好，已处理 externals。

## 参考

https://github.com/umijs/umi-example-electron

https://github.com/electron/electron-quick-start
