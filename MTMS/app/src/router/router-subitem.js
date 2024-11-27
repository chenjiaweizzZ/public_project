const comprehensiveEvaluation = [
    {
        name: "performance_evaluation",
        path: "evaluation",
        component: () => import("../views/comprehensive/evaluation"),
    },
    {
        name: "performance_list",
        path: "list",
        component: () => import("../views/comprehensive/list"),
    },
    {
        name: "performance_edit",
        path: "edit",
        component: () => import("../views/comprehensive/edit"),
    },
]

const caseReview = [
    {
        name: "caseReviewHome",
        path: "caseReviewHome",
        component: () => import("../views/caseReview/caseReviewHome"),
        meta: { title: "病历审核" }
    },
    {
        name: "caseReviewDetail",
        path: "caseReviewDetail",
        component: () => import("../views/caseReview/caseReviewDetail"),
        meta: { title: "病历审核详情" }
    },
]

const graduateSummary = [
    // 学生 老师 科主任 填写评语页面
    {
        name: 'stuSummary',
        path: 'stuGraduateSummary',
        component: () => import('../views/graduateSummary/stuSummary.vue')
    },
    {
        name: 'directorAppraisal',
        path: 'directorAppraisal',
        component: () => import('../views/graduateSummary/graduateAppraisal.vue')
    }
]

