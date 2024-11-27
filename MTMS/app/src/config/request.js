import axios from 'axios'

if (typeof Promise.prototype.done !== 'function') {
    Promise.prototype.done = Promise.prototype.then
}

if (typeof Promise.prototype.fail !== 'function') {
    Promise.prototype.fail = Promise.prototype.catch
}

Promise.prototype.finally = function (callback) {
    let P = this.constructor
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
            throw reason
        })
    )
}

export const config = {
    /**默认当前域名 */
    // baseURL: process.env.VUE_APP_API_URL,
    timeout: 60000,
    responseType: 'json',
    method: 'post'
}

const handleError = (error) => {
    // 打印到控制台
    if (process.env.NODE_ENV === 'development') {
        console.log(error)
    }
}

const request = axios.create(config)

//请求拦截
request.interceptors.request.use(
    (config) => {
        console.log(`网络请求:${config.url}`)
        return config
    },
    (error) => {
        // 请求错误
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    (response) => {
        if (!response) return Promise.reject()
        const res = response.data
        const data = res['1'] || res
        // const { resCode } = res
        // if (resCode && resCode!=200 || !resCode && data.errcode!="0"){
        //     handleError({ 'message': data.errdesc })
        //     return Promise.reject(data)
        // }
        return Promise.resolve(data == undefined ? {} : data)
    },

    (error) => {
        const status = error.response && error.response.status
        switch (status) {
            case 400: error.message = '请求错误'; break
            case 401: error.message = '未授权，请登录'; break
            case 403: error.message = '拒绝访问'; break
            case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
            case 408: error.message = '请求超时'; break
            case 500: error.message = '服务器内部错误'; break
            case 501: error.message = '服务未实现'; break
            case 502: error.message = '网关错误'; break
            case 503: error.message = '服务不可用'; break
            case 504: error.message = '网关超时'; break
            case 505: error.message = 'HTTP版本不受支持'; break
            default: break
        }

        handleError(error)
        throw error
    }
)

export default request
