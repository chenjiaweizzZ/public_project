/* 
  1.统计图查看
  2.指标分类管理
  3.指标列表
  4.指标编辑
  5.大屏列表
  6.大屏编辑
  7.大屏呈现
*/
export default [
  {
    path: '/bi/charts',
    meta: {
      title: '统计图查看'
    },
    name: 'biCharts',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "biCharts" */ '@/views/bi/charts/index.vue')
  },
  {
    path: '/bi/targets-classified',
    meta: {
      title: '指标分类管理'
    },
    name: 'biTargetsClassified',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "biTargetsClassified" */ '@/views/bi/targetsClassified/index.vue')
  },
  {
    path: '/bi/targets-list',
    meta: {
      title: '指标列表'
    },
    name: 'biTargetsList',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "biTargetsList" */ '@/views/bi/targetsList/index.vue')
  },
  {
    path: '/bi/targets-editor',
    meta: {
      title: '指标编辑'
    },
    name: 'biTargetsEditor',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "biTargetsEditor" */ '@/views/bi/targetsEditor/index.vue')
  },
  {
    path: '/bi/screens-list',
    meta: {
      title: '大屏列表'
    },
    name: 'biScreensList',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "biScreensList" */ '@/views/bi/screensList/index.vue')
  },
  {
    path: '/bi/screens-editor',
    meta: {
      title: '大屏编辑'
    },
    name: 'biScreensEditor',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "biScreensEditor" */ '@/views/bi/screensEditor/index.vue')
  },
  {
    path: '/bi/screen-display',
    meta: {
      title: '大屏呈现'
    },
    name: 'biScreenDisplay',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "biScreenDisplay" */ '@/views/bi/screenDisplay/index.vue')
  },
]