const fdRotation = [
    {
        name: "fdRotation_secretary",
        path: "rotation_secretary",
        component: () => import("../views/rotation/secretary/rotation_secretary"),
    },
    // 出科审核
    {
        name: "fdRotation_OutExam",
        path: "fdRotation_OutExam",
        component: () => import("../views/rotation/secretary/rotation_exam"),
        meta: {
            title: "出科条件审核"
        }
    },
    // 出科审核详情
    {
        name: "fdRotation_OutExamDetail",
        path: "fdRotation_OutExamDetail",
        component: () => import("../views/rotation/secretary/rotation_exam_detail"),
        meta: {
            title: "出科条件审核记录"
        }
    },
    // 出科确认
    {
        name: "fdRotation_out_department",
        path: "rotation_out_department",
        component: () => import("../views/rotation/secretary/rotation_out_department"),
    },
    // 出科考试成绩
    {
        name: "fdRotation_out_department_score",
        path: "rotation_out_department_score",
        component: () => import("../views/rotation/secretary/rotation_out_department_score"),
    },
    // 住院医
    {
        name: "fdRotation_doctor",
        path: "rotation_doctor",
        component: () => import("../views/rotation/doctor/rotation_doctor"),
    },
    // 轮转计划查看
    {
        name: "fdRotation_doctor_plan",
        path: "rotation_doctor/plan",
        component: () => import("../views/rotation/doctor/rd_rotation_plan"),
    },
    // 计划列表中选择选修科室
    {
        name: "fdRotation_doctor_elective",
        path: "rotation_doctor/elective",
        component: () => import("../views/rotation/doctor/rd_elective_office"),
    },

    // 考勤查看
    {
        name: "fdRotation_doctor_singin",
        path: "rotation_doctor/singinlist",
        component: () => import("../views/rotation/singin/main"),
    },
    // 考勤分析
    {
        name: "fdRotation_doctor_analysis",
        path: "rotation_doctor/analysis",
        component: () => import("../views/rotation/singin/analysis"),
    },
    {
        name: "fdRotation_doctor_exam",
        path: "rotation_doctor/exam",
        component: () => import("../views/rotation/doctor/rd_check_exam"),
    },
    {
        name: "fdRotation_doctor_ckresult",
        path: "rotation_doctor/ck_result",
        component: () => import("../views/rotation/doctor/rd_ck_result"),
    },
    {
        name: "fdRotation_doctor_ckrecord",
        path: "rotation_doctor/ck_record",
        component: () => import("../views/rotation/doctor/rd_ck_record"),
        meta: { title: "成绩变更记录" }
    },
    {
        name: "fdRotation_doctor_exam_date",
        path: "rotation_doctor/date",
        component: () => import("../views/rotation/doctor/rd_evaluate_date"),
    },
    //陈家伟2022/7/14 轮转手册,日常评价,出科小结路由配置
    //新轮转手册
    {
        name: "fdRotation_doctor_turn_manual",
        path: "rotation_doctor/turn_manual",
        component: () => import("../views/rotation/doctor/rd_turn_manual"),
    },
    //新日常评价
    {
        name: "fdRotation_doctor_daily_eva",
        path: "rotation_doctor/daily_eva",
        component: () => import("../views/rotation/doctor/rd_daily_eva"),
    },
    // 新出科小节
    {
        name: "fdRotation_doctor_out_department_result",
        path: "rotation_doctor/out_department_result",
        component: () => import("../views/rotation/doctor/rd_out_department_result"),
    },
    {
        name: "fdRotation_doctor_evaluate",
        path: "rotation_doctor/evaluate",
        component: () => import("../views/rotation/doctor/rd_evaluate"),
    },
    {
        name: "fdRotation_medical_eva_detail",
        path: "rotation_doctor/medical_eva_deatil",
        component: () => import("../views/rotation/doctor/large_medical_eva_detail"),
        meta: {
            title: "评分详情"
        }
    },
    {
        name: "fdRotation_doctor_up_case",
        path: "rotation_doctor/up_case",
        component: () => import("../views/rotation/doctor/rd_up_case"),
        meta: {
            title: "病历详情"
        }
    },
    {
        name: "fdRotation_doctor_case_notitle",
        path: "rotation_doctor/case_notitle",
        component: () => import("../views/rotation/doctor/rd_case_detail_notitle"),
    },
    {
        name: "fdRotation_doctor_up_case_withbottom",
        path: "rotation_doctor/up_case_withbottom",
        component: () => import("../views/rotation/doctor/rd_up_case_withbottom"),
    },
    {
        name: "fdRotation_doctor_addedit_case",
        path: "rotation_doctor/addedit_case",
        component: () => import("../views/rotation/doctor/add_edit_case"),
    },
    {
        name: "fdRotation_doctor_case_detail",
        path: "rotation_doctor/case_detail",
        component: () => import("../views/rotation/doctor/rd_case_detail"),
        meta: { title: "病历详情" }
    },
    {
        name: "fdRotation_doctor_case_eva",
        path: "rotation_doctor/case_eva",
        component: () => import("../views/rotation/doctor/rd_case_eva"),
    },
    // 评价带教老师列表
    {
        name: "fdRotation_doctor_evaluatelist",
        path: "rotation_doctor/evaluatelist",
        component: () => import("../views/rotation/doctor/evaluate_doctor"),
    },
    // 评价带教老师
    {
        name: "fdRotation_doctor_evaluate_score",
        path: "rotation_doctor/score",
        component: () => import("../views/rotation/doctor/rd_evaluate_score"),
    },
    // 带教老师
    {
        name: "fdRotation_teacher",
        path: "rotation_teacher",
        component: () => import("../views/rotation/teacher/rotation_teacher"),
    },
    // 带教老师查询历史
    {
        name: "fdRotation_teacher_history",
        path: "rotation_teacher/history",
        component: () => import("../views/rotation/teacher/history_main"),
    },
    // 日常考核日期
    {
        name: "fdRotation_teacher_date",
        path: "rotation_teacher/date",
        component: () => import("../views/rotation/teacher/rd_teacher_date"),
    },
    // 日常考核详情查看
    {
        name: "fdRotation_teacher_detail",
        path: "rotation_teacher/detail",
        component: () => import("../views/rotation/teacher/rd_teacher_detail"),
    },
    // 带教老师日常考核住院医
    {
        name: "fdRotation_teacher_evaluate",
        path: "rotation_teacher/score",
        component: () => import("../views/rotation/teacher/rd_teacher_evaluate"),
    },
    // 护士长列表
    {
        name: "fdRotation_nurse",
        path: "rotation_nurse",
        component: () => import("../views/rotation/nurse/main"),
    },
    // 护士长评价
    {
        name: "fdRotation_nurse_evaluate",
        path: "rotation_nurse/evaluate",
        component: () => import("../views/rotation/nurse/nurse_evaluate"),
    },
    // 教学活动统计
    {
        name: "fdRotation_activity",
        path: "rotation_activity/main",
        component: () => import("../views/rotation/activity/main"),
    },
    // 教学活动统计list
    {
        name: "fdRotation_activitylist",
        path: "rotation_activity/list",
        component: () => import("../views/rotation/activity/list"),
    },
    // 教学活动统计详情
    {
        name: "fdRotation_activitydetail",
        path: "rotation_activity/detail",
        component: () => import("../views/rotation/activity/detail"),
    },
    // 年度考核
    {
        name: "fdRotation_examlist",
        path: "rotation_examlist/list",
        component: () => import("../views/rotation/queryExam_score/main"),
    },
    // 年度考核详情
    {
        name: "fdRotation_examdetail",
        path: "rotation_examdetail/detail",
        component: () => import("../views/rotation/queryExam_score/detail"),
    },
    // 考勤统计
    {
        name: "fdRotation_attendstatis",
        path: "rotation_attendstatis/list",
        component: () => import("../views/rotation/attend_statis/main"),
    },
    // 考勤统计查看
    {
        name: "fdRotation_attenddetail",
        path: "rotation_attendstatis/detail",
        component: () => import("../views/rotation/attend_statis/detail"),
    },
    // 科秘书科主任查看轮转计划中的报表查看
    {
        name: "fdRotation_reportlist",
        path: "report/list",
        component: () => import("../views/rotation/report/list"),
    },
    {
        name: "fdRotation_reporthistory",
        path: "report/history",
        component: () => import("../views/rotation/report/history"),
    },
    {
        //报表查看中查看具体的人数
        name: "fdRotation_reportdetail",
        path: "report/detail",
        component: () => import("../views/rotation/report/detail"),
    },
]

