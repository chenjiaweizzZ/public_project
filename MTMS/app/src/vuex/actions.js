import methods from "../methods";

export default {
    changeMainMenu: ({ commit }, mainMenu) => commit('CHANGE_MAIN_MENU', mainMenu),
    increaseZIndex: ({ commit }) => commit('INCREASE_MAX_ZINDEX'),
    showAlert: ({ commit }, prop) => {  //{msg, title, ok}
        let kv = prop;

        if (typeof kv === 'string') {
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

        if (typeof kv === 'string') {
            kv = {
                msg: kv
            };
        }
        commit('SHOW_TOAST', kv)
    },
    hideToast: ({ commit }) => commit('HIDE_TOAST'),
    setActions: ({ commit }, { k, v }) => commit('CHANGE_ACTIONFILTERS', { key: k, value: v }),
    setTurninfo: ({ commit }, { k, v }) => commit('CHANGE_TURNINFO', { key: k, value: v }),
    setSystype: ({ commit }, param) => commit('CHANGE_SYSTYPE', param),
    setSingindept: ({ commit }, param) => commit('CHANGE_SINGINDEPT', param),
    setTatistical: ({ commit }, { k, v }) => commit('CHANGE_TATISTICAL', { key: k, value: v }),
    setTurnstatus: ({ commit }, statusinfo) => commit('CHANGE_TURNSTATUS', statusinfo),
    setMenuType: ({ commit }, info) => commit('CHANGE_MENUTYPE', info),
    // 轮转手册
    setTurnManual: ({ commit }, { k, v }) => commit('CHANGE_TURNMANUAL', { key: k, value: v }),
    getRoleAuthority({ commit, state }, keyValue = []) {
        // keyValue: 想要获取权限的权限标识perms
        let temp = localStorage.getItem("oprateMenu")
        let authorityInfo = {}
        if (temp == "undefined" || temp == "" || temp == "null") {
            if (keyValue.length > 0 && state.listAppMenu.length == 0) {
                methods.postNew("/base/menu/listAppMenu?status=0&permission=1&order=1").done(res => {
                    let list = []
                    res.model.forEach(i => {
                        if (i.children != null) {
                            i.children.forEach(item => {
                                item.children != null ? list.push(...item.children) : ""
                            })
                        }
                    });
                    list.forEach(citem => {
                        keyValue.forEach(item => {
                            if (citem.perms == item) {
                                authorityInfo[item] = true
                            }
                        })
                    })
                    commit('setRoleAuthority', authorityInfo, res.model)
                })
            } else {
                let list = []
                state.listAppMenu.forEach(i => {
                    if (i.children != null) {
                        i.children.forEach(item => {
                            item.children != null ? list.push(...item.children) : ""
                        })
                    }
                });
                list.forEach(citem => {
                    keyValue.forEach(item => {
                        if (citem.perms == item) {
                            authorityInfo[item] = true
                        }
                    })
                })
                commit('setRoleAuthority', authorityInfo)
            }
        } else {
            let oprateMenu = JSON.parse(localStorage.getItem("oprateMenu"))
            oprateMenu && oprateMenu.forEach(item => {
                authorityInfo[item.perms] = true
            })
            commit('setRoleAuthority', authorityInfo)
        }
    }
}
