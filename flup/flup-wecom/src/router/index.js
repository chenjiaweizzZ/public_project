/**
 * @description 路由模块
 * @author 刘晨明
 */
import { createRouter, createWebHashHistory } from "vue-router";
import constantRouterMap from "./module/constantRouterMap";
import asyncRouterMap from "./module/asyncRouterMap";
import { storage } from "../storage/index";
import utils from "../utils/utils";
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouterMap,
});

router.beforeEach((to, from, next) => {
  if (utils.isDef(to.query.token)) {
    storage.setLocalStorage("token", to.query.token);
  }
  next()
});

const getAddRoutes = (roles) => {
  let accessedRoutes;
  // admin表示超级用户，用户所有的权限
  if (roles.includes("admin")) {
    accessedRoutes = asyncRouterMap || [];
  } else {
    accessedRoutes = filterAsyncRoutes(asyncRouterMap, roles);
  }
  return accessedRoutes;
};

const hasPermission = (roles, route) => {
  if (route.meta && route.meta.roles) {
    // some(只要有一项条件满足就返回true)
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    // 默认没有roles的表示所以权限均能访问
    return true;
  }
};

const filterAsyncRoutes = (routes, roles) => {
  let res = [];
  routes.forEach((route) => {
    let tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });
  return res;
};

export default router;
