// import axios from 'axios'
import widget from '../utils/widget'
import ASE from '../utils/ASE.js'

// axios.defaults.timeout = 15000
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'

// export const request = (option) => {
//   option = JSON.parse(JSON.stringify(option))
//   const isLoading = option.isLoading
//   if (isLoading) {
//     widget.hideLoading();
//     widget.loading()
//   }

//   return new Promise((resolve, reject) => {
//     axios(option).then((response) => {
//       if (response.status === 200) {
//         if (response.data.ret_code == 0) {
//           resolve(response.data.ret_data)
//         } else {
//           widget.toast(response.data.ret_info ||  '系统异常，请稍后再试')
//           reject()
//         }
//       } else {
//         widget.toast('系统异常，请稍后再试')
//         reject()
//       }
//     }).catch((error) => {
//       widget.toast('系统异常，请稍后再试', 'cancel')
//       reject()
//     }).finally(() => {
//       if (isLoading) {
//         widget.hideLoading();
//       }
//     })
//   })
// }

// export const get = (url, params, option = {}) => {
//   if( Object.prototype.toString.call(url) === '[Object Object]' ) {
//     return request(url)
//   } else if(typeof url === 'string') {
//     option.url = url
//     option.params = option.params || params
//     return request(option)
//   } else {
//     throw new Error("参数错误")
//   }
// }

// export const post = (url, params, option = {}) => {
//   if( Object.prototype.toString.call(url) === '[Object Object]' ) {
//     return request(url)
//   } else if(typeof url === 'string') {
//     option.method = 'post'
//     option.url = url
//     option.data = option.data || params
//     return request(option)
//   } else {
//     throw new Error("参数错误")
//   }
// }

import axios from 'axios'
import Vue from 'vue'
import qs from 'qs'
// import store from '@/store'
// import router from '@/router'
// axios.defaults.timeout = 20000
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.post['Content-Type'] = 'application/json'

const axiosInsance = axios.create({
	timeout: 15000
})

axiosInsance.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'
axiosInsance.defaults.headers.post['Content-Type'] = 'application/json'

// const get = (url, params, custom) =>  {
//   return axiosInsance.request({
//     ...arguments
//   })
// }

// const post = (url, data, custom) =>  {
//   return axiosInsance.request({
//     method: 'post',
//     ...arguments
//   })
// }

//请求拦截器
let apiLoading = false
axiosInsance.interceptors.request.use(
	(request) => {
		if (['post', 'put', 'patch'].includes(request.method)) {
			if (request.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
				request.data = qs.stringify({ ...request.data })
			} else if (request.headers['Content-Type'] !== 'multipart/form-data') {
				request.data = JSON.stringify({ ...request.data })
			}
		}	
		if (localStorage.getItem('openId') || localStorage.getItem('userInfo')) {
			request.headers.common['openId'] = localStorage.getItem('openId')
				? localStorage.getItem('openId')
				: JSON.parse(localStorage.getItem('userInfo')).openId ? JSON.parse(localStorage.getItem('userInfo')).openId : ''
		}else{
			delete request.headers.common['openId']
		}
		if (sessionStorage.getItem('token')) {
			request.headers.common['token'] = sessionStorage.getItem('token')
		}
		const { isLoading = false } = request
		apiLoading = isLoading
		if (apiLoading) {
			widget.hideLoading()
			widget.loading()
		}
		return request
	},
	(error) => {
		return Promise.reject(error)
	}
)

const showErrorMessage = (message) => {
	//widget.toast(message)
	if (Vue.prototype.toast) {
		widget.toast(message)
	} else {
		alert(message)
	}
}

// 响应拦截器
axiosInsance.interceptors.response.use(
	(response) => {
		if (apiLoading) {
			widget.hideLoading()
			widget.loading()
		}
		if (response.data.data) {
			let data = JSON.parse(ASE.decrypt(response.data.data))
			if (data.retCode === 0) {
				return data
			} else {
				showErrorMessage(data.retInfo)
				return Promise.reject(data)
			}
		} else if (response.data.hasOwnProperty('ret_code')) {
			if (response.data.ret_code === 0) {
				return response.data.ret_data
			} else {
				showErrorMessage(response.data.ret_info)
				return Promise.reject(response.data)
			}
		}else if(response.data.error){
			// showErrorMessage(response.data.retInfo)
			return Promise.reject(response.data.retInfo);
		} else {
			if (response.data) {
				return response.data
			} else {
				showErrorMessage('系统异常，请稍后重试')
				return Promise.reject(response.data)
			}
		}
	},
	(error) => {
		console.log('error.response', error)
		console.log(11, error.response.retCode)
		if (apiLoading) {
			widget.hideLoading()
			widget.loading()
		} else if (error.response.status == '404') {
			showErrorMessage('404, not found!')
		} else if (error.response.data.retCode == 11003) {
			showErrorMessage('账号已在其他地方登录')
			localStorage.clear();
			return Promise.reject(response.retCode)
			// return Promise.reject(error)
		} else {
			showErrorMessage('系统异常，请稍后重试')
		}
		return Promise.reject(error)
	}
)

export { axiosInsance }
