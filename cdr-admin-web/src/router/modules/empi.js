export default [
  {
    path: '/empi/patientMasterIndex',
    meta: {
      title: '患者主索引'
    },
    name: 'patientMasterIndex',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "patientMasterIndex" */ '@/views/empi/patientMasterIndex/index.vue')
  },
  {
    path: '/empi/mergePatient',
    meta: {
      title: '合并患者'
    },
    name: 'mergePatient',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "mergePatient" */ '@/views/empi/mergePatient/index.vue')
  },
  {
    path: '/empi/separationPatient',
    meta: {
      title: '拆分患者'
    },
    name: 'separationPatient',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "separationPatient" */ '@/views/empi/separationPatient/index.vue')
  },
  {
    path: '/empi/patientDetail',
    meta: {
      title: '患者详情'
    },
    name: 'patientDetail',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "patientDetail" */ '@/views/empi/patientDetail/index.vue')
  },
  {
    path: '/empi/weightOf',
    meta: {
      title: '权重设置'
    },
    name: 'empiWeightOf',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "empiWeightOf" */ '@/views/empi/weightOf/index.vue')
  },
  {
    path: '/empi/historicalRecords',
    meta: {
      title: '历史记录'
    },
    name: 'empiHistoricalRecords',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "empiHistoricalRecords" */ '@/views/empi/historicalRecords/index.vue')
  }
]