const fdExamRegistration =[
    {
        name: "fdDoctorRegistration", //住院医出科考试报名列表
        path: "doctor_registration",
        component: () => import("../views/registration/doctor/main"),
    },
    {
        name: "fdDoctorSignup", //住院医出科考试报名提交
        path: "doctor_signup",
        component: () => import("../views/registration/doctor/signup"),
    },
    {
        path: "secretary_signup",
        name: "secretary_signup", //住院医出科考试报名提交
        component: () => import("../views/registration/secretary/main"),
    },
    {
        name: "fdDoctorDetail", //住院医出科详情
        path: "docotor_detail",
        component: () => import("../views/registration/secretary/detail"),
    },
    {
        name: "entry_record", //录入成绩
        path: "entry_record",
        component: () => import("../views/entry_record/exam_results"),
    },
    
]


const fdAttendance = [
    {
        //考勤首页 // systype 区分  1住院医;  2本科生
        name: "fdAttendance_main",
        path: "main",
        component: () => import("../views/attendance/main"),
    },
    {
        //留学生-考勤首页
        name: "overseas_fdAttendance_main",
        path: "main",
        component: () => import("../views/attendance/main"),
    },
    {
        //外院-考勤首页
        name: "outerschool_fdAttendance_main",
        path: "main",
        component: () => import("../views/attendance/main"),
    },
    {
        //考勤历史
        name: "fdAttendance_history",
        path: "history",
        component: () => import("../views/attendance/history"),
    },
    {
        //考勤历史详情
        name: "fdAttendance_history_detail",
        path: "history_detail",
        component: () => import("../views/attendance/history_detail"),
    },
    {
        //考勤分析
        name: "fdAttendance_analysis",
        path: "analysis",
        component: () => import("../views/attendance/analysis"),
    },
]


const fdTatistical = [
    {
        //首页
        name: "fdTatistical_main",
        path: "main",
        component: () => import("../views/turn_tatistical/main"),
    },
    {
        //分析首页
        name: "fdTatistical_analysis",
        path: "analysis",
        component: () => import("../views/turn_tatistical/main_analysis"),
    },
    {
        //详情
        name: "fdTatistical_detail",
        path: "detail",
        component: () => import("../views/turn_tatistical/main_detail"),
    },
]

