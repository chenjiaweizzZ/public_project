export default {
  namespaced: true,
  state: {
    dateList: [],//选择的日期
    outpatientOrHospital: [],//住院或者门诊模式
    currentHzid:"",
  },
  mutations: {
    SETDATELIST(state, payload) {
      state.dateList = payload
    },
    SETOUTPATIENTORHOSPITAL(state, payload) {
      state.outpatientOrHospital = payload
    },
    SETCURRENTHZID(state, payload) {
      state.currentHzid = payload 
    },
  },
  actions: {
    
  },
  getters: {}
}
