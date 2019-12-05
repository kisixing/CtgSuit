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
      {
        path: '/blank/analysis',
        name: 'analysis',
        title: '电脑分析',
        component: './Workbench/Analysis',
      },
      { component: '404' },
    ],
  },
  // full Page
  {
    path: '/full',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/full/analysis',
        name: 'analysis',
        title: '电脑分析',
        component: './Workbench/Analysis/',
      },
      { component: '404' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'], // 可以做用户登录验证
    routes: [
      // reload
      { path: '/', redirect: '/workbench' },
      // { path: '/a', redirect: '/archives' },
      // { path: '/s', redirect: '/setting' },
      // { path: '/p', redirect: '/pregnancy' },
      {
        path: '/workbench', // Archives
        name: 'workbench',
        exact: true,
        title: '胎监-主页',
        component: './Workbench/index',
      },
      {
        path: '/archives',
        name: 'workbench',
        exact: true,
        title: '胎监-档案管理',
        component: './Archives/index',
      },
      {
        path: '/setting',
        name: 'workbench',
        exact: true,
        title: '胎监-系统设置',
        component: './Setting/index',
      },
      {
        path: '/testCtg',
        name: 'testCtg',
        exact: true,
        title: '胎监-系统设置',
        component: './TestCtg',
      },
      {
        path: '/pregnancy',
        name: 'Pregnancy',
        exact: true,
        title: '胎监-孕产妇管理',
        component: './Pregnancy',
      },
      {
        path: '/account',
        name: 'account',
        title: '账户设置',
        component: './Account',
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
