import request from '@/plugins/request'

// 获取字典
export function getDictionaryByType(params) {
  return request({
    url: '/getDictionaryByType',
    method: 'post',
    params
  })
}

// 查询接口列表
export function getSelectConfigList(params) {
  return request({
    url: '/getSelectConfigList',
    method: 'post',
    params
  })
}

// 查询接口列表
export function creatSelectSql(data) {
  return request({
    url: '/creatSelectSql',
    method: 'post',
    data
  })
}

// 发布接口
export function releaseSelectSql(params) {
  return request({
    url: '/releaseSelectSql',
    method: 'post',
    params
  })
}

// 删除接口
export function deleteSelectSql(params) {
  return request({
    url: '/deleteSelectSql',
    method: 'post',
    params
  })
}

// 查询接口Sql详情
export function getSelectConfigSql(params) {
  return request({
    url: '/getSelectConfigSql',
    method: 'post',
    params
  })
}

// 查询接口详情
export function getSelectConfigDetail(params) {
  return request({
    url: '/getSelectConfigDetail',
    method: 'post',
    params
  })
}

// 查询接口出入参
export function getSelectParam(params) {
  return request({
    url: '/getSelectParam',
    method: 'post',
    params
  })
}

// 调试
export function debugSQL(data) {
  return request({
    url: '/selectDataList',
    method: 'post',
    data
  })
}


/* SQLConfig */
// 获取域列表及其表数量
export function getTreeData(params) {
  return request({
    url: '/getTableClassVO',
    method: 'post',
    params
  })
}

// 获取表列表及其详细字段
export function getTableFieldList(params) {
  return request({
    url: '/getTableFieldList',
    method: 'post',
    params
  })
}

// 保存编辑查询接口
export function updateSelectSql(data) {
  return request({
    url: '/updateSelectSql',
    method: 'post',
    data
  })
}

