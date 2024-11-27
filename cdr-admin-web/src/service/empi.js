// empi相关接口
import request from '@/plugins/request'

//获取当前合并配置
export function getMergeConfig() {
  return request({
    url: '/empi/getMergeConfig',
    method: 'post',

  })
}
//获取合并配置下拉选项
export function getMergeField() {
  return request({
    url: '/empi/getMergeField',
    method: 'post'
  })
}
//保存当前合并配置
export function saveMergeConfig(data) {
  return request({
    url: '/empi/saveMergeConfig',
    method: 'post',
    data
  })
}

// 患者主索引相关页面
// 患者主索引获取患者主索引列表
export function listPatientVo(params) {
  return request({
    url: '/empi/listPatientVo',
    method: 'post',
    params
  })
}
export function checkMergeList(data) {
  return request({
    url: '/empi/checkMergeList',
    method: 'post',
    data
  })
}


// 拆分患者页面数据
export function splitPatientData(params) {
  return request({
    url: '/empi/splitPatientData',
    method: 'post',
    params
  })
}
// 拆分患者
export function split(data) {
  return request({
    url: '/empi/split',
    method: 'post',
    data
  })
}
// 操作日志（历史记录）
export function logList(params) {
  return request({
    url: '/empi/logList',
    method: 'post',
    params
  })
}
// 患者基本详细信息
export function patientInformation(params) {
  return request({
    url: '/empi/patientInformationByBusinessId',
    method: 'post',
    params
  })
}
// 患者基本详细信息/patientInformationById
export function patientInformationById(params) {
  return request({
    url: '/empi/patientInformationById',
    method: 'post',
    params
  })
}
// 患者基本详细信息/patientInformation
export function patientInformationByPid(params) {
  return request({
    url: '/empi/patientInformation',
    method: 'post',
    params
  })
}
// 合并患者
//合并对比列表
export function mergeViewData(data) {
  return request({
    headers: {
      "Content-Type": "application/json",
    },
    url: "/empi/mergeViewData",
    method: "post",
    data,
  })
}
//下拉框字典
export function getEnumList() {
  return request({
    url: "/empi/getEnumList",
    method: "post",
  })
}
//手动合并
export function merge(data) {
  return request({
    headers: {
      "Content-Type": "application/json",
    },
    url: "/empi/merge",
    method: "post",
    data,
  })
}
//选取出生地
export function getProvinceList(params) {
  return request({
    url: "/empi/getProvinceList",
    method: "post",
    params,
  })
}

