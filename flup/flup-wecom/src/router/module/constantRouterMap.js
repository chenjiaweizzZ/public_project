// 定义没有权限的路由
const constantRouterMap = [
  {
    path: "/",
    redirect: "/layout",
  },
  {
    path: "/layout",
    name: "layout",
    component: () => import("@/pages/layout.vue"),
    children: [
      {
        path: "taskList",
        name: "taskList",
        component: () => import("@/pages/taskList/index.vue"),
      },
      {
        path: "patientList",
        name: "patientList",
        component: () => import("@/pages/patientList/index.vue"),
        children: [
          {
            path: "index",
            component: () => import("@/pages/patientList/components/index.vue"),
          },
          {
            path: "patientInformation",
            component: () =>
              import("@/pages/patientList/components/patientInformation.vue"),
          },
        ],
      },
      {
        path: "patientInformation",
        name: "patientInformation",
        component: () => import("@/pages/patientInformation/index.vue"),
      },
      {
        path: "microMart",
        name: "microMart",
        component: () => import("@/pages/microMart/index.vue"),
        children: [
          {
            path: "index",
            name: "index",
            component: () => import("@/pages/microMart/components/index.vue"),
          },
          {
            path: "detail",
            name: "detail",
            component: () => import("@/pages/microMart/components/detail.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/index.vue"),
  },
  {
    path: "/error/404",
    name: "404",
    component: () => import("@/pages/error/index.vue"),
  },
];

export default constantRouterMap;
