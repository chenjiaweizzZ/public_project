export default {
  namespaced: true,
  state: {
    patientInfo:''
  },
  mutations: {
    SET_PATIENTINFO(state, payload) {
      state.patientInfo = payload
    },
  },
  actions: {},
  getters: {}
}
