import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import project from './modules/project'

Vue.use(Vuex)

const storeModules = require.context('./modules', false, /\.js$/)
let obj = {}
// modules自动注册到store中
storeModules.keys().forEach(currentPath => {
  let str = currentPath.match(/\/(\S*)\.js/)[1]
  obj = {
    ...obj,
    [str]: storeModules(currentPath).default
  }
})

export default new Vuex.Store({
  modules: {
    ...obj
  },
  plugins: [
    createPersistedState({
      // vuex的部分数据持久化到sessionStorage中
      storage: sessionStorage,
      reducer: val => {
        // 需要持久化的数据
        return {
          user: {
            token: val.user.token
          },
          menu: {
            map: val.menu.map,
            acitveMenuPath: val.menu.acitveMenuPath,
            labelArr: val.menu.labelArr
          },
          project:{
            patientInfo:val.project.patientInfo
          },
          commonMode: {
            dateList: val.commonMode.dateList,
            currentHzid:val.commonMode.currentHzid,
            outpatientOrHospital:val.commonMode.outpatientOrHospital
          },
          SQLConfig: {
            apiData: val.SQLConfig.apiData
          }
        }
      }
    })
  ]
})
