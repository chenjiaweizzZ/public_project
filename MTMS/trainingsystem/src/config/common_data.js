import { post, getCookie } from './util';

// 用于获取 bind select data 通用接口
const api = {
    /**
     * 出科考核
     */

    // 获取考核级别
    getExamCategory() {
        return new Promise((resolve, reject) => {
            post('/turnExamInfo/getturnexamlevel', {
                command: 'turnExamInfo/getturnexamlevel',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    resolve(data.turnexamlevellist);
                }
            }).catch(function (error) {
                reject(error);
            })
        })
    },
    // 获取考核级别对应基地,科室,中南医院
    getCategoryList() {
        return new Promise((resolve, reject) => {
            post('/actionplanbase/getusermanagerdept', {
                command: 'actionplanbase/getusermanagerdept',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
                paramcode: "actionplanaddroles",
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch(function (error) {
                reject(error);
            })
        })
    },
    getCategoryListUg() {
        return new Promise((resolve, reject) => {
            post('/actionplanbase/getusermanagerdept', {
                command: 'actionplanbase/getusermanagerdept',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch(function (error) {
                reject(error);
            })
        })
    },
    // 获取基地下拉列表数据
    getbaseidList() {
        return new Promise((resolve, reject) => {
            post('/turnbaseinfo/getusermanagerdepttree', {
                command: 'turnbaseinfo/getusermanagerdepttree',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                uid: getCookie('uid'),
            }).then(function (data) {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch(function (error) {
                reject(data);
            })
        })
    },

    // 获取考核项目
    getExamItems(id, examitemtype) {
        return new Promise((resolve, reject) => {
            post('/turnannualresult/queryexamitemlist', {
                command: 'turnannualresult/queryexamitemlist',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                examitemname: "",
                status: "",
                pagenum: "",
                pagepersize: "",
                deptList: id,
                sysType: 1,
                examitemtype: examitemtype
            }).then((data) => {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch((error) => {
                reject(error)
            })
        })
    },

    // 获取考官
    getExamer(id, info) {
        return new Promise((resolve, reject) => {
            post('/turnExamInfo/queryexaminerlist', {
                command: 'turnExamInfo/queryexaminerlist',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                dept_id: id,
                search_info: info
            }).then((data) => {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch((error) => {
                reject(error);
            })
        })
    },
    // 实习生获取考官
    getExamerUg(id, info) {
        return new Promise((resolve, reject) => {
            post('/traineeexam/queryexaminerlist', {
                command: 'traineeexam/queryexaminerlist',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                dept_id: id,
                search_info: info
            }).then((data) => {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch((error) => {
                reject(error);
            })
        })
    },
    // 新接口实习生获取考官
    getNewExamerUg(id) {
        return new Promise((resolve, reject) => {
            post('/base/teachers/listExaminer', {
                deptId: id,
                teachingType: 5085
            }).then((data) => {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch((error) => {
                reject(error);
            })
        })
    },

    // 获取考核学生
    // 获取考核学生
    getExamStudents(id, type, level, Addparams) {
        var option = {};
        if (level == 0) {
            option = {
                deptIdList: Addparams.deptIdList.length > 0 ? Addparams.deptIdList : id,
                examtype: type,
            }
        }

        if (level == 1) {
            option = {
                baseIdList: Addparams.deptIdList.length > 0 ? Addparams.deptIdList : id,
                examtype: type,
            }
        }
        if (Addparams.turnExamId) {
            option.turnExamId = Addparams.turnExamId
        }
        return new Promise((resolve, reject) => {
            post('/turnExamInfo/queryexamineelist', {
                command: 'turnExamInfo/queryexamineelist',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                keyword: Addparams.keyword,
                planBeginTime: Addparams.planBeginTime,
                planEndTime: Addparams.planEndTime,
                ...option
            }).then((data) => {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch((error) => {
                reject(error)
            })
        })
    },

    // 查询出科考核详情
    getExamDetails(id) {
        return new Promise((resolve, reject) => {
            post('/turnExamInfo/turnexamdetail', {
                command: 'turnExamInfo/turnexamdetail',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                id: id
            }).then((data) => {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch((error) => {
                reject(error)
            })
        });
    },
    // 实习生查询出科考核详情
    getExamDetailsUg(id, key) {
        return new Promise((resolve, reject) => {
            post('/traineeexam/detail', {
                command: 'traineeexam/detail',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                id: id,
                examType: key
            }).then((data) => {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch((error) => {
                reject(error)
            })
        });
    },

    // 获取所以的科室
    getAllDeptList() {
        return new Promise((resolve, reject) => {
            post('/turn/queryTurnDeptList', {
                command: 'turn/queryTurnDeptList',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                dept_id: 99,
                type: 1
            }).then((data) => {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch((error) => {
                reject(error)
            })
        });
    },

    /**
     * 轮转手册
     */

    // 病例病种列表查询
    queryCases() {
        return new Promise((resolve, reject) => {
            post('/turnManual/queryTurnManualManage', {
                command: 'turnManual/queryTurnManualManage',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
            }).then((data) => {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch((error) => {
                reject(error)
            });
        });
    },

    // 病种设置 mark 0禁用 1删除 2启用
    disabledOrDelCase(id, type) {
        return new Promise((resolve, reject) => {
            post('/turnManual/deleteOrBanTurnManualDisease', {
                command: 'turnManual/deleteOrBanTurnManualDisease',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                id: id,
                mark: type,
            }).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        });
    },

    // 获取病例病种设置 当前病种选中科室ID
    getCheckDeptList(manageId, id) {
        return new Promise((resolve, reject) => {
            post('/turnManual/queryTurnManualManageDept', {
                command: 'turnManual/queryTurnManualManageDept',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                manageId: manageId,
                id: id,
            }).then((data) => {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch((error) => {
                reject(error)
            });
        });
    },

    // 查询病种设置dialog列表
    getCaseSettingList(id) {
        return new Promise((resolve, reject) => {
            post('/turnManual/queryTurnManualDiseaseItem', {
                command: 'turnManual/queryTurnManualDiseaseItem',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                id: id
            }).then((data) => {
                if (data && data.errcode == 0) {
                    resolve(data);
                }
            }).catch((error) => {
                reject(error)
            });
        });
    },

    /**
     * 出科小结
     */
    // 查询出科小结信息
    getTurnAppraise(turnId, detailId) {
        return new Promise((resolve, reject) => {
            post('/turnAppraise/queryTurnAppraise', {
                command: 'turnAppraise/queryTurnAppraise',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                turnId: turnId,
                roleId: 2,
                detailId: detailId
            }).then(data => {
                if (data && data.errcode == 0) {
                    resolve(data.result);
                }
            }).catch(error => {
                reject(error);
            })
        })
    },
}

export default api
