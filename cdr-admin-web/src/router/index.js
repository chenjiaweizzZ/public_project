import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import * as _api from '@/service/menuMap'
import _ from '@/utils'
import routerPath from "./constant";

Vue.use(VueRouter)
let routes = []
// 注册
const routeModules = require.context('./modules', false, /\.js$/)
routeModules.keys().forEach(currentPath => {
  routes = [...routes, ...routeModules(currentPath).default]
})

const router = new VueRouter({
  routes
})

const routerArr = new Set(routerPath)

router.beforeEach((to, from, next) => {
  let state = store.state
  if (to.query.token) {
    store.commit('user/setToken', to.query.token)
    if (!_.isNEArray(state.menu.map)) {
      _api.getMenuMap().then(res => {
        let arr = []
        // 递归菜单
        store.commit('menu/setMap', getChild(res, arr))
      })
    }
  }

  if (to.path !== '/') {
    let result = state.menu.labelArr.some(i => {
      return i.fullPath === to.fullPath
    })
    // console.log('path', to)
    if (!result) {
      // 非新建管理合计
      if (routerArr.has(to.path)) {
        let idx = state.menu.labelArr.findIndex(i => {
          return i.path === to.path
        })
        if (idx > -1) {
          let obj = {
            index: idx,
            to: to
          }
          updatFullPath(obj)
          return next()
        }
      }

      let title = ''
      if (to.query.hzxm) {
        title = to.query.hzxm + '360视图'
        let sameTitle = state.menu.labelArr.findIndex(i => {
          return title === i.title
        })
        if (sameTitle > -1) {
          let obj = {
            index: sameTitle,
            to: to
          }
          updatFullPath(obj)
          return next()
        }
      } 
      // else if (to.query.empi) {
      //   //empi患者详情 和empi拆分患者
      //   title = to.meta.title
      //   let sameTitle = state.menu.labelArr.findIndex(i => {
      //     return title === i.title
      //   })
      //   if (sameTitle > -1) {
      //     let obj = {
      //       index: sameTitle,
      //       to: to
      //     }
      //     updatFullPath(obj)
      //     return next()
      //   }
      // } 
      else {
        title = to.meta.title
      }
      let obj = {
        path: to.path,
        title: title,
        fullPath: to.fullPath,
        componentName: to.name,
        isActive: true,
        timestamp: new Date().getTime()
      }
      store.commit('menu/pushLabelArr', obj)
    } else {
      store.commit('menu/changeActiveLabel', to.fullPath)
    }
    store.commit('menu/setAcitveMenuPath', to.fullPath)
  }
  next()
})

function updatFullPath(obj) {
  store.commit('menu/updatFullPath', obj)
  store.commit('menu/changeActiveLabel', obj.to.fullPath)
  store.commit('menu/setAcitveMenuPath', obj.to.fullPath)
}

function getChild(data, arr) {
  if (_.isNEArray(data)) {
    data.forEach(i => {
      if (_.isNEArray(i.list)) {
        getChild(i.list, arr)
      } else {
        delete i.list
        arr.push(i)
      }
    })
  }
  return arr
}

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router
