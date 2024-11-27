export default [
  {
    path: '/report/editor',
    meta: {
      title: '报表编辑'
    },
    name: 'reportEditor',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () =>
      import(/* webpackChunkName: "reportEditor" */ '@/views/report/editor/index.vue')
  },
  {
    path: '/report/classified',
    meta: {
      title: '报表分类'
    },
    name: 'reportClassified',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () =>
      import(/* webpackChunkName: "reportClassified" */ '@/views/report/classified/index.vue')
  }
]
