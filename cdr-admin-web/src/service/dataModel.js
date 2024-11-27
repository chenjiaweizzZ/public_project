import request from '@/plugins/request'

// 获取域列表及其表数量
export function getTableClassList() {
  return request({
    url: '/getTableClassList',
    method: 'post'
  })
}

// 获取域类型列表
export function getTableClassTypeList() {
  return request({
    url: '/getTableClassTypeList',
    method: 'post'
  })
}

// 新增域
export function addTableClass(params) {
  return request({
    url: '/addTableClass',
    method: 'post',
    params
  })
}
// 获取表列表及其详细字段
export function getDataAndFieldList(params) {
  return request({
    url: '/getDataAndFieldList',
    method: 'post',
    params
  })
}

// 新增表
export function addTable(data) {
  return request({
    url: '/addTable',
    method: 'post',
    data
  })
}

// 根据字典type获取字典列表
export function updateTable(data) {
  return request({
    url: '/updateTable',
    method: 'post',
    data
  })
}

// 根据字典type获取字典列表
export function getDictionaryByType(params) {
  return request({
    url: '/getDictionaryByType',
    method: 'post',
    params
  })
}

// 获取元数据列表
export function getTableDictionaryList(params) {
  return request({
    url: '/getTableDictionaryList',
    method: 'post',
    params
  })
}

// 导出表
export function handleExportTable(params) {
  return request({
    url: '/exportTable',
    method: 'post',
    responseType: 'blob',
    params
  })
}

// 导入表
export function handleImportTable(params, data) {
  console.log('handleImportTable data', data)
  return request({
    headers: {
      "Content-Type": "pplication/vnd.ms-excel",
    },
    url: '/importTable',
    method: 'post',
    params,
    data
  })
}