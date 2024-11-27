import { axiosInsance } from "./index";
import qs from "qs";

export default function (Vue) {
  return {
    // 新增、编辑服务包分类
    saveOrEditPackageClassInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatPackageClass/saveOrEditPackageClassInfo",
        params
      );
    },
    // 获取分类列表
    getAllPackageClassList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatPackageClass/getAllPackageClassList",
        {
          params
        }
      );
    },
    // 删除服务包分类
    deletePackageClass(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatPackageClass/deletePackageClass",
        {
          params
        }
      );
    },
    // 获取服务包列表
    listPlatPackageInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatPackageInfo/listPlatPackageInfo",
        {
          params
        }
      );
    },
    getAllDoctorList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatPackageInfo/getAllDoctorList",
        {
          params
        }
      );
    },
    getMaxOrder() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatPackageInfo/getMaxOrder"
      );
    },
    // 服务包列表推送首页和上架状态变更
    PackageChangeStatus(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/PlatPackageInfo/changeStatus",
        params
      );
    },
    // 新增、编辑服务包
    saveOrEditPackageInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatPackageInfo/saveOrEditPackageInfo",
        params
      );
    },
    // 删除服务包分类
    deletePackageInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatPackageInfo/deletePackageInfo",
        {
          params
        }
      );
    },
    // 获取服务包详情
    getPackageInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/PlatPackageInfo/getPackageInfo",
        {
          params
        }
      );
    },
    // 获取订单列表
    getOrderList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/plat/package/order/list",
        {
          params
        }
      );
    },
    // 获取订单统计数据
    getTotalOrderStatistics(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/plat/package/order/getTotalOrderStatistics",
        {
          params
        }
      );
    },
    // 订单详情
    getOrderDetail(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/plat/package/order/get",
        {
          params
        }
      );
    },
    // 更新订单状态
    orderUpdateStatus(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/updateStatus",
        params
      );
    },
    // 更新订单信息
    updateOrder(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/plat/package/order/updateOrder",
        params
      );
    },
    // 规格配置保存
    saveSpecRule(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/PlatPackageInfo/saveSpecRule",
        params
      );
    },
    // 获取随访规则
    getHmQuRule(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/rule/getQuRule",
        {
          params
        }
      );
    },
    // 获取规则节点
    getHmQuRuleNode(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/template/rule/getQuRuleNode",
        {
          params
        }
      );
    },
    // 获取所有服务包分类及下三级信息列表
    getListAllPackage(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatHospitalPackage/listAllPackage",
        {
          params
        }
      );
    },
    getListHospitalPackages(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatHospitalPackage/listHospitalPackages",
        {
          params
        }
      );
    },

    // 获取服务包开通情况列表
    listPlatPackageOpenInfo(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatHospitalPackage/listHospitalOpenInfo",
        {
          params
        }
      );
    },
    // 获取医院开通数量情况
    getHospitalOpenSummary(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatHospitalPackage/getHospitalOpenSummary",
        {
          params
        }
      );
    },
    // 获取某个医院某个服务包下的规格列表及医院开通情况
    listHospitalSpec(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatHospitalPackage/listHospitalSpec",
        {
          params
        }
      );
    },
    // 保存开通信息
    saveSpecInfo(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatHospitalPackage/saveSpecInfo",
        params
      );
    },
    // 医院详情
    countSpecOrder(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatHospitalPackage/countSpecOrder",
        {
          params
        }
      );
    },
    getHospitalNumber(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatHospitalPackage/getHospitalNumber",
        {
          params
        }
      );
    },

    // 获取医院列表
    getAllHospitalList() {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/hospital/getAllHospitals"
      );
    },

    // 判断规格是否能删除
    checkSpecCanDelete(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/PlatPackageInfo/checkSpecCanDelete",
        {
          params
        }
      );
    },

    // 判断规格是否能删除
    GetHMDictItems(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/SystemManage/BaseDict/GetDictItems",
        {
          params
        }
      );
    },

    // 订单核销
    // /b/plat/package/order/writeOff?orderId=${params.orderId}`
    writeOff(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/plat/package/order/writeOff?orderId=${params.orderId}`
      );
    },

    // 订单发货
    sendOutGoods(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/sendOutGoods",
        params
      );
    },

    // 商家同意/拒绝退款申请
    reviewRefund(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/plat/package/order/reviewRefund?${qs.stringify(params, {
          arrayFormat: "repeat"
        })}`
      );
    },
    // 获取退款审核列表
    refundExamineList(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/refundExamineList",
        {
          params
        }
      );
    },
    // 退款审核列表导出
    exportExamineRefundOrders(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/exportExamineRefundOrders",
        {
          responseType: "blob",
          params
        }
      );
    },
    // 退款（迭代4废弃）
    // confirmRefund(params) {
    //   return axiosInsance.post(
    //     Vue.prototype.$baseURL.ICDMApiUrl +
    //       `/b/plat/package/order/confirmRefund?${qs.stringify(params, {
    //         arrayFormat: "repeat"
    //       })}`
    //   );
    // },
    // 审核人员拒绝退款
    rejectRefund(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/plat/package/order/rejectRefund?${qs.stringify(params, {
          arrayFormat: "repeat"
        })}`
      );
    },
    // 审核人员同意退款
    confirmRefund(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/plat/package/order/confirmRefund?${qs.stringify(params, {
          arrayFormat: "repeat"
        })}`
      );
    },
    // 个案发起退款
    refundRequest(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/refundRequest",
        params
      );
    },
    // 患者拒绝
    orderPatientRejection(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/plat/package/order/patientRejection?${qs.stringify(params, {
          arrayFormat: "repeat"
        })}`
      );
    },
    // 完成宣教
    orderCompleteTheMission(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/plat/package/order/completeTheMission?${qs.stringify(params, {
          arrayFormat: "repeat"
        })}`
      );
    },
    // 患者入组
    orderPatientEnrollment(platOrderNo, params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/plat/package/order/orderPatientEnrollment?platOrderNo=${platOrderNo}`,
        params
      );
    },
    // 医院订单列表
    orderListEmrHospitalOrder(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/listEmrHospitalOrder",
        {
          params
        }
      );
    },
    // 结案
    closeCase(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/b/plat/package/order/closeCase?${qs.stringify(params, {
          arrayFormat: "repeat"
        })}`
      );
    },
    // 导出
    exportHospitalOrder(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/exportHospitalOrder",
        {
          responseType: "blob",
          params
        }
      );
    },
    queryFlupPlanBySpecId(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/flupPlan/queryFlupPlanBySpecId",
        {
          params
        }
      );
    },
    // 云呼叫登录
    cloudCallLogin(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        `/tencentCloudContactCenter/getSDKLoginToken?SeatUserId=${params}`,
        params
      );
    },
    // 根据部门查询所有随访计划，用于服务包配置
    queryFlupPlanForPackage(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/flupPlan/queryFlupPlanForPackage",
        {
          params
        }
      );
    },
    // 订单列表导出
    exportOrder(params) {
      return axiosInsance.get(
        Vue.prototype.$baseURL.ICDMApiUrl + "/b/plat/package/order/exportOrder",
        {
          responseType: "blob",
          params
        }
      );
    },
    // 修改发票
    updateInvoice(params) {
      return axiosInsance.post(
        Vue.prototype.$baseURL.ICDMApiUrl +
        "/b/plat/package/order/updateInvoice",
        params
      );
    }
  };
}
