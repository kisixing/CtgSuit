export default [
  // user
  {
    path: '/user',
    component: '../layouts/BlankLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      {
        path: '/user/login',
        name: 'login',
        title: '登录',
        component: './User/Login',
      },
      {
        path: '/user/register',
        name: 'register',
        title: '注册',
        component: './User/Register',
      },
      { component: '404' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    // Routes: ['pages/Authorized'],// 可以做用户登录验证
    routes: [
      { path: '/', redirect: '/workbench' },
      {
        path: '/workbench', // Archives
        name: 'workbench',
        title: '胎监-主页',
        component: './Workbench/index',
      },
      {
        path: '/archives',
        name: 'workbench',
        title: '胎监-档案管理',
        component: './Archives/index',
      },
      {
        path: '/setting',
        name: 'workbench',
        title: '胎监-系统设置',
        component: './Setting/index',
      },
      // 异常处理页面
      {
        name: 'exception',
        icon: 'warning',
        hideInMenu: true,
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            title: '403',
            component: './exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            title: '404',
            component: './exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            title: '500',
            component: './exception/500',
          },
        ],
      },
    ],
  },
  { component: '404' },
];
