import { http } from "@/utils/http";
import { apiUrl } from "../utils/api";

/**
 * 转诊统计数据导出
 */
export const exportFile = (params) => {
  return new Promise((reslove, reject) => {
    http
      .downloadFilePost(apiUrl.exportReferralStatisticsData, { params })
      .then((res) => {
        reslove(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//1
/**
 * 获得获取当前用户医院
 */
export const getCurrentUserHospital = (params) => {
  return new Promise((reslove, reject) => {
    http
      .get(apiUrl.getCurrentUserHospital, { params })
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 获得转入转出状态列表
 */
export const getTransferStatus = (params) => {
  return new Promise((reslove, reject) => {
    http
      .get(apiUrl.getTransferStatus, { params })
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 获取转入机构
 */
export const getHospitalList = (params) => {
  return new Promise((reslove, reject) => {
    http
      .get(apiUrl.getHospitalList, { params })
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 获取转入机构科室
 */
export const getDeptByHospitalId = (params) => {
  return new Promise((reslove, reject) => {
    http
      .get(apiUrl.getDeptByHospitalId, { params })
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 获得转诊统计数据
 */
export const getReferralStatisticsList = (params) => {
  return new Promise((reslove, reject) => {
    http
      .post(apiUrl.getReferralStatisticsList, { params })
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 查询转入转出列表
 */
export const selectRecordList = (params) => {
  return new Promise((reslove, reject) => {
    http
      .post(apiUrl.selectRecordList, { params })
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 编辑审核记录状态
 */
export const reviewRecord = (params) => {
  return new Promise((reslove, reject) => {
    http
      .post(apiUrl.reviewRecord, {}, params)
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 带权限的部门查询
 */
export const getCurrentUserDept = (params) => {
  return new Promise((reslove, reject) => {
    http
      .get(apiUrl.getCurrentUserDept, { params })
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 根据医院id获取所有机构，湘雅医院获取健康管理平台机构
 */
export const selectAllDeptByHospital = (params) => {
  return new Promise((reslove, reject) => {
    http
      .get(apiUrl.selectAllDeptByHospital, { params })
      .then((res) => {
        let data = res.retData;
        reslove(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 获取转诊详情
 */
export const selectReferralApply = (params) => {
  return new Promise((reslove, reject) => {
    http
      .post(apiUrl.selectReferralApply, {}, params)
      .then((res) => {
        reslove(res.retData);
      })
      .catch((err) => {
        reject(err);
      });
  });
};




