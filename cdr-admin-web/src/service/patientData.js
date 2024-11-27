import request from "@/plugins/request";
// 查询标准字典
export function patientTableClassVo(params) {
  return request({
    url: "/patientTableClassVo",
    method: "post",
    params,
  });
}

export function getTableFieldList(params) {
  return request({
    url: "/getTableFieldList",
    method: "post",
    params,
  });
}

export function getPatientPageResponse(data) {
  return request({
    url: "/getPatientPageResponse",
    method: "post",
    data,
  });
}

export function getPatientTableData(data) {
  return request({
    url: "/getPatientTableData",
    method: "post",
    data,
  });
}

export function exportPatientPageResponse(data) {
  return request({
    url: "exportPatientPageResponse",
    method: "post",
    data,
  });
}
