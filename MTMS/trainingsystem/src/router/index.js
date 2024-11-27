import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/:escort',
            component: () => import("@/page/index"),
            children: [

                {
                    path: "mainIndex",
                    name: "mainIndex",
                    component: () => import("@/page/mainIndex/index")
                },
                {
                    path: "scoringTemplate",
                    name: "scoringTemplate",
                    meta: { title: '评分模板管理' },
                    component: () => import("@/page/template/scoringTemplate"),
                },
                {
                    //课程表
                    path: 'tableCourse',
                    name: 'tableCourse',
                    component: () => import('@/page/mainIndex/tableCourse')
                },
                {
                    path: 'evaluationQuery',
                    name: 'evaluationQuery',
                    meta: { title: '带教考核状态查询' },
                    component: () => import("@/page/otherAssessment/evaluationQuery"),
                },
                {
                    path: "addScoreTemplate",
                    name: "addScoreTemplate",
                    meta: { title: '新增评分模板' },
                    component: () => import("@/page/template/addScoreTemplate"),
                },
                {
                    path: 'circlePlan',
                    name: 'circlePlan',
                    meta: { title: '轮转计划' },
                    component: () => import("@/page/circleManage/circlePlan"),
                    children: [
                        {
                            path: 'intelligentPreview',
                            name: 'intelligentPreview',
                            meta: {
                                title: '智能排轮转结果预览'
                            },
                            component: () => import('@/page/circleManage/intelligentPreview')
                        }
                    ]

                },
                {
                    path: 'circlePlanDetail/:plan_id',
                    name: 'CirclePlanDetail',
                    meta: { title: '轮转计划详情' },
                    component: () => import('@/page/circleManage/circlePlanDetail')
                },
                {
                    path: 'circleManage',
                    name: 'circleManage',
                    meta: { title: '轮转进度查询' },
                    component: () => import('@/page/circleManage/circleManage')
                },
                {
                    path: 'turnPlanDetailCount',
                    name: 'turnPlanDetailCount',
                    meta: { title: '轮转视图' },
                    component: () => import('@/page/circleManage/turnPlanDetailCount')
                },
                {
                    path: 'queryTurnAppraise',
                    name: 'queryTurnAppraise',
                    meta: { title: '出科小结查看' },
                    component: () => import('@/page/circleManage/graduateSummary')
                },
                {
                    path: 'trainingsetting',
                    name: 'trainingsetting',
                    meta: { title: '培训方案设置' },
                    component: () => import('@/page/circleManage/trainingsetting')
                },
                {
                    path: 'turnManualSeting',
                    name: 'turnManualSeting',
                    meta: { title: '轮转手册设置' },
                    component: () => import('@/page/rotationManual/turnManualSeting')
                },
                {
                    path: 'rotationrulesetting',
                    name: 'rotationrulesetting',
                    meta: { title: '智能排轮转规则设置' },
                    component: () => import('@/page/circleManage/rotationrulesetting')
                },
                {
                    path: 'circleSetting',
                    name: 'circleSetting',
                    meta: { title: '出科设置' },
                    component: () => import('@/page/circleManage/circleSetting')
                },
                {
                    path: 'graduatExamineRecords',
                    name: 'graduatExamineRecords',
                    meta: { title: '出科条件审核记录' },
                    component: () => import('@/page/circleManage/graduatExamineRecords')
                },
                {
                    path: 'queryTurnManual',
                    name: 'turnManual',
                    meta: { title: '轮转手册查看' },
                    component: () => import('@/page/rotationManual/turnManual')
                },
                {
                    path: 'medicalRecordmanage',
                    name: 'medicalRecordmanage',
                    meta: { title: '病历病种管理' },
                    component: () => import('@/page/rotationManual/medicalRecordmanage')
                },
                {
                    path: 'medicalRecordSeting',
                    name: 'medicalRecordSeting',
                    meta: { title: '病历病种设置' },
                    component: () => import('@/page/rotationManual/medicalRecordSeting')
                },
                {
                    path: 'turnManualTeaCheck',
                    name: 'turnManualTeaCheck',
                    meta: { title: '轮转手册审核（带教）' },
                    component: () => import('@/page/rotationManual/turnManualTeaCheck')
                },
                {
                    path: 'turnManualStdWrite',
                    name: 'turnManualStdWrite',
                    meta: { title: '轮转手册填写(学员)' },
                    component: () => import('@/page/rotationManual/turnManualStd'),
                    children: [
                        {
                            path: 'writeDetail',
                            name: 'writeDetail',
                            meta: { title: '轮转手册填写' },
                            component: () => import('@/page/rotationManual/turnManualStdWrite')
                        }
                    ]
                },
                {
                    path: 'evaluationResidentDoctor',
                    name: 'evaluationResidentDoctor',
                    meta: { title: '带教评价护陪生' },
                    component: () => import('@/page/evaluation/evaluationResidentDoctor')
                },
                {
                    path: 'evaluationForHeadNurse',
                    name: 'evaluationForHeadNurse',
                    meta: { title: '护士长评价护陪生' },
                    component: () => import('@/page/evaluation/evaluationForHeadNurse')
                },
                {
                    path: 'evaluationTeachingTeacher',
                    name: 'evaluationTeachingTeacher',
                    meta: { title: '护陪生评价带教' },
                    component: () => import('@/page/evaluation/evaluationTeachingTeacher')
                },
                {
                    path: 'evaluationDoctorOffice',
                    name: 'evaluationDoctorOffice',
                    meta: { title: '评价科室' },
                    component: () => import('@/page/evaluation/evaluationDoctorOffice')
                },
                {
                    path: 'evaluationDoctorOfficeDetail',
                    name: 'evaluationDoctorOfficeDetail',
                    meta: { title: '护陪生评价科室明细' },
                    component: () => import('@/page/evaluation/evaluationDoctorOfficeDetail')
                },
                {
                    path: '360Report',
                    name: '360Report',
                    meta: { title: '360评估报告' },
                    component: () => import('@/page/evaluation/360Report')
                },
                {
                    path: '360ReportDetail',
                    name: '360ReportDetail',
                    meta: { title: '360评估报告' },
                    component: () => import('@/page/evaluation/360ReportDetail')
                },
                {
                    path: 'teachingActivityplan',
                    name: 'teachingActivityplan',
                    meta: { title: '教学活动计划' },
                    component: () => import('@/page/teachingActivityManage/teachingActivityplan')
                },
                {
                    path: 'departmentActivityStatistics',
                    name: 'departmentActivityStatistics',
                    meta: { title: '科室活动统计' },
                    component: () => import('@/page/teachingActivityManage/departmentActivityStatistics')
                },
                {
                    path: 'studentActivityStatistics',
                    name: 'studentActivityStatistics',
                    meta: { title: '学生活动统计' },
                    component: () => import('@/page/teachingActivityManage/studentActivityStatistics')
                },
                {
                    path: 'teacherActivitieStatistics',
                    name: 'teacherActivitieStatistics',
                    meta: { title: '教师活动统计' },
                    component: () => import('@/page/teachingActivityManage/teacherActivitieStatistics')
                },
                {
                    path: 'patroldeptfrequency',
                    name: 'patroldeptfrequency',
                    meta: { title: '巡查科次统计' },
                    component: () => import('@/page/teachingActivityManage/patroldeptfrequency')
                },
                {
                    path: 'teachingrounds',
                    name: 'teachingrounds',
                    meta: { title: '巡查评分明细' },
                    component: () => import('@/page/teachingActivityManage/teachingrounds')
                },
                {
                    path: 'yearResultInquiry',
                    name: 'yearResultInquiry',
                    meta: { title: '年度成绩查询' },
                    component: () => import('@/page/otherAssessment/yearResultInquiry')
                },
                {
                    path: 'graduationExamination',
                    name: 'graduationExamination',
                    meta: { title: '结业考成绩查询' },
                    component: () => import('@/page/otherAssessment/graduationExamination')
                },
                {
                    path: 'residentDoctoRevaluation',
                    name: 'residentDoctoRevaluation',
                    meta: { title: '护培生考核状态查询' },
                    component: () => import('@/page/otherAssessment/residentDoctoRevaluation')
                },
                {
                    path: 'recruitMange',
                    name: 'recruitMange',
                    meta: { title: '招录管理' },
                    component: () => import('@/page/recruitMange/recruitMange')
                },
                {
                    path: 'enrollDetail',
                    name: 'enrollDetail',
                    meta: { title: '招录详情' },
                    component: () => import('@/page/recruitMange/enrollDetail')
                },
                {
                    path: 'addRecruit',
                    name: 'addRecruit',
                    component: () => import('@/page/recruitMange/addRecruit')
                },
                {
                    path: 'previewRecrit',
                    name: 'previewRecrit',
                    component: () => import('@/page/recruitMange/previewRecrit')
                },
                {
                    path: 'graduationMange',
                    name: 'graduationMange',
                    meta: { title: '结业管理' },
                    component: () => import('@/page/recruitMange/graduationMange')

                },
                {
                    path: 'personal_evaluation',
                    name: 'personal_evaluation',
                    meta: { title: '个人综合考评' },
                    component: () => import('@/page/comprehensiveAssessment/personal_evaluation')
                },
                {
                    path: 'personal_detail',
                    name: 'personal_detail',
                    meta: { title: '个人综合考评明细' },
                    component: () => import('@/page/comprehensiveAssessment/personal_detail')
                },
                {
                    path: 'doctorAttendanceStatistics',
                    name: 'doctorAttendanceStatistics',
                    meta: { title: '护培生考勤统计' },
                    component: () => import('@/page/attendanceManagement/doctorAttendanceStatistics')
                },
                {
                    path: 'doctorAttendanceCheck',
                    name: 'doctorAttendanceCheck',
                    meta: { title: '护培生考勤明细查看' },
                    component: () => import('@/page/attendanceManagement/doctorAttendanceCheck')
                },
                {
                    path: 'leaveManage',
                    name: 'leaveManage',
                    meta: { title: '请假管理' },
                    component: () => import('@/page/attendanceManagement/leaveManage')
                },
                {
                    path: 'officeAttendanceStatistics',
                    name: 'officeAttendanceStatistics',
                    meta: { title: '科室考勤统计' },
                    component: () => import('@/page/attendanceManagement/officeAttendanceStatistics')
                },
                {
                    path: 'report',
                    name: 'report',
                    meta: { title: '统计报表' },
                    component: () => import('@/page/statisticAnalysis/report')
                },
                {
                    path: 'addSupervisor',
                    name: 'addSupervisor',
                    meta: { title: '发起督导' },
                    component: () => import('@/page/supervisor/addSupervisor')
                },
                {
                    path: 'teachingActiveSupervisor',
                    name: 'teachingActiveSupervisor',
                    meta: { title: '教学活动督导' },
                    component: () => import('@/page/supervisor/teachingActiveSupervisor')
                },
                {
                    path: 'outDeptSupervisor',
                    name: 'outDeptSupervisor',
                    meta: { title: '出科活动督导' },
                    component: () => import('@/page/supervisor/outDeptSupervisor')
                },
                {
                    path: 'deptMangeSupervisor',
                    name: 'deptMangeSupervisor',
                    meta: { title: '科室活动督导' },
                    component: () => import('@/page/supervisor/deptMangeSupervisor')
                },
                {
                    path: 'doctorTrain',
                    name: 'doctorTrain',
                    meta: { title: '师资培训次数查询' },
                    component: () => import('@/page/workload/doctorTrain')
                },
                {
                    path: 'doctorTrainDetail',
                    name: 'doctorTrainDetail',
                    meta: { title: '师资培训明细查询' },
                    component: () => import('@/page/workload/doctorTrainDetail')
                },
                {
                    path: 'operationalPrivilegeRecord',
                    name: 'operationalPrivilegeRecord',
                    meta: { title: '记录查看' },
                    component: () => import('@/page/workload/operationalPrivilegeRecord.vue')
                },
                {
                    path: 'deliverannouncement',
                    name: 'deliverannouncement',
                    meta: { title: '发布通知' },
                    component: () => import('@/page/noticeAnnouncement/deliverannouncement')
                },
                {
                    path: 'policyDocument',
                    name: 'policyDocument',
                    meta: { title: '政策文件' },
                    component: () => import('@/page/noticeAnnouncement/policyDocument')
                },
                {
                    path: 'detailsnotification',
                    name: 'detailsnotification',
                    meta: { title: '通知公告' },
                    component: () => import('@/page/noticeAnnouncement/detailsnotification')
                },
                {
                    path: 'activity_arrangement',
                    name: 'activity_arrangement',
                    meta: { title: '教学活动安排' },
                    component: () => import('@/page/noticeAnnouncement/activity_arrangement')
                },
                {
                    path: 'download_area',
                    name: 'download_area',
                    meta: { title: '下载专区' },
                    component: () => import('@/page/noticeAnnouncement/download_area')
                },
                {
                    path: 'examinationRegistration',
                    name: 'examinationRegistration',
                    meta: { title: '出科考试报名记录' },
                    component: () => import('@/page/exitAssessment/examinationRegistration')
                },
                {
                    path: 'resultInquiry',
                    name: 'resultInquiry',
                    meta: { title: '出科成绩查询' },
                    component: () => import('@/page/exitAssessment/resultInquiry')
                },
                {
                    path: 'examinionItemSetting',
                    name: 'examinionItemSetting',
                    meta: { title: '考核项管理' },
                    component: () => import('@/page/exitAssessment/examinionItemSetting')
                },
                {
                    path: 'graduateExamine',
                    name: 'graduateExamine',
                    meta: {
                        title: '出科考核管理'
                    },
                    component: () => import('@/page/exitAssessment/graduateExamine.vue'),
                },
                {
                    path: 'graduateExamDetail',
                    name: 'graduateExamDetail',
                    component: () => import('@/page/exitAssessment/graduateExamDetail.vue')
                },
                {
                    path: 'studentGraduateExamine',
                    name: 'studentGraduateExamine',
                    meta: {
                        title: '出科考核管理（学生）'
                    },
                    component: () => import('@/page/exitAssessment/graduateExamine_student.vue')
                },
                {
                    path: 'monthTest',
                    name: 'monthTest',
                    meta: {
                        title: '月考核'
                    },
                    component: () => import('@/page/circleManage/monthTest.vue')
                },
                {
                    path: 'processList',
                    name: 'processList',
                    meta: {
                        title: '月考核审核'
                    },
                    component: () => import('@/page/circleManage/processList.vue')
                },
                
                

            ]
        },

    ],
    mode: "hash"
});