const base_audit = [
    {
        name: "audit_evaluation_list",
        path: "list",
        component: () => import("../views/base_audit/list"),
    },
    {
        name: "audit_evaluation",
        path: "audit",
        component: () => import("../views/base_audit/audit"),
    },
    {
        name: "base_dentify_main_list",
        path: "dentify_main",
        component: () => import("../views/base_audit/dentify_main"),
    },
]

const office_audit = [
    {
        name: "office_performance_evaluation",
        path: "list",
        component: () => import("../views/office_audit/list"),
    },
    {
        name: "dentify_main_list",
        path: "dentify_main",
        component: () => import("../views/office_audit/dentify_main"),
    },
]

const fdDirector = [
    {
        name: "fdRotation_secretary_director",
        path: "rotation_secretary",
        component: () => import("../views/rotation_director/secretary/rotation_secretary"),
    },
    // 住院医
    {
        name: "fdRotation_doctor_director",
        path: "rotation_doctor",
        component: () => import("../views/rotation_director/doctor/rotation_doctor"),
    },
    // 轮转计划查看
    {
        name: "fdRotation_doctor_plan_director",
        path: "rotation_doctor/plan",
        component: () => import("../views/rotation_director/doctor/rd_rotation_plan"),
    },
    // 考勤查看
    {
        name: "fdRotation_doctor_singin_director",
        path: "rotation_doctor/singinlist",
        component: () => import("../views/rotation_director/singin/main"),
    },
    // 考勤分析
    {
        name: "fdRotation_doctor_analysis_director",
        path: "rotation_doctor/analysis",
        component: () => import("../views/rotation_director/singin/analysis"),
    },
    {
        name: "fdRotation_doctor_exam_director",
        path: "rotation_doctor/exam",
        component: () => import("../views/rotation_director/doctor/rd_check_exam"),
    },
    {
        name: "fdRotation_doctor_ckresult_director",
        path: "rotation_doctor/ck_result",
        component: () => import("../views/rotation_director/doctor/rd_ck_result"),
    },
    {
        name: "fdRotation_doctor_exam_date_director",
        path: "rotation_doctor/date",
        component: () => import("../views/rotation_director/doctor/rd_evaluate_date"),
    },
    // 日常评价
    {
        name: "fdRotation_doctor_evaluate_director",
        path: "rotation_doctor/evaluate",
        component: () => import("../views/rotation_director/doctor/rd_evaluate"),
    },
    // 评价带教老师列表
    {
        name: "fdRotation_doctor_evaluatelist_director",
        path: "rotation_doctor/evaluatelist",
        component: () => import("../views/rotation_director/doctor/evaluate_doctor"),
    },
    // 评价带教老师
    {
        name: "fdRotation_doctor_evaluate_score_director",
        path: "rotation_doctor/score",
        component: () => import("../views/rotation_director/doctor/rd_evaluate_score"),
    },
    // 带教老师
    {
        name: "fdRotation_teacher_director",
        path: "rotation_teacher",
        component: () => import("../views/rotation_director/teacher/rotation_teacher"),
    },
    // 带教老师查询历史
    {
        name: "fdRotation_teacher_history_director",
        path: "rotation_teacher/history",
        component: () => import("../views/rotation_director/teacher/history_main"),
    },
    // 日常考核日期
    {
        name: "fdRotation_teacher_date_director",
        path: "rotation_teacher/date",
        component: () => import("../views/rotation_director/teacher/rd_teacher_date"),
    },
    // 日常考核详情查看
    {
        name: "fdRotation_teacher_detail_director",
        path: "rotation_teacher/detail",
        component: () => import("../views/rotation_director/teacher/rd_teacher_detail"),
    },
    // 带教老师日常考核住院医
    {
        name: "fdRotation_teacher_evaluate_director",
        path: "rotation_teacher/score",
        component: () => import("../views/rotation_director/teacher/rd_teacher_evaluate"),
    },
    // 护士长列表
    {
        name: "fdRotation_nurse_director",
        path: "rotation_nurse",
        component: () => import("../views/rotation_director/nurse/main"),
    },
    // 护士长评价
    {
        name: "fdRotation_nurse_evaluate_director",
        path: "rotation_nurse/evaluate",
        component: () => import("../views/rotation_director/nurse/nurse_evaluate"),
    },
    // 教学活动统计
    {
        name: "fdRotation_activity_director",
        path: "rotation_activity/main",
        component: () => import("../views/rotation_director/activity/main"),
    },
    // 教学活动统计list
    {
        name: "fdRotation_activitylist_director",
        path: "rotation_activity/list",
        component: () => import("../views/rotation_director/activity/list"),
    },
    // 教学活动统计详情
    {
        name: "fdRotation_activitydetail_director",
        path: "rotation_activity/detail",
        component: () => import("../views/rotation_director/activity/detail"),
    },
    // 年度考核
    {
        name: "fdRotation_examlist_director",
        path: "rotation_examlist/list",
        component: () => import("../views/rotation_director/queryExam_score/main"),
    },
    // 年度考核详情
    {
        name: "fdRotation_examdetail_director",
        path: "rotation_examdetail/detail",
        component: () => import("../views/rotation_director/queryExam_score/detail"),
    },
    // 考勤统计
    {
        name: "fdRotation_attendstatis_director",
        path: "rotation_attendstatis/list",
        component: () => import("../views/rotation_director/attend_statis/main"),
    },
    // 考勤统计查看
    {
        name: "fdRotation_attenddetail_director",
        path: "rotation_attendstatis/detail",
        component: () => import("../views/rotation_director/attend_statis/detail"),
    },
    // 科秘书科主任查看轮转计划中的报表查看
    {
        name: "fdRotation_reportlist_director",
        path: "report/list",
        component: () => import("../views/rotation_director/report/list"),
    },
    {
        name: "fdRotation_reporthistory_director",
        path: "report/history",
        component: () => import("../views/rotation_director/report/history"),
    },
    {
        //报表查看中查看具体的人数
        name: "fdRotation_reportdetail_director",
        path: "report/detail",
        component: () => import("../views/rotation_director/report/detail"),
    },
]

