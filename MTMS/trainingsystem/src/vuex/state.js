export default {
    menuHide: false,
    mainMenu: 'welcome',
    zIndex: 10050,
    maxZIndex: 10050,
    confirm: {
        show: false
    },
    alert: {
        show: false
    },
    loading: {
        show: false,
        msg: '加载中，请稍后... ',
        html: null
    },
    toast: {
        show: false,
        msg: '',
        timeout: 1500
    },

    loginUser: {},

    // 教学活动计划
    actionfilters: {
        reqnum: 10,
        historyreqnum: 10,
        base: '',
        technical: [],
        type: '',
        date: '',
        search: '',
        isself: true,
        showsearch: false,
        historytype: '',
        historydate: ''
    },

    // 轮转数据储存
    turninfo: {
        actionplanid: null,
        stuid: null,
        stuname: null,
        teachingid: null,
        signindata: null,
        workdate: null,
        districtname: null,
        deptname: null,
        deptid: null,
        status: null,
        businessid: null,
        planendtime: null,
        deptrole: null,
        // 2019-06-26 轮转详情id, type
        type: null,
        plandetailid: null
    },

    // 轮转手册信息
    turnManual: {
        turnTrainId: null, // 培训专业ID
        deptId: null, // 科室ID
        stdId: null, // 学生ID
        stage: null, // 轮转阶段 不分阶段为0
        caseName: null, // 病例病种名称 无子项
        caseDetailName: null, // 有子项的
        /** 2019-07-25 该需求 增加的 */
        turnId: null, // 轮转ID
    },

    //考勤角色
    systype: '',
    attendancetype: '',  //

    //考勤查看的科室
    singindept: '',

    //统计分析
    tatistcal: {
        systype: '',//住陪轮转 or 实习生
        role: '',//登陆的角色（管理者/科主任）
        dept: '',//当前查看的科室
        deptname: '',//当前查看的科室名称
        tab: 0,//当前查看的类型
        selecttime: '',//筛选的年份
        isback: 0,
        normal: '',//默认选择的节点
    },
    turnstatus: sessionStorage.getItem('ugTurnStatus') !== null ? sessionStorage.getItem('ugTurnStatus') : '',
    menutype: '', // 实习科秘；留学生科秘 ; 外院科秘
    topdeptname: '',
    topdeptid: '',

};
