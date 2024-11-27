export default {
  namespaced: true,
  state: {
    apiData: {}
  },
  mutations: {
    SETAPIDATA(state, payload) {
      state.apiData = payload
    }
  },
  actions: {},
  getters: {}
}
