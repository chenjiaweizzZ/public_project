// 定义异步挂载的路由
const asyncRouterMap = [
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/pages/error/index.vue"),
  },
];

export default asyncRouterMap;
