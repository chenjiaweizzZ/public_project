import { MessageBox, Message } from 'element-ui'

const utils = {
  /**
   * 函数防抖
   * @param fn {Function}   实际要执行的函数
   * @param delay  {Number} 延迟时间，单位是毫秒（ms）
   * @return {Function}
   */
  debounce(fn, delay) {
    // 维护一个 timer
    let timer = null
    // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
    return function () {
      // 保存函数调用时的上下文和参数，传递给 fn
      let context = this
      let args = arguments
      // 函数被调用，清除定时器
      if (timer) clearTimeout(timer)
      // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），再过 delay 毫秒就执行 fn
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  },

  /**
   * 深拷贝
   * @param source {Object} 源对象
   * @param target {Object} 目标对象
   * @return {Object} 目标对象
   */
  deepCopy(source, target) {
    target = target || {}
    for (let i in source) {
      if (source[i] === null) {
        target[i] = null
        continue
      }
      if (typeof source[i] === 'object') {
        target[i] = source[i].constructor === Array ? [] : {}
        this.deepCopy(source[i], target[i])
      } else {
        target[i] = source[i]
      }
    }
    return target
  },

  /**
   * query组装(转换规则：将 Object key:value => key=value,且value不能为null '' undefined)
   * @param source {Object} 源query对象
   * @return {String} 目标query字符
   */
  queryEquipment(source) {
    if (typeof source === 'object') {
      let resultStr = '?'
      Object.keys(source).forEach(key => {
        if (source[key]) resultStr += `${key}=${source[key]}&`
      })
      return resultStr.substr(0, resultStr.length - 1)
    } else {
      throw new Error('queryEquipment source should be an object')
    }
  },

  /**
   * 消息提示
   * @param  {type: String} 提示类型：success warning error
   * @param  {msg: String}  提示文字
   * @return 
   */
  showMessage(type = 'success', msg = '成功') {
    Message({
      message: msg,
      type: type,
      duration: 5 * 1000
    })
  },
  /**
   * 非空数组判断 
   */
  isNEArray(arr) {
    return Array.isArray(arr) && arr.length > 0
  },

  // 接收一个blob流的数据，和文件名
  download(data, name) {
    let linkElement = document.createElement('a')
    let blob = new Blob([data], {
      type: 'application/octet-stream'
    })
    let url = window.URL.createObjectURL(blob)
    var timestamp = Date.parse(new Date())
    let fileName = timestamp + '.csv'
    linkElement.setAttribute('href', url)
    linkElement.setAttribute('download', fileName)
    let clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false
    })
    linkElement.dispatchEvent(clickEvent)
  },

  //计算年龄
  getAge(strAge, dateEnd = new Date()) {
    let dateStart = new Date(strAge)
    let obj = {
      type: 0,
      data: {}
    }
    let sub = dateEnd - dateStart
    if (sub < 0) return false
    let day = Math.floor(sub / (1000 * 60 * 60 * 24))
    if (day === 0) {
      obj.type = 1
      obj.data.month = 0
      obj.data.day = 1
    } else if (day < 365) {
      obj.type = 1
      obj.data.month = Math.floor(day / 30)
      obj.data.day = day % 30
    } else {
      obj.data.year = Math.floor(day / 365)
    }
    return obj
  },
  
  //格式化日期 yyyy-MM-dd
  formatDate(date) {
    let myyear = date.getFullYear()
    let mymonth = date.getMonth() + 1
    let myweekday = date.getDate()
    if (mymonth < 10) {
      mymonth = '0' + mymonth
    }
    if (myweekday < 10) {
      myweekday = '0' + myweekday
    }
    return myyear + '-' + mymonth + '-' + myweekday
  }
}

export default utils
