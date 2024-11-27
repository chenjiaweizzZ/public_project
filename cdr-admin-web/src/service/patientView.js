import request from '@/plugins/request'

//单层数据通用查询接口
export function selectDataList(data){
  return request({
    url: '/selectDataList',
    method: 'post',
    data
  })
}
