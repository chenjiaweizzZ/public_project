export default [
  {
    path: '/interfaceManager',
    meta: {
      title: '数据动态化构建工具'
    },
    name: 'interfaceManager',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () =>
      import(/* webpackChunkName: "interfaceManager" */ '@/views/interfaceManager/index.vue')
  },
  {
    path: '/SQLConfig',
    meta: {
      title: 'SQL配置工具'
    },
    name: 'SQLConfig',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () =>
      import(/* webpackChunkName: "SQLConfig" */ '@/views/interfaceManager/SQLConfig.vue')
  }
]
