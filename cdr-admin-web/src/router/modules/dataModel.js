export default [
  {
    path: '/dataModelManager',
    meta: {
      title: '数据模型管理'
    },
    name: 'dataModelManager',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "dataModel" */ '@/views/dataModel/index.vue')
  },
  {
    path: '/patientDataQuery',
    meta: {
      title: '患者数据查询'
    },
    name: 'patientDataQuery',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "patientData" */ '@/views/patientData/index.vue')
  },
  {
    path: '/metaDataManager',
    meta: {
      title: '元数据管理'
    },
    name: 'metaDataManager',
    /*
        route level code-splitting
        this generates a separate chunk (about.[hash].js) for this route
        which is lazy-loaded when the route is visited.
      */
    component: () => import(/* webpackChunkName: "metaDataManager" */ '@/views/metaDataManager/index.vue')
  }
]
