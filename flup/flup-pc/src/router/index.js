import Vue from "vue";
import Router from "vue-router";
import utils from "../utils";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
// import MtaH5 from 'mta-h5-analysis';

// Vue.use(Router);
if (!window.VueRouter) Vue.use(Router);

const routes = [
  {
    path: "/writeOff",
    name: "writeOff",
    component: resolve =>
      require(["../pagesTransfer/writeOff/index.vue"], resolve)
  },
  {
    path: "/chatHistory",
    name: "chatHistory",
    component: resolve =>
      require([
        "../pagesTransfer/qualityControlStatistics/chatHistory.vue"
      ], resolve)
  },
  //售前聊天记录
  {
    path: "/chatHistoryBeforeOrder",
    name: "chatHistoryBeforeOrder",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require([
        "../pagesTransfer/qualityControlStatistics/chatHistoryBeforeOrder.vue"
      ], resolve)
  },
  {
    path: "/qualityControlStatistics",
    name: "qualityControlStatistics",

    component: resolve =>
      require(["../pagesTransfer/qualityControlStatistics/index.vue"], resolve)
  },
  // 订单管理
  {
    path: "/orderManagement",
    name: "orderManagement",
    component: resolve =>
      require(["../pagesTransfer/orderManagement/index.vue"], resolve)
  },
  {
    path: "/health_management",
    name: "healthManagement",
    component: resolve =>
      require(["../pages/health_management/index"], resolve),
    children: [
      {
        path: "classPack",
        component: resolve =>
          require(["../pages/health_management/classPack"], resolve)
      },
      {
        path: "package",
        component: resolve =>
          require(["../pages/health_management/package"], resolve)
      },
      {
        path: "salesOrder",
        component: resolve =>
          require(["../pages/health_management/salesOrder"], resolve)
      },
      {
        path: "openStatus",
        component: resolve =>
          require(["../pages/health_management/openStatus"], resolve)
      },
      {
        path: "detail",
        meta: {
          noCheck: true
        },
        component: resolve =>
          require(["../pages/health_management/component/detail.vue"], resolve)
      },
      {
        path: "dredge",
        meta: {
          noCheck: true
        },
        component: resolve =>
          require(["../pages/health_management/component/dredge.vue"], resolve)
      },
      {
        path: "configuration",
        meta: {
          noCheck: true
        },
        component: resolve =>
          require([
            "../pages/health_management/component/configuration.vue"
          ], resolve)
      },
      {
        path: "preview",
        meta: {
          noCheck: true
        },
        component: resolve =>
          require(["../pages/health_management/component/preview.vue"], resolve)
      },
      {
        path: "refundReview",
        component: resolve =>
          require(["../pages/health_management/refundReview.vue"], resolve)
      }
    ]
  },
  //设备管理
  {
    path: "/devicemanager",
    name: "devicemanager",
    component: resolve =>
      require(["../pages/chronic_disease/device_manager/index"], resolve)
  },
  //计划统计（新）
  {
    path: "/newplanstatistics",
    name: "newplanstatistics",
    component: resolve =>
      require(["../pages/followup/newplan_statistics/index"], resolve)
  },
  //阳性预警
  {
    path: "/positiveWarning/:type", //start 未处理 carryout 已处理 end已结束
    name: "positiveWarning",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pages/chronic_disease/positive_warning/index"], resolve)
  },
  {
    path: "/addWarning",
    name: "addWarning",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pages/chronic_disease/positive_warning/addWarning"], resolve)
  },
  // 阳性指标管理
  {
    path: "/positiveIndicators",
    name: "positiveIndicators",
    component: resolve =>
      require(["../pages/chronic_disease/positive_indicators/index"], resolve)
  },
  // 筛选指标管理
  {
    path: "/screeningIndicators",
    name: "screeningIndicators",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pages/chronic_disease/screening_indicators/index"], resolve)
  },
  // 筛选结果
  {
    path: "/screeningResult",
    name: "screeningResult",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pages/chronic_disease/screening_result/index"], resolve)
  },
  // 筛选指标记录
  {
    path: "/screeningRecord",
    name: "screeningRecord",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pages/chronic_disease/screening_record/index"], resolve)
  },
  //慢病患者
  {
    path: "/icdmpatient",
    name: "icdmpatient",
    component: resolve =>
      require(["../pages/chronic_disease/icdm_patient/index"], resolve)
  },
  //出院详情
  {
    path: "/dischargeinfo",
    name: "dischargeinfo",
    meta: {
      noCheck: true
    },
    props: route => ({ ...route.query }),
    component: resolve =>
      require(["../pages/followup/discharge_info/index"], resolve)
  },
  //健康档案
  {
    path: "/healtharchives",
    name: "healtharchives",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pages/chronic_disease/health_archives/index"], resolve)
  },
  //查看随访任务
  {
    path: "/checkTask",
    name: "checkTask",
    component: resolve =>
      require(["../pages/followup/followup_task_detail/index"], resolve),
    meta: {
      noCheck: true
    }
  },
  //电话随访（新）
  {
    path: "/newphoneFollowUp",
    name: "newphoneFollowUp",
    component: resolve =>
      require(["../pagesTransfer/followup/phone_followup/index"], resolve),
    meta: {
      isLoading: true,
      noCheck: true
    }
  },
  //随访规则库管理
  {
    path: "/ruleBase/:type",
    component: resolve =>
      require(["../pages/followup/followup_rule/index"], resolve),
    meta: {
      noCheck: true,
      isLoading: true
    }
  },
  //常规随访（java）
  {
    path: "/routinenew",
    name: "routinenew",
    component: resolve =>
      require(["../pagesTransfer/followup/routine_followup/index"], resolve),
    meta: {
      isLoading: true
    }
  },
  //无权限提示页面
  {
    path: "/nopermission",
    name: "nopermission",
    component: resolve => require(["../pages/error/no_permission"], resolve),
    meta: {
      noCheck: true
    }
  },
  //随访任务配置页面
  {
    path: "/settask",
    name: "settask",
    component: resolve =>
      require(["../pagesTransfer/base_plat/systemLayout/index"], resolve)
  },
  //异常预警
  {
    path: "/exceptionwarning",
    name: "exceptionwarning",
    component: resolve =>
      require(["../pages/chronic_disease/exception_warning/index"], resolve)
  },
  //健康监测
  {
    path: "/healthmonitor",
    // name: 'healthmonitor',
    component: resolve =>
      require(["../pages/chronic_disease/health_monitor/index"], resolve),
    children: [
      {
        path: "/",
        component: resolve =>
          require([
            "../pages/chronic_disease/health_monitor/router/index"
          ], resolve)
      },
      {
        path: "detail",
        meta: {
          noCheck: true
        },
        component: resolve =>
          require([
            "../pages/chronic_disease/health_monitor/router/detail"
          ], resolve)
      }
    ]
  },
  //慢病计划
  {
    path: "/icdmplan",
    name: "icdmplan",
    component: resolve =>
      require(["../pages/chronic_disease/icdm_plan/index"], resolve),
    meta: {
      noCheck: true,
      title: "慢病计划"
    }
  },
  //慢病计划关联设置
  {
    path: "/associatedSettings",
    name: "associatedSettings",
    component: resolve =>
      require(["../pages/chronic_disease/monitor/associatedSettings"], resolve),
    meta: {
      noCheck: true
    }
  },
  //检测指标管理
  {
    path: "/monitorIndex",
    name: "monitorIndex",
    component: resolve =>
      require(["../pages/chronic_disease/monitor/monitorIndex"], resolve)
  },
  //慢病报告模板
  {
    path: "/reportTemplate",
    name: "reportTemplate",
    component: resolve =>
      require(["../pages/chronic_disease/monitor/reportTemplate"], resolve)
  },
  //健康干预模板
  {
    path: "/healthIntervention",
    name: "healthIntervention",
    component: resolve =>
      require(["../pages/chronic_disease/patient/healthIntervention"], resolve)
  },
  //新字典管理
  {
    path: "/newdictionarySetsV2",
    name: "newdictionarySetsV2",
    component: resolve =>
      require(["../pagesTransfer/base_plat/dictionaries/index"], resolve)
  },
  //新医院管理
  {
    path: "/newhospitalV2",
    name: "newhospitalV2",
    component: resolve =>
      require(["../pagesTransfer/base_plat/hospital_list/index"], resolve)
  },
  //新缓存管理
  {
    path: "/newcacheV2",
    name: "newcacheV2",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/base_plat/cache_set/index"], resolve)
  },
  //计划管理
  {
    path: "/planmanagementV2",
    name: "planmanagementV2",
    component: resolve =>
      require(["../pagesTransfer/followup/planmanagement"], resolve)
  },
  //随访类型管理
  {
    path: "/followuptypeadminV2",
    name: "followuptypeadminV2",
    component: resolve =>
      require(["../pagesTransfer/followup/followuptypeadmin"], resolve)
  },
  //新接口管理
  {
    path: "/connectorV2",
    name: "connectorV2",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/base_plat/connector/index"], resolve)
  },
  //新知识库
  {
    path: "/knowledgebaseV2",
    name: "knowledgebaseV2",
    component: resolve =>
      require(["../pagesTransfer/base_plat/knowledge_base/index"], resolve)
  },
  //新慢病随访规则管理
  {
    path: "/newrulesV2/:type",
    name: "newrulesV2",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/followup/rules/index"], resolve)
  }, //新慢病随访规则管理
  {
    path: "/rulesWarehouse",
    name: "rulesWarehouse",
    component: resolve =>
      require(["../pagesTransfer/followup/rules/rulesWarehouse"], resolve),
    meta: {
      noCheck: true
    }
  },
  //新参数配置
  {
    path: "/newparameterConfigurationV2",
    name: "newparameterConfigurationV2",
    component: resolve =>
      require(["../pagesTransfer/parameter_configuration/index"], resolve)
  },
  //新科室管理
  {
    path: "/newfollowupdeptV2",
    name: "newfollowupdeptV2",
    component: resolve =>
      require(["../pagesTransfer/base_plat/followup_dept/index"], resolve)
  },
  //消息提醒
  {
    path: "/messageReminder",
    name: "messageReminder",
    component: resolve =>
      require(["../pagesTransfer/base_plat/messageReminder/index"], resolve)
  },
  //新发送宣教
  {
    path: "/newsendV2/:type", // WJDC（问卷调查） JKXJ（健康宣教）
    name: "newsendV2",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/questionaire/send/index"], resolve)
  },
  //问卷宣教发送统计页面
  {
    path: "/newsendStatistic/:type", // WJDC（问卷调查） JKXJ（健康宣教）
    name: "newsendStatistic",
    component: resolve =>
      require(["../pagesTransfer/questionaire/send_statistic/index"], resolve),
    props: true,
    meta: {
      noCheck: true,
      isLoading: true
    }
  },
  //新宣教模板列表
  {
    path: "/newsendTemplateListV2/:type", // WJDC（问卷调查） JKXJ（健康宣教）
    name: "newsendTemplateListV2",
    component: resolve =>
      require([
        "../pagesTransfer/questionaire/send_template_list/index"
      ], resolve),
    props: true,
    meta: {
      noCheck: true,
      isLoading: true
    }
  },
  //新编辑宣教
  {
    path: "/neweditEducate",
    name: "neweditEducate",
    component: resolve =>
      require(["../pagesTransfer/questionaire/edit_educate/index"], resolve),
    meta: {
      noCheck: true
    }
  },
  //新编辑问卷模板
  {
    path: "/neweditQuestionaire/:type", //hospital医院,company公司
    name: "neweditQuestionaire",
    component: resolve =>
      require([
        "../pagesTransfer/questionaire/edit_questionaire/index"
      ], resolve),
    meta: {
      noCheck: true
    }
  },
  //新随访慢病组管理
  {
    path: "/newfollowupGroupV2",
    name: "newfollowupGroupV2",
    component: resolve =>
      require(["../pagesTransfer/followup/followup_group/index"], resolve)
  },
  //新随访组权限管理
  {
    path: "/newjurisdictionV2",
    name: "newjurisdictionV2",
    component: resolve =>
      require([
        "../pagesTransfer/followup/followup_group/jurisdiction"
      ], resolve),
    meta: {
      noCheck: true
    }
  },
  //新从模板库中导入问卷宣教
  {
    path: "/newimporttemplate/:type",
    name: "newimporttemplate",
    component: resolve =>
      require(["../pagesTransfer/questionaire/import_template/index"], resolve),
    meta: {
      noCheck: true
    }
  },
  //新预览问卷宣教
  {
    path: "/newpreview",
    name: "newpreview",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/questionaire/preview/index"], resolve)
  },
  //患者列表（新）
  {
    path: "/newpatientlistV2",
    name: "newpatientlistV2",
    component: resolve =>
      require(["../pagesTransfer/base_plat/patient_list_new/index"], resolve),
    meta: {
      isLoading: true
    }
  },
  //新问卷工作量统计
  {
    path: "/newwrokloadStatisticsV2",
    name: "newwrokloadStatisticsV2",
    component: resolve =>
      require([
        "../pagesTransfer/questionaire/workload_statistics/index"
      ], resolve)
  },
  //新问卷样本统计
  {
    path: "/newsampleStatisticsV2",
    name: "newsampleStatisticsV2",
    component: resolve =>
      require([
        "../pagesTransfer/questionaire/sample_statistics/index"
      ], resolve),
    meta: {
      isLoading: true
    }
  },
  //新问卷占比统计
  {
    path: "/newproportionStatisticsV2",
    name: "newproportionStatisticsV2",
    component: resolve =>
      require([
        "../pagesTransfer/questionaire/proportion_statistics/index"
      ], resolve),
    meta: {
      isLoading: true
    }
  },
  //新角色列表
  {
    path: "/newroleListV2",
    name: "newroleListV2",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/base_plat/role_list/index"], resolve)
  },
  //新用户列表
  {
    path: "/newuserListV2",
    name: "newuserListV2",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/base_plat/user_list/index"], resolve)
  },
  //新操作日志
  {
    path: "/newoperationlogV2",
    name: "newoperationlogV2",
    component: resolve =>
      require(["../pagesTransfer/followup/operationlog"], resolve)
  },
  //新患者登记
  {
    path: "/newpatientregisterV2",
    name: "newpatientregisterV2",
    component: resolve =>
      require(["../pagesTransfer/followup/patient_register/index"], resolve),
    meta: {
      noCheck: true
    }
  },
  //随访模板管理
  {
    path: "/followupTemplateV2",
    name: "followupTemplateV2",
    component: resolve =>
      require(["../pages/chronic_disease/patient/followupTemplate"], resolve)
  },
  //新增患者
  {
    path: "/newpatients",
    name: "newpatients",
    component: resolve =>
      require(["../pagesTransfer/followup/newpatients"], resolve),
    meta: {
      noCheck: true
    }
  },
  //送审单审核
  {
    path: "/SingleConstruction",
    name: "SingleConstruction",
    component: resolve =>
      require(["../pagesTransfer/followup/audit_list/index"], resolve),
    meta: {
      isLoading: true
    }
  },
  //版本号
  {
    path: "/AboutTheVersion",
    name: "AboutTheVersion",
    component: resolve =>
      require(["../pagesTransfer/followup/AboutTheVersionx"], resolve),
    meta: {
      noCheck: true
    }
  },
  //随访占比统计
  {
    path: "/newfollowupProportionV2",
    name: "newfollowupProportionV2",
    component: resolve =>
      require(["../pagesTransfer/followup/followupProportion"], resolve)
  },
  //满意度问卷统计
  {
    path: "/satisfactionQuestionnaireStatistics",
    name: "satisfactionQuestionnaireStatistics",
    component: resolve =>
      require([
        "../pagesTransfer/followup/satisfactionQuestionnaireStatistics"
      ], resolve)
  },
  //患者随访计划管理
  {
    path: "/viewPatientPlanV2",
    name: "viewPatientPlanV2",
    component: resolve =>
      require(["../pagesTransfer/followup/patient_plan/index"], resolve),
    meta: {
      noCheck: true
    }
  },
  //患者随访计划切换预览
  {
    path: "/previewPatientPlanV2",
    name: "previewPatientPlanV2",
    component: resolve =>
      require([
        "../pagesTransfer/followup/patient_plan/previewChangePlan"
      ], resolve),
    meta: {
      noCheck: true
    }
  },
  //随访样本统计
  {
    path: "/newfollowupSampleV2",
    name: "newfollowupSampleV2",
    component: resolve =>
      require(["../pagesTransfer/followup/followupSampleV2"], resolve)
  },
  //查看报告
  {
    path: "/thereportpreview",
    name: "thereportpreview",
    component: resolve =>
      require(["../pages/chronic_disease/monitor/thereportpreview"], resolve),
    meta: {
      noCheck: true
    }
  },
  //服务包管理
  {
    path: "/servicePack",
    name: "servicePack",
    component: resolve =>
      require(["../pagesTransfer/servicePack/index"], resolve)
  },
  //服务包签约统计
  {
    path: "/signingStatistics",
    name: "signingStatistics",
    component: resolve =>
      require(["../pagesTransfer/followup/signingStatistics"], resolve),
    meta: {
      noCheck: true
    }
  },
  //服务包订单统计
  {
    path: "/packOrderStatistics",
    name: "packOrderStatistics",
    component: resolve =>
      require(["../pagesTransfer/followup/packOrderStatistics"], resolve),
    meta: {
      noCheck: true
    }
  },
  //收入统计
  {
    path: "/incomeStatistics",
    name: "incomeStatistics",
    component: resolve =>
      require(["../pagesTransfer/followup/incomeStatistics"], resolve),
    meta: {
      noCheck: true
    }
  },
  //签约审核
  {
    path: "/contractReview",
    name: "contractReview",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/followup/contractReview"], resolve)
  },
  //未接來電
  {
    path: "/missIn",
    name: "missIn",
    component: resolve =>
      require(["../pagesTransfer/callcenter/missIn"], resolve)
  },
  //IPCC管理
  {
    path: "/ipccManage",
    name: "ipccManage",
    component: resolve =>
      require(["../pagesTransfer/callcenter/ipccManage"], resolve)
  },
  //分机管理
  {
    path: "/extensionManage",
    name: "extensionManage",
    component: resolve =>
      require(["../pagesTransfer/callcenter/extensionManage"], resolve)
  },
  //坐席管理
  {
    path: "/seatingManage",
    name: "seatingManage",
    component: resolve =>
      require(["../pagesTransfer/callcenter/seatingManage"], resolve)
  },
  //数据源管理
  {
    path: "/dataSourceConfigurationV2",
    name: "dataSourceConfigurationV2",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/dataSource_configuration/index"], resolve)
  },
  //随访组工作量
  {
    path: "/flupGroupWorkload",
    name: "flupGroupWorkload",
    component: resolve =>
      require(["../pagesTransfer/followup/workload/flupGroupWorkload"], resolve)
  },
  //随访年度工作量
  {
    path: "/flupYearWorkload",
    name: "flupYearWorkload",
    component: resolve =>
      require(["../pagesTransfer/followup/workload/flupYearWorkload"], resolve)
  },
  //随访组工作量-随访任务列表
  {
    path: "/flupPatientPlanList",
    name: "flupPatientPlanList",
    component: resolve =>
      require([
        "../pagesTransfer/followup/workload/flupPatientPlanList"
      ], resolve),
    meta: {
      noCheck: true
    }
  },
  //处理记录
  {
    path: "/processingRecords",
    name: "processingRecords",
    component: resolve =>
      require(["../pagesTransfer/callcenter/processingRecords"], resolve)
  },
  //处理详情
  {
    path: "/processingDetails",
    name: "processingDetails",
    component: resolve =>
      require(["../pagesTransfer/callcenter/processingDetails"], resolve),
    meta: {
      noCheck: true
    }
  },
  //来电弹屏
  {
    path: "/IncomingCall",
    name: "IncomingCall",
    component: resolve =>
      require(["../pagesTransfer/callcenter/IncomingCall"], resolve)
  },
  //通话统计
  {
    path: "/callStatistics",
    name: "callStatistics",
    component: resolve =>
      require(["../pagesTransfer/callcenter/callStatistics"], resolve)
  },
  //通话记录
  {
    path: "/callRecords",
    name: "callRecords",
    component: resolve =>
      require(["../pagesTransfer/callcenter/callRecords"], resolve)
  },
  //发送记录
  {
    path: "/sendRecord",
    name: "sendRecord",
    component: resolve =>
      require(["../pagesTransfer/questionaire/sendRecord/index"], resolve)
  },
  //病人管理
  {
    path: "/patientManagement",
    name: "patientManagement",
    component: resolve =>
      require(["../pagesTransfer/base_plat/patientManagement/index"], resolve)
  },
  // 个案管理师看板
  {
    path: "/caseManagerBored",
    name: "caseManagerBored",
    component: resolve =>
      require(["../pagesTransfer/base_plat/caseManagerBored/index"], resolve)
  },
  //个案管理
  {
    path: "/caseManagement",
    name: "caseManagement",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/base_plat/caseManagement/index"], resolve)
  },
  //随访首页
  {
    path: "/followUpIndex",
    name: "followUpIndex",
    component: resolve =>
      require(["../pagesTransfer/base_plat/followUpIndex/index"], resolve),
    meta: {
      isLoading: true
    }
  },
  //随访记录
  {
    path: "/followUpRecording",
    name: "followUpRecording",
    component: resolve =>
      require(["../pagesTransfer/followup/followUpRecording"], resolve),
    meta: {
      isLoading: true
    }
  },
  //随访患者明细查询
  {
    path: "/followupReport",
    name: "followupReport",
    component: resolve =>
      require(["../pages/followup/followup_report/index"], resolve),
    meta: {
      noCheck: true
    }
  },
  //处方管理
  {
    path: "/prescription",
    name: "prescription",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/base_plat/prescription/index"], resolve)
  },
  //随访新发疾病统计
  {
    path: "/followupReportV2",
    name: "followupReportV2",
    component: resolve =>
      require(["../pages/followup/followup_report_v2/index"], resolve),
    meta: {
      noCheck: true
    }
  },
  //患者迁移管理
  {
    path: "/sickPersonMigrate",
    name: "sickPersonMigrate",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require(["../pagesTransfer/followup/sickPersonMigrate"], resolve)
  },
  // 续方管理
  {
    path: "/prescriptionContinue",
    name: "prescriptionContinue",
    meta: {
      noCheck: true
    },
    component: resolve =>
      require([
        "../pagesTransfer/base_plat/prescriptionContinue/index"
      ], resolve)
  },
  // 续方管理详情
  {
    path: "/prescriptionContinueDetail",
    name: "prescriptionContinueDetail",
    component: resolve =>
      require([
        "../pagesTransfer/base_plat/prescriptionContinue/detail"
      ], resolve),
    meta: {
      noCheck: true
    }
  },
  //待入组队列
  {
    path: "/readyInGroupV2",
    name: "readyInGroupV2",
    component: resolve =>
      require(["../pagesTransfer/followup/group_list/index"], resolve),
    meta: {
      noCheck: true,
      isLoading: true
    }
  },
  //患者类型页面
  {
    path: "/patientListV2",
    name: "patientListV2",
    component: resolve =>
      require(["../pagesTransfer/followup/patient_list_newV2/index"], resolve),
    meta: {
      isLoading: true
    }
  },
  //样本统计页面预览
  {
    path: "/preSampleStatis",
    name: "preSampleStatis",
    component: resolve =>
      require([
        "../pagesTransfer/questionaire/sample_statistics/preSampleStatis"
      ], resolve),
    meta: {
      noCheck: true,
      isLoading: true
    }
  },
  //未回复管理
  {
    path: "/noReplayRecord",
    name: "noReplayRecord",
    component: resolve =>
      require(["../pagesTransfer/followup/noReplay_followup/index"], resolve),
    meta: {
      isLoading: true,
      noCheck: true
    }
  },
  //随访执行统计
  {
    path: "/flupPerformStatistics",
    name: "flupPerformStatistics",
    component: resolve =>
      require(["../pagesTransfer/statistics/flupPerformStatistics"], resolve),
    meta: {
      isLoading: true
    }
  },
  //人群标签规则
  {
    path: "/populationLabel",
    name: "populationLabel",
    component: resolve =>
      require(["../pagesTransfer/base_plat/population_rule/index"], resolve),
    meta: {
      isLoading: true
    }
  },
  //消息模板管理
  {
    path: "/messageTemplateManager",
    name: "messageTemplateManager",
    component: resolve =>
      require([
        "../pagesTransfer/base_plat/message_management/messageTemplate"
      ], resolve),
    meta: {
      noCheck: true,
      isLoading: true
    }
  },
  //消息记录
  {
    path: "/messageTemplateRecord",
    name: "messageTemplateRecord",
    component: resolve =>
      require([
        "../pagesTransfer/base_plat/message_management/messageTemplateRecord"
      ], resolve),
    meta: {
      noCheck: true,
      isLoading: true
    }
  },
  //建议与反馈
  {
    path: "/feedbackManage",
    name: "feedbackManage",
    component: resolve =>
      require(["../pagesTransfer/feedbackManage/sugAndFed/index"], resolve),
    children: [
      {
        path: "sugAndFed",
        component: resolve =>
          require(["../pagesTransfer/feedbackManage/sugAndFed/index"], resolve)
      }
    ]
  },
  //消息管理
  {
    path: "/messageManage",
    name: "messageManage",
    component: resolve =>
      require(["../pagesTransfer/base_plat/message_management/index"], resolve),
    meta: {
      isLoading: true,
      noCheck: true
    }
  },
  //随访时间线
  {
    path: "/flupTimeline",
    name: "flupTimeline",
    component: resolve =>
      require(["../pagesTransfer/followup/flupTimeline"], resolve),
    meta: {
      noCheck: true,
      isLoading: true
    }
  },
  //审核管理
  {
    path: "/auditManagement",
    name: "auditManagement",
    component: resolve =>
      require(["../pagesTransfer/auditManagement/index"], resolve),
    meta: {
      isLoading: true
    }
  },
  //iframe 嵌套预览页面
  {
    path: "/preview",
    name: "preview",
    component: resolve => require(["../components/preview"], resolve),
    meta: {
      noCheck: true,
      isLoading: true
    }
  },
  //中转页面
  {
    path: "/transport",
    name: "transport",
    component: resolve => require(["../pages/mall/transport"], resolve)
  }
];
const getAccessType = () => {
  let obj = {};
  const url = window.location.href;
  const hostname = new URL(url).hostname; // 从URL中提取hostname
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\/\S*)?$/;
  if (url.indexOf('.webvpn') != -1) {
    console.log("vpn 访问");
    obj.ICDMApiUrl = window.globalURL.VPNCDMApiUrl;
    // obj.ICDMApiUrl = 'http://192.168.14.102:8088';
    obj.SmartFormUrl = window.globalURL.VPNmartFormUrl;
    obj.onlineViewUrl = window.globalURL.VPNonlineViewUrl;
    obj.referralUrl = window.globalURL.VPNreferralUrl
  } else if (ipRegex.test(hostname)) {
    console.log("ip地址访问");
    obj.ICDMApiUrl = window.globalURL.IPICDMApiUrl;
    obj.SmartFormUrl = window.globalURL.IPSmartFormUrl;
    obj.onlineViewUrl = window.globalURL.IPonlineViewUrl;
    obj.referralUrl = window.globalURL.IPreferralUrl
  } else {
    console.log("域名访问");
    obj.ICDMApiUrl = window.globalURL.ICDMApiUrl;
    obj.SmartFormUrl = window.globalURL.SmartFormUrl;
    obj.onlineViewUrl = window.globalURL.onlineViewUrl;
    obj.referralUrl = window.globalURL.referralUrl
  }
  return obj;
};
const router = new Router({ routes });
router.beforeEach(async (to, from, next) => {

  NProgress.start();
  let apiHost = {
    BasePlatform: "",
    BasePlatformApiUrl: "",
    FollowUp: "",
    FollowUpApiUrl: "",
    Questionnaire: "",
    QuestionnaireApiUrl: "",
    WEBSERVER: "", //全胜ipcc
    CTISERVER: "" //全胜ipcc
  };
  Vue.prototype.$storage.session.set("base_url", {
    ...apiHost,
    ...getAccessType()
  });
  Vue.prototype.$baseURL = {
    ...apiHost,
    ...getAccessType()
  };

  window.parent.postMessage(
    JSON.stringify({
      method: "saveFollowUpUrl",
      url: {
        ICDMApiUrl: apiHost.ICDMApiUrl,
        WEBurl: location
      }
    }),
    "*"
  );
  let oldToken = Vue.prototype.$storage.session.get("token");
  let token;
  if (utils.isDef(to.query.token)) {
    token = to.query.token;
  } else {
    token = oldToken;
  }
  function getQueryVariable(url, query) {
    var vars = url.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == query) {
        return pair[1];
      }
    }
    return "";
  }
  // Vue.prototype.$global = Vue.prototype.$storage.session.get("global");
  if (!oldToken && !token && to.path != "/nopermission") {
    router.replace("/nopermission");
  }

  if (token === oldToken) {
    Vue.prototype.$global = Vue.prototype.$storage.session.get("global");
    const paths = JSON.parse(localStorage.getItem("paths"));
    let path = to.path;
    const isBol = paths.some(item => item == path);
    if (!isBol && to.path != "/nopermission" && to.meta && !to.meta.noCheck) {
      await Vue.prototype.$apis.pushOperateLogs({
        contents: `非法访问：/pc/#/${to.path}`,
        modelId: 678,
        operateName: "权限提升",
        operatorToken: token
      });
      router.replace("/nopermission");
    }
  } else if (token !== oldToken || !Vue.prototype.$global) {
    sessionStorage.setItem("token", token);
    // if (
    //   location.hash.indexOf("/AboutTheVersion") != -1 ||
    //   location.hash.indexOf("/thereportpreview") != -1
    // ) {
    //   let res = { hospital_id: getQueryVariable(location.hash, "hospitalId") };
    //   console.log(res,11)
    //   Vue.prototype.$global = res;
    // } else {
    Vue.prototype.$cookie.set("token", token);
    // 获取当前用户访问的路由权限
    await Vue.prototype.$apis
      .getPermitMenuUrl({
        modelIds: "678,680"
      })
      .then(async res => {
        if (res) {
          let paths = res.retData;
          // 返回的路由数据有问题需进一步处理
          const newPaths = paths.map(item => {
            let index = item.lastIndexOf("/#/");
            let index2 = item.lastIndexOf("?");
            if (index > -1 && index2 > -1) {
              return item.slice(index + 2, index2);
            } else {
              return item.slice(index + 2);
            }
          });
          localStorage.setItem("paths", JSON.stringify(newPaths));
          let path = to.path;
          const isBol = newPaths.some(item => item == path);
          if (
            !isBol &&
            to.path != "/nopermission" &&
            to.meta &&
            !to.meta.noCheck
          ) {
            await Vue.prototype.$apis.pushOperateLogs({
              contents: `非法访问：/pc/#/${to.path}`,
              modelId: 678,
              operateName: "权限提升",
              operatorToken: token
            });
            router.replace("/nopermission");
          }
        } else {
          console.log("获取失败");
        }
      });

    await Vue.prototype.$apis.querycurrent().then(res => {
      if (res) {
        res.hospital_id = res.UnitId;
        Vue.prototype.$global = res;
        Vue.prototype.$storage.session.set("global", res);
        sessionStorage.setItem("token", token);
      } else {
        if (Vue.prototype.$isProduction) {
          location.replace(
            location.origin + "/Account/AuthError?err_msg=login_error "
          );
        } else {
          Vue.prototype.$message.error("token错误");
        }
      }
    });
    // }

    await Vue.prototype.$apis
      .getFlupConfigList({
        hospitalId: Vue.prototype.$global.hospital_id,
        moduleCode: "followUpSetting"
      })
      .then(res => {
        if (res.length > 0) {
          res.forEach(element => {
            if (
              element.componentKey == "PeopleMask" &&
              element.componentValue == "1"
            ) {
              sessionStorage.setItem("isShieldUser", true);
            }
            if (
              element.componentKey == "PhoneNumberMask" &&
              element.componentValue == "1"
            ) {
              sessionStorage.setItem("toisShieldPhoneken", true);
            }
          });
        }
      });
  }
  next();
});
router.afterEach(to => {
  // setTimeout(() => {
  //   // var _mtac = {};
  //   //   (function() {
  //   //     var mta = document.createElement("script");
  //   //     mta.src = "https://pingjs.qq.com/h5/stats.js?v2.0.4";
  //   //     mta.setAttribute("name", "MTAH5");
  //   //     mta.setAttribute("sid", "500729639");
  //   //     mta.setAttribute("cid", "500729640");
  //   //     var s = document.getElementsByTagName("script")[0];
  //   //     s.parentNode.insertBefore(mta, s);
  //   //   })();

  //   MtaH5.init({
  //     "sid": '500729639', //必填，统计用的appid
  //     "cid": '500729640',//如果开启自定义事件，此项目为必填，否则不填
  //     "autoReport": 1,//是否开启自动上报(1:init完成则上报一次,0:使用pgv方法才上报)
  //     "senseHash": 1, //hash锚点是否进入url统计
  //     "senseQuery": 0, //url参数是否进入url统计
  //     "performanceMonitor": 0,//是否开启性能监控
  //     "ignoreParams": [] //开启url参数上报时，可忽略部分参数拼接
  //   });

  // })

  NProgress.done();
});

export default router;
