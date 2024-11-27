import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // request timeout
  timeout: 60 * 1000
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    let state = store.state
    if (state.user.token) config.headers.token = state.user.token
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    //response.headers['content-type']!="multipart/form-data"是为了处理导出的情况下
    if (((response.headers['content-type'] !== "multipart/form-data" && response.headers['content-type'] !== "application/vnd.ms-excel;charset=utf-8") && res.errCode !== 0 && res.errCode !== 200 &&res.errCode !== 30006 ) || response.status != 200) {
      if (res.errCode === 20002) {
        return Promise.reject(res)
      }
      Message({
        message: res.returnMsg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      const { data } = response
      const { errCode } = data
      // 状态码为0||200表示api成功
      if (errCode === 0) {
        return data.rsp
      } else if (errCode === 200) {
        return data
      } else {
        return res
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg || error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
