import _ from '@/utils'
import transformer from './transformer'
const utils = {
  /**
   * 执行动态可带入参js代码，并返回结果
   * @param params {Object} 入参
   * @param code  {String} js代码
   * @return {Object}
   */
  dynamic(params, code) {
    try {
      let fn = new Function(`return ${code}`)
      let data = fn()(params)
      return {
        status: true,
        msg: 'success',
        data
      }
    } catch (error) {
      return {
        status: false,
        msg: error,
        data: null
      }
    }
  },

  /**
   * 获取echarts option
   * @param {apiParameterVos: 数据源, apiCode: 数据源处理代码, configJson: option组装代码}
   * @return {
   *    status: Boolean,
   *    msg: String,
   *    data: Object
   * }
   */
  getOption({ apiParameterVos, apiCode, configJson }) {
    if (!_.isNEArray(apiParameterVos) || !apiCode || !configJson.code) {
      return {
        status: false,
        msg: '指标数据源或数据处理代码缺失，请校验',
        data: null
      }
    }
    if (!apiParameterVos[0].result.rsp) {
      _.showMessage('error', '接口数据获取异常，rsp为空')
      return {
        status: false,
        msg: '指标数据源或数据处理代码缺失，请校验',
        data: null
      }
    }
    let sourceData = apiParameterVos[0].result.rsp.data
    let handledCode = apiCode
    let optCode = configJson.code

    let handledData = this.dynamic(sourceData, handledCode)
    if (handledData.status) {
      let option = this.dynamic(handledData.data, optCode)
      if (option.status) {
        return {
          status: true,
          msg: 'success',
          data: option.data
        }
      } else {
        return {
          status: false,
          msg: 'error',
          data: null
        }
      }
    } else {
      return {
        status: false,
        msg: 'error',
        data: null
      }
    }
  },

  /**
   * 替换echarts options颜色
   * @param {optionCode: echarts options代码, colorVal: 颜色值字符串}
   * @return String
   */
  changeColor(optionCode, colorVal) {
    return optionCode.replace(/color:\s\[[\s\S]*?\]/g, transformer.color(colorVal))
  },

  /**
   * 字符串替换中转
   * @param {type: 替换类型, optStr: 原字符串, str: 目标字符串|对象}
   * @return {String}
   */
  transferStation(type, optStr, str) {
    let result = ''
    switch (type) {
      case 'series':
        const seriesReg = /series[\s\S]*\]/g
        result = optStr.replace(seriesReg, str)
        break
      case 'xAxis':
        const xAxisReg = /xAxis:[\s\S]*?\},/g
        result = optStr.replace(xAxisReg, str)
        break
      case 'yAxis':
        const yAxisReg = /yAxis:[\s\S]*?\},/g
        result = optStr.replace(yAxisReg, str)
        break
      case 'color':
        const colorReg = /color:\s\[[\s\S]*?\]/g
        result = optStr.replace(colorReg, str)
        break
      case 'title':
        const titleReg = /title[[\s\S]*?\},/g
        result = optStr.replace(titleReg, str)
        break
      case 'grid':
        const gridReg = /grid[[\s\S]*?\}/g
        result = optStr.replace(gridReg, str)
        break
      case 'backgroundColor':
        const backgroundColorReg = /backgroundColor[[\s\S]*?',/g
        result = optStr.replace(backgroundColorReg, str)
        break
      case 'legend':
        const legendReg = /legend[[\s\S]*?\},/g
        result = optStr.replace(legendReg, str)
        break
      case 'xyChange':
        const xChangeReg = /xAxis:[\s\S]*?\},/g
        const yChangeReg = /yAxis:[\s\S]*?\},/g
        optStr = optStr.replace(xChangeReg, str.xAxis)
        result = optStr.replace(yChangeReg, str.yAxis)
        break
      case 'axisTick':
        const axisTickReg = /axisTick[\s\S]*?\},/g
        result = optStr.replace(axisTickReg, str)
        break
      case 'gaugeOSData':
        const dataReg = /data[\s\S]*?\]/g
        result = optStr.replace(dataReg, str)
      default:
        break
    }
    return result
  },
  /**
   * 获取文字数据
   * @param {textMap <Array>: 替换类型, handledData <Array>: 处理后数据}
   * @return {Object}
   */
  getTextData(textMap, handledData) {
    let result = []
    textMap.forEach(i => {
      let obj = {
        label: i.label,
        value: ''
      }
      if (i.type === 1) {
        obj.value = i.value1
      } else {
        let item = handledData.find(h => {
          return h.label === i.value2
        })
        if (item) obj.value = item.value
      }
      result.push(obj)
    })
    return result
  },

  /**
   * 判断文字数据对象是否相等
   * @param {data <Array>: 修改后数据, map <Array>: 数据源}
   * @return {Boolean}
   */
  textDataIsEqual(data, map) {
    return (
      data[0][`value${data[0].type}`] === map[0][`value${map[0].type}`] &&
      data[1][`value${data[1].type}`] === map[1][`value${map[1].type}`]
    )
  },


  /**
   * 返回纯数字字符
   * @param {str <String>: 需校验的字符串}
   * @return {String}
   */
  matchNumString(str) {
    const reg = /\d/g
    const arr = [...str.matchAll(reg)]
    let result = ''
    arr.forEach(i => {
      result += i[0]
    })
    return result
  }
}

export default utils
