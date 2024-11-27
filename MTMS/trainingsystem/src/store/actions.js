import { getCookie, post, get, getStorage } from "../config/util";
export default {
    initLogin({ commit }) {
        if (getCookie("uid")) {
            commit("initLogin", true);
        } else {
            commit("initLogin", false);
        }
    },
    checkToken({ commit }) {
        if (localStorage.token !== "" && localStorage.token !== null && localStorage.token !== undefined) {
            post("/usr/sessionidisvalid", {
                command: "usr/sessionidisvalid",
                uid: getCookie("uid"),
                sessionid: getCookie("sid")
            }).then(data => {
                if (data && (data.errcode == 9904 || data.errcode == 7)) {
                    commit("checkToken", false);
                }
            })
        } else {
            commit("checkToken", false);
        }
    },
    initUserRole({ commit }) {
        post("/role/queryrolebyuid", {
            command: "role/queryrolebyuid",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid")
        }).then(data => {
            if (data && data.errcode == 0) {
                commit("initUserRole", data.rolelist);
            }
        });
    },
    initDeptBase({ commit }, { id }) {
        post("/turn/queryTurnDeptList", {
            command: "turn/queryTurnDeptList",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            dept_id: id,
            type: 0
        }).then(data => {
            if (data && data.errcode == 0) {
                commit("initDeptBase", data.dept_list);
            }
        });
    },
    initSysType({ commit }) {
        let url = window.location.hash
        let type = url.split("#/")[1].split("/")[0]
        commit("initSysType", type);
    },
    initDeptRoom({ commit }, { id }) {
        post("/turn/queryTurnDeptList", {
            command: "turn/queryTurnDeptList",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            dept_id: id,
            type: 1
        }).then(data => {
            if (data && data.errcode == 0) {
                commit("initDeptRoom", data.dept_list);
            }
        });
    },
    initDeptIdList({ commit }) {
        return new Promise((resolve, reject) => {
            post("/dept/finddeptbytecid", {
                command: "dept/finddeptbytecid",
                sessionid: getCookie("sid"),
                loginid: getCookie("uid"),
                tecid: getCookie("uid")
            }).then(data => {
                if (data && data.errcode == 0) {
                    commit(
                        "initDeptIdList",
                        data.dept.map(item => {
                            return item.id;
                        })
                    );
                    resolve("");
                } else {
                    reject("");
                }
            });
        });
    },
    initMenuList({ commit, state }) {
        let moduleid = state.systemType;
        return new Promise((resolve, reject) => {
            post("/menus/querymenusbyuid", {
                command: "menus/querymenusbyuid",
                sessionid: getCookie("sid"),
                loginid: getCookie("uid"),
                uid: getCookie("uid"),
                moduleid: "escort",
                // moduleid: moduleid === 1 ? 'trainee' : 'turn'  //"turn"//internshipturn
            }).then((data) => {
                if (data && data.errcode == 0) {
                    let list = [];
                    data.resultlist.forEach(item => {
                        //    if (item.url.split("/").length > 1) {
                        list.push(item);
                        //    }
                    });
                    commit("initMenuList", list);
                    resolve("");
                }
            });
        });
    },
    initAppMenuList({ commit }) {

    },
    initDeptList({ commit }) {
        post("/turn/queryTurnDeptList", {
            command: "turn/queryTurnDeptList",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            dept_id: 99,
            type: 1
        }).then(data => {
            if (data && data.errcode == 0) {
                commit("initDeptList", data.dept_list);
            }
        });
    },
    initDeptBaseList({ commit }) {
        post("/turn/queryBaseList", {
            command: "turn/queryBaseList",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid")
        }).then(data => {
            if (data && data.errcode == 0) {
                commit("initDeptBaseList", data.base_list);
            }
        });
    },
    initGradeList({ commit }) {
        post("/turn/queryPeriodList", {
            command: "turn/queryPeriodList",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid")
        }).then(function (data) {
            if (data && data.errcode == 0) {
                commit("initGradeList", data.period_list);
            }
        });
    },
    initOptionList({ commit }, { type, idorder, mutation }) {
        post("/hr/querylevellist", {
            command: "hr/querylevellist",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            code: type,
            idorder: idorder,
        }).then(function (data) {
            if (data && data.errcode == 0) {
                commit(mutation, data.levellist);
            }
        });
    },

    //新增下拉列表
    initAllOptionListUG({ commit }, { type }) {
        let host = '';
        let port = '/traineestudent/queryDictionaryList';
        let url = host + port;
        post(url, {
            command: port.substr(1),
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            code: type,
        }).then((data) => {
            if (data && data.errcode == 0) {
                commit('initAllOption', { key: type, value: data.dic_list });
            }
        })
    },
    fillGradListUG({ commit }) {
        post('/turnbaseinfo/turnbaseinfolevel', {
            command: 'turnbaseinfo/turnbaseinfolevel',
            sessionid: getCookie('sid'),
            loginid: getCookie('uid'),
            code: 'turngrade'
        }).then((data) => {
            if (data && data.errcode == 0) {
                let list = JSON.parse(data.baseinfolevellist);
                commit('initGradListUG', list);
            }
        })
    },
    toinitHospitalInfour({ commit }) {
        post('/actionplanbase/getusermanagerdept', {
            command: 'actionplanbase/getusermanagerdept',
            sessionid: getCookie('sid'),
            loginid: getCookie('uid'),
            uid: getCookie('uid')
        }).then((data) => {
            if (data && data.errcode == 0) {
                let list = data.beanlist;
                commit('initHospitalInfour', list);
            }
        })
    },
    //导入错误信息提示
    showErrorImport({ commit }, info) {
        commit('setErrorImport', info);
    },
    showRuleSetting({ commit }, info) {
        commit('setRuleSetting', info)
    },
    //实习轮转/*小组*/
    internshipRotation({ commit }, { k, v }) {
        commit('setinternshipRotation', { key: k, value: v })
    },
    //智能排轮转分阶段
    initStagecount({ commit }, { k, v }) {
        commit('setStagecount', { key: k, value: v })
    },
    getRoleAuthority({ commit }) {
        let temp = getStorage("menuOperate")
        if (temp == "undefined" || temp == "" || temp == "null") {
            commit('setRoleAuthority', {})
        } else {
            let oprateMenu = JSON.parse(getStorage("menuOperate"))
            let authorityInfo = {}
            oprateMenu.forEach(item => {
                authorityInfo[item.perms] = true
            })
            commit('setRoleAuthority', authorityInfo)
        }

    },
    initSelectList({ commit }, { type }) {
        let typeArr = type.split(",")
        let data = {}
        typeArr.forEach(citem => {
            data[citem] = []
        })
        get(`/base/level/getByCodes?codes=${type}`).then(res => {
            if (res.resCode == 200) {
                res.model.forEach(item => {
                    typeArr.forEach(citem => {
                        if (item.code == citem) {
                            data[citem].push(item)
                        }
                    })

                })
                commit('setStuTypeList', data)
            } else {
                this.$message({
                    message: '请求查询信息失败',
                    type: 'error'
                });
            }

        })
    },

};
