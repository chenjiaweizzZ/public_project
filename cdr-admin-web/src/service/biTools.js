import request from "@/plugins/request";

// 获取大屏背景列表
export function getLargeScreenList(params) {
  return request({
    url: "/getLargeScreenList",
    method: "post",
    params,
  });
}

// 获取表单里的系统模板列表
export function getDictionaryByType(params) {
  return request({
    url: "/getDictionaryByType",
    method: "post",
    params,
  });
}

// 新增和复制大屏背景
export function addLargeScreen(params) {
  return request({
    url: "addLargeScreen",
    method: "post",
    params,
  });
}

// 发布大屏背景
export function releaseLargeScreen(params) {
  return request({
    url: "releaseLargeScreen",
    method: "post",
    params,
  });
}

// 删除大屏背景
export function deleteLargeScreen(params) {
  return request({
    url: "deleteLargeScreen",
    method: "post",
    params,
  });
}

// 编辑大屏名字和描述
export function updateLargeScreenName(params) {
  return request({
    url: "updateLargeScreenName",
    method: "post",
    params,
  });
}

export function isChange(params) {
  return request({
    url: "isChange",
    method: "post",
    params,
  });
}

export function viewStatistics(params) {
  return request({
    url: "viewStatistics",
    method: "post",
    params,
  });
}

// 获取域列表及其表数量
export function getStatisticsDetail(params) {
  return request({
    url: "/getStatisticsDetail",
    method: "post",
    params,
  });
}

// 更新指标配置
export function updateStatistics(data) {
  return request({
    url: "/updateStatistics",
    method: "post",
    data,
  });
}
// 获取大屏详情数据
export function getScreenDetail(params) {
  return request({
    url: "/getLargeScreenDetail",
    method: "post",
    params,
  });
}
export function getReleaseLargeScreen(params) {
  return request({
    url:"/getReleaseLargeScreen",
    method:"post",
    params,
  })
}
// 编辑大屏
export function saveLargeScreen(data) {
  return request({
    url: "/updateLargeScreen",
    method: "post",
    data,
  });
}
//获取指标列表
export function getStatisticsList(data) {
  return request({
    url: "/getStatisticsList",
    method: "post",
    data,
  });
}
//分类管理
//获取分类列表
export function getStatisticsClassList(params) {
  return request({
    url: "/getStatisticsClassList",
    method: "post",
    params,
  });
}
//新增分类
export function addStatisticsClass(params) {
  return request({
    url: "/addStatisticsClass",
    method: "post",
    params,
  });
}
//删除分类
export function deleteStatisticsClass(params) {
  return request({
    url: "/deleteStatisticsClass",
    method: "post",
    params,
  });
}
//修改分类
export function updateStatisticsClass(params) {
  return request({
    url: "/updateStatisticsClass",
    method: "post",
    params,
  });
}
//查看分类是否含有指标
export function isExistStatistics(params) {
  return request({
    url: "/isExistStatistics",
    method: "post",
    params,
  });
}
//统计图帮助相关
export function getStatisticsHelp(params) {
  return request({
    url: "/getStatisticsHelp",
    method: "post",
    params,
  });
}

//新增指标
export function addStatistics(data) {
  return request({
    url: "/addStatistics",
    method: "post",
    data,
  });
}

//复制指标
export function copyStatistics(data) {
  return request({
    url: "/copyStatistics",
    method: "post",
    data,
  });
}


//删除指标
export function deleteStatistics(params) {
  return request({
    url: "/deleteStatistics",
    method: "post",
    params,
    });
}


//通用查询维护相关接口 查询接口列表
export function getSelectConfigList(params) {
  return request({
    url: "/getSelectConfigList",
    method: "post",
    params,
  });
}

// 查询接口详情
export function getSelectConfigDetail(params) {
  return request({
    url: "/getSelectConfigDetail",
    method: "post",
    params,
  });
}
//通用查询接口
export function selectDataList(data) {
  return request({
    url: "/selectDataList",
    method: "post",
    data,
  });
}



