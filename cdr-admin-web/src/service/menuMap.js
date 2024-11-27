import request from '@/plugins/request'

// 查询菜单id对应的路由
export function getMenuMap(){
  return request({
    url: '/getMenuInfoVo',
    method: 'post'
  })
}