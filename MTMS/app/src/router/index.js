import Vue from 'vue'
import Router from 'vue-router'
import * as sub from './router-subitem'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:escort',
      component: () => import("@/views/index"),
      children: [
        {
          name: "wxIndex",// 首页
          path: "wxIndex",
          component: () => import("@/views/wxIndex/index"),
          meta: { title: "智慧医教" }
        },
        {
          name: "wxInfo",// 个人信息详情2.0
          path: "wxInfo",
          component: () => import("../views/wxIndex/wxInfo"),
          meta: { title: "个人信息" }
        },
        {
          name: "wxMenu",// 菜单2.0
          path: "wxMenu",
          component: () => import("../views/wxIndex/wxMenu"),
          meta: { title: "智慧医教" }
        },
        {
          name: "wxTodo",// 待办事项2.0
          path: "wxTodo",
          component: () => import("../views/wxIndex/wxTodo"),
          meta: { title: "智慧医教" }
        },
        {
          name: "msxxq",// 消息2.0
          path: "msxxq",
          component: () => import("../views/wxIndex/msxxq"),
        },
        {
          name: "xqurl2",// 消息详情
          path: "xqurl2",
          component: () => import("../views/wxIndex/xqurl2"),
        },
        {
          name: "comprehensiveEvaluation", //个人综合考评
          path: "comprehensive",
          component: () => import("@/views/index"),
          children: [...sub.comprehensiveEvaluation],
        },
        {
          name: "caseReview", //病例审核
          path: "caseReview",
          component: () => import("@/views/index"),
          children: [...sub.caseReview]
        },
        {
          name: "graduateSummary",//科主任出科鉴定
          path: "graduateSummary",
          component: () => import("@/views/index"),
          children: [...sub.graduateSummary],
        },
        {
          name: "fdRotation", //轮转主入口
          path: "rt",
          component: () => import("@/views/index"),
          children: [...sub.fdRotation],
        },
        {
          name: "fdExamRegistration", //出科报名审核
          path: "registration",
          component: () => import("@/views/index"),
          children: [...sub.fdExamRegistration],
        },
        {
          name: "fdinspectionList", //轮转巡考评分
          path: "inspection_List",
          component: () => import("../views/inspectionScore/index"),
        },
        {
          //教学查房
          name: "inspection_check",
          path: "inspection/check",
          component: () => import("../views/inspectionScore/inspection_score"),
        },
        {
          //轮转巡考评分
          name: "fdinspectionScore",
          path: "inspection_score",
          component: () => import("../views/inspectionScore/main"),
        },
        {
          name: "fdAttendance", //考勤管理
          path: "attendance",
          component: () => import("@/views/index"),
          children: [...sub.fdAttendance],
        },
        {
          name: "fdTatistical", //统计分析-住培
          path: "tatistical",
          component: () => import("@/views/index"),
          children: [...sub.fdTatistical],
        },
        {
          name: "base_audit", //基地考核
          path: "baseAudit",
          component: () => import("@/views/index"),
          children: [...sub.base_audit],
        },
        {
          name: "office_audit", //教办审核列表
          path: "officeAudit",
          component: () => import("@/views/index"),
          children: [...sub.office_audit],
        },
        {
          name: "fdDirector",//住培轮转-科主任
          path: "rotation_director",
          component: () => import("@/views/index"),
          children: [...sub.fdDirector],
        },
        {
          name: "admin_report_check",//管理者报告查看
          path: "admin_report_check",
          component: () => import("../views/report_check/admin_report_check"),
        },
        {
          name: "extranceExam",//出科考核
          path: "extranceExam",
          component: () => import("@/views/index"),
          children: [...sub.extranceExam],
        },
        {
          name: "turnManual", //轮转手册审核
          path: "turnManual",
          component: () => import("@/views/index"),
          children: [...sub.turnManual],
        },
        {
          name: "overseer", //督导
          path: "overseer",
          component: () => import("@/views/index"),
          children: [...sub.overseer],
        },
        {
          name: "fdAction", //教学活动计划
          path: "action",
          component: () => import("@/views/index"),
          children: [...sub.fdAction],
        },
        {
          //公用评分组件
          name: "scoreDetail",
          path: "scoreTable/scoreDetail",
          component: () => import("@/views/scoreTable/scoreDetail"),
          meta: { title: "评分详情" }
        },
        {
          //公用评分组件
          name: "scoreTable",
          path: "scoreTable/scoreTable",
          component: () => import("@/views/scoreTable/scoreTable"),
          meta: { title: "评分" }
      },
      {
          //公用评分组件教学活动
          name: "scoreTableActivies",
          path: "scoreTable/scoreTableActivies",
          component: () => import("@/views/scoreTable/scoreTableActivies"),
          meta: { title: "评分" }
      },
      ]
    }
  ]
})
