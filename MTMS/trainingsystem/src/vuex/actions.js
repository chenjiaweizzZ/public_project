
export default {
    changeMainMenu: ({ commit }, mainMenu) => commit('CHANGE_MAIN_MENU', mainMenu),
    increaseZIndex: ({ commit }) => commit('INCREASE_MAX_ZINDEX'),
    showAlert: ({ commit }, prop) => {  //{msg, title, ok}
        let kv = prop;

        if(typeof kv === 'string') {
            kv = {
                msg: kv
            };
        }

        commit('SHOW_ALERT', kv);
    },
    hideAlert: ({ commit }) => commit('HIDE_ALERT'),
    showConfirm: ({ commit }, prop) => {    // {msg, title, ok, cancel}
        commit('SHOW_CONFIRM', prop)
    },
    hideConfirm: ({ commit }) => commit('HIDE_CONFIRM'),
    showLoading: ({ commit }, msg, html) => commit('SHOW_LOADING', msg),
    hideLoading: ({ commit }) => commit('HIDE_LOADING'),
    toast: ({ commit }, param) => {

        let kv = param;

        if(typeof kv === 'string') {
            kv = {
                msg: kv
            };
        }
        commit('SHOW_TOAST', kv)
    },
    hideToast: ({ commit }) => commit('HIDE_TOAST'),
    setActions: ({ commit }, {k,v}) => commit('CHANGE_ACTIONFILTERS',{key:k,value:v}),
    setTurninfo: ({ commit }, {k,v}) => commit('CHANGE_TURNINFO',{key:k,value:v}),
    setSystype: ({ commit }, param) => commit('CHANGE_SYSTYPE',param),
    setSingindept: ({ commit }, param) => commit('CHANGE_SINGINDEPT',param),
    setTatistical: ({ commit }, {k,v}) => commit('CHANGE_TATISTICAL',{key:k,value:v}),
    setTurnstatus:({commit},statusinfo)=>commit('CHANGE_TURNSTATUS',statusinfo),
    setMenuType:({commit},info)=>commit('CHANGE_MENUTYPE',info),
    // 轮转手册
    setTurnManual:({commit}, {k, v}) => commit('CHANGE_TURNMANUAL', {key: k, value: v})
}
