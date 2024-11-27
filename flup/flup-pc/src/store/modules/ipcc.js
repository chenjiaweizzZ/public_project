export default {
  name: "ipcc",
  namespaced: true,
  state: {
    callOutNumber: null, //要呼叫的电话号
    isLogin: false, //是否是签入状态
  },
  getters: {
    getCallOutNumber(state) {
      return state.callOutNumber
    },
    getIsLogin(state) {
      return state.isLogin
    },
  },
  mutations: {
    changeCallOutNumber(state, callOutNumber) {
      state.callOutNumber = callOutNumber
      sessionStorage.setItem('callOutNumber', callOutNumber)
    },
    changeIsLogin(state, isLogin) {
      state.isLogin = isLogin
      sessionStorage.setItem('isLogin', isLogin)
    },
  }
}