import _ from "@/utils";
export default {
  namespaced: true,
  state: {
    map: [],
    acitveMenuPath: '',
    labelArr: [],
  },
  mutations: {
    setMap(state, payload) {
      state.map = payload
    },
    initLabel(state, path) {
      // 筛选要初始化的页面
      let nativeItem = state.labelArr.find(i => {
        return i.path === path
      })
      // 过滤时间戳
      let homePage = state.labelArr.filter(i => {
        return i.timestamp >= nativeItem.timestamp
      })
      // 
      if (homePage.length === 1) {
        homePage[0].isActive = true
        state.acitveMenuPath = homePage[0].fullPath
      }
      state.labelArr = homePage
    },
    setAcitveMenuPath(state, payload) {
      state.acitveMenuPath = payload
    },

    changeActiveLabel(state, payload) {
      state.labelArr.forEach(i => {
        if (i.fullPath === payload) {
          i.isActive = true
          i.timestamp = new Date().getTime()
        } else {
          i.isActive = false
        }
      })
    },
    removeLabel(state, index) {
      state.labelArr.splice(index, 1)
    },
    removeLabelByPath(state, path) {
      let labelIndex = state.labelArr.findIndex(i => {
        return i.path === path
      })
      if (labelIndex > -1) {
        state.labelArr.splice(labelIndex, 1)
      }
    },
    // 添加标签
    pushLabelArr(state, payload) {
      state.labelArr.forEach(i => {
        i.isActive = false
      })
      state.labelArr.push(payload)
    },
    // 更新标签fullPath并更新时间戳
    updatFullPath(state, payload) {
      // const index = state.labelArr.findIndex(i => {
      //   return i.path === payload.path
      // })
      state.labelArr[payload.index].fullPath = payload.to.fullPath
      state.labelArr[payload.index].path = payload.to.path
      state.labelArr[payload.index].timestamp = new Date().getTime()
    }
  },
  actions: {
    
  },
  getters: {}
}