const extranceExam=
    [
        {
            name: 'extranceExamlist',
            path: 'list',
            component: () => import('../views/extranceExam/list')
        },
        {
            name: 'extranceExamcreate',
            path: 'create',
            component: () => import('../views/extranceExam/createNew')
        },
        {
            name: 'extranceExamcreateNew',
            path: 'createNew',
            component: () => import('../views/extranceExam/createNew')
        },
        {
            name: 'examiner',
            path: 'examiner',
            component: () => import('../views/extranceExam/examiner')
        },
        {
            name: 'scoreSheet',
            path: 'scoreSheet',
            component: () => import('../views/extranceExam/scoreSheet')
        },
        {
            name: 'scoreSheetZh',
            path: 'scoreSheetZh',
            component: () => import('../views/extranceExam/scoreSheetZh')
        },
        {
            name: 'signature',
            path: 'signature',
            component: () => import('../views/extranceExam/signature')
        },
        {
            name: 'recordfeedback',
            path: 'recordfeedback',
            component: () => import('../views/extranceExam/recordfeedback')
        },
        {
            name: 'assessmentpage',
            path: 'assessmentpage',
            component: () => import('../views/extranceExam/assessmentpage')
        },
        {
            name: 'assessmentdetail',
            path: 'assessmentdetail',
            component: () => import('../views/extranceExam/assessmentdetail')
        },
        {
            name: 'comprehensivesheet',
            path: 'comprehensivesheet',
            component: () => import('../views/extranceExam/comprehensivesheet')
        },
        {
            name: 'averagepage',
            path: 'averagepage',
            component: () => import('../views/extranceExam/averagepage')
        },
        {
            name: 'averagepagerelation',
            path: 'averagepagerelation',
            component: () => import('../views/extranceExam/averagepagerelation')
        },
        {
            name: 'scoresheetPreview',
            path: 'scoresheetPreview',
            component: () => import('../views/extranceExam/scoresheetPreview')
        },
        
    ]

    const turnManual = [
        {
            name: 'caseInfoList',
            path: 'list',
            component: () => import('../views/turnManual/caseInfoList.vue')
        },
        {
            name: 'createCaseInfo',
            path: 'create',
            component: () => import('../views/turnManual/createCaseInfo.vue')
        },
        {
            name: 'caseDetailList',
            path: 'detailList',
            component: () => import('../views/turnManual/caseDetailList.vue')
        },
        /**
         * 轮转手册 审核老师
         */
        {
            name: 'checkTeaList',
            path: 'checkTeaList',
            component: () => import('../views/turnManual/checkTeaList.vue')
        },
        {
            name: 'historyCheckTeaList',
            path: 'historyCheckTeaList',
            component: () => import('../views/turnManual/historyCheckTeaList.vue')
        },
        {
            name: 'checkTeaDetail',
            path: 'checkTeaDetail',
            component: () => import('../views/turnManual/checkTeaDetail.vue')
        },
        /**
         * 科密或者非学生 查看学生通过审核的病例列表
         */
        {
            name: 'checkList',
            path: 'checkList',
            component: () => import('../views/turnManual/checkList.vue')
        }
    ]
    const overseer = [
        //督导评分
        {
            name: "grade",
            path: "grade",
            component: () => import("../views/overseer/grade"),
        },
        //督导反馈
        {
            name: "couple_back",
            path: "couple_back",
            component: () => import("../views/overseer/couple_back"),
        },
        //督导反馈详情
        {
            name: "couple_back_item_list",
            path: "couple_back_item_list",
            component: () => import("../views/overseer/couple_back_item_list"),
        },
        //督导反馈照片预览
        {
            name: "pic_view",
            path: "pic_view",
            component: () => import("../views/overseer/pic_view"),
        },
        //活动详情
        {
            name: "activity_detail",
            path: "activity_detail",
            component: () => import("../views/overseer/activity_detail"),
        },
        //督导评分
        {
            name: "overseer_grade",
            path: "overseer_grade",
            component: () => import("../views/overseer/overseer_grade"),
        },
        //照片上传
        {
            name: "pic_upload",
            path: "pic_upload",
            component: () => import("../views/overseer/pic_upload"),
        },
        //查看反馈
        {
            name: "feedback_view",
            path: "feedback_view",
            component: () => import("../views/overseer/feedback_view"),
        },
        // 督导反馈列表查看反馈
        {
            name: "back_list_item",
            path: "back_list_item",
            component: () => import("../views/overseer/back_list_item"),
        },
        // 反馈
        {
            name: "item_fk",
            path: "item_fk",
            component: () => import("../views/overseer/item_fk"),
        },
    ]
    const fdAction = [
        {
            //活动计划列表
            name: "fdAction_list",
            path: "main/list",
            component: () => import("../views/action_plan/plan_list"),
        },
        {
            //活动计划历史
            name: "fdAction_history",
            path: "main/history",
            component: () => import("../views/action_plan/history"),
        },
        {
            //活动计划详情
            name: "fdAction_detail",
            path: "main/detail",
            component: () => import("../views/action_plan/detail"),
        },
        {
            //活动计划新增
            name: "fdAction_add",
            path: "main/add",
            component: () => import("../views/action_plan/new_plan"),
        },
        {
            //活动计划编辑
            name: "fdAction_edit",
            path: "main/edit",
            component: () => import("../views/action_plan/edit"),
        },
        {
            //教学活动统计
            name: "fdAction_census",
            path: "main/census",
            component: () => import("../views/action_plan/census/census"),
        },
        {
            //教学活动评价
            name: "fdAction_tickling",
            path: "main/tickling",
            component: () => import("../views/action_plan/to_tickling"),
        },
    ]
export {
    comprehensiveEvaluation,
    caseReview,
    graduateSummary,
    fdRotation,
    fdExamRegistration,
    fdAttendance,
    fdTatistical,
    base_audit,
    office_audit,
    fdDirector,
    extranceExam,
    turnManual,
    overseer,
    fdAction
}