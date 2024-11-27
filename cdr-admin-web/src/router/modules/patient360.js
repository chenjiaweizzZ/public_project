export default [
  {
    path: '/cdrSystem/patientList',
    name: 'patientList',
    meta: {
      title: '患者列表'
    },
    component: () => import('@/views/cdrSystem/patientList/index.vue')
  },
  {
    path: '/cdrSystem/panoramicVIew',
    name: 'panoramicVIew',
    meta: {
      title: '全景视图'
    },
    component: () => import('@/views/cdrSystem/panoramicVIew/index.vue')
  },
  {
    path: '/cdrSystem/commonMode',
    name: 'commonMode',
    meta: {
      title: '普通模式-门诊-病历'
    },
    component: () => import('@/views/cdrSystem/commonMode/index.vue')
  },
  {
    path: '/cdrSystem/timelineMode',
    name: 'timelineMode',
    meta: {
      title: '时间轴模式-门诊'
    },
    component: () => import('@/views/cdrSystem/timelineMode/index.vue')
  }
]
