const chartTypeValue = ['line', 'pie', 'text', 'gauge', 'bar', 'radar']

const transformer = {
  xAxis(idx, rotate, chartType) {
    return `xAxis: {
      type: 'category',${chartType === 5 ? '' : `
      boundaryGap: false,`}
      data: handledData[${idx}].value,
      axisLabel: {
        rotate: '${rotate}' 
      }
    },`
  },
  yAxis(idx, rotate) {
    return `yAxis: {
      type: 'category',
      data: handledData[${idx}].value,
      axisLabel: {
        rotate: '${rotate}' 
      }
    },`
  },
  changeXY(type, idx, rotate) {
    let str = `${type === 'x' ? 'xAxis' : 'yAxis'}: {
      type: 'category',
      data: handledData[${idx}].value,
      axisLabel: {
        rotate: '${rotate}' 
      }
    },`
    let str2 = `${type === 'x' ? 'yAxis' : 'xAxis'}: {
      type: 'value'
    },`
    let obj = {
      xAxis: '',
      yAxis: ''
    }
    if (type === 'x') {
      obj.xAxis = str
      obj.yAxis = str2
    } else {
      obj.xAxis = str2
      obj.yAxis = str
    }
    return obj
  },

  series(yData, hData, chartType) {
    let newSeries = []
    let str = ``
    yData.forEach((i, index) => {
      let item = hData.find(h => {
        return h.id === i.id
      })
      let obj = {
        data: item.value,
        smooth: i.smooth,
        name: item.label,
        type: chartTypeValue[chartType - 1],
        areaStyle: {
          opacity: item.opacity
        },
        lineStyle: {
          width: i.width
        }
      }
      newSeries.push(obj)

      str += `${
        index === 0
          ? '{'
          : `,
      {`
      }
        name: handledData[${i.id}].label,
        type: '${chartTypeValue[chartType - 1]}',
        smooth: ${i.smooth},
        areaStyle: {
          opacity: ${i.opacity}
        },
        lineStyle: {
          width: ${i.width}
        },
        label: {
          show: ${i.label.show},
          color: '${i.label.color}',
          fontSize: '${i.label.fontSize}',
          fontWeight: '${i.label.fontWeight}'
        },
        data: handledData[${i.id}].value
      }`
    })
    let optStr = `series: [
      ${str}
    ]`

    return {
      newSeries,
      optStr
    }
  },

  color(val) {
    let str = ''
    val.split(',').forEach(i => {
      str += `'${i}', `
    })
    return `color: [${str.substr(0, str.length - 2)}]`
  },

  title(val) {
    let Xstr = ''
    let Ystr = ''
    val.x
      ? Xstr = `x: '${val.x}'`
      : Xstr = `left: '${val.left}'`
    val.y
      ? Ystr = `y: '${val.y}'`
      : Ystr = `top: '${val.top}'`
    return `title: {
      text: '${val.text}',
      ${Xstr},
      ${Ystr},
      textStyle: {
        color: '${val.textStyle.color}',
        fontSize: '${val.textStyle.fontSize}',
        fontWeight: '${val.textStyle.fontWeight}'
      }
    },`
  },

  grid(val) {
    return `grid: {
      left: '${val.left}',
      right: '${val.right}',
      top: '${val.top}',
      bottom: '${val.bottom}',
    }`
  },

  backgroundColor(val) {
    return `backgroundColor: '${val}',`
  },
  RadarOS(val, series, hData){
    console.log(val,"啊啊啊啊啊");
    let str=''
    series.forEach((i,index)=>{
      str += `${
        index === 0
          ? '{'
          : `,
      {`
      }
        type: 'radar',
        lineStyle: {
          width: ${val.width}
        },
        data: handledData.seriesData
      }`
    }
    
    )
    let optStr = `series: [
      ${str}
    ]`
    return optStr

  },
  lineOS(val, series, hData) {
    let str = ''
    series.forEach((i, index) => {
      let idx = hData.findIndex(h => {
        return i.data === h.value
      })
      str += `${
        index === 0
          ? '{'
          : `,
      {`
      }
        name: handledData[${idx}].label,
        type: 'line',
        smooth: ${val.smooth},
        areaStyle: {
          opacity: '${val.opacity ? 0.5 : 0}'
        },
        lineStyle: {
          width: ${val.width}
        },
        label: {
          show: ${i.label.show},
          color: '${i.label.color}',
          fontSize: '${i.label.fontSize}',
          fontWeight: '${i.label.fontWeight}'
        },
        data: handledData[${idx}].value
      }`
    })
    let optStr = `series: [
      ${str}
    ]`
    return optStr
  },
  //仪表盘的其他设置中隐藏刻度
  axisTick(val,series,hData){
    let str=''
    series.forEach((item,index)=>{
      console.log(item,"我的item");
       str += `${
        index === 0
          ? '{'
          : `,
      {`}
          distance:${item.axisTick.distance},
          length:${item.axisTick.length},
          show:${val.show?false:true},
          lineStyle: {
            color: '${item.axisTick.lineStyle.color}',
            width: ${item.axisTick.lineStyle.width}
          }
        },`
    })
    let optStr = `axisTick: ${str}`
    console.log(optStr,"optStr111");
    return optStr
 },
 gaugeOSData(val,series,hData){
  console.log(val,"康康我吧",series,hData);
  let str=`   {
          detail: {
            show:${val[0].detail.show?false:true}
          },
          value: handledData.value
        }`
  let optStr = `data: [
      ${str}
    ]`
  return optStr
 },
  PieOS(val,series,hData){
    let str = ''
    console.log(series,"series8523")
    series.forEach((i, index) => {
      if(val.roseType){
        str += `${
          index === 0
            ? '{'
            : `,
      {`
        }
        type: 'pie',
        radius: ['${val.radius[0]?val.radius[0]:''}','${val.radius[1]?val.radius[1]:''}'],
        roseType: '${val.roseType?'radius':''}',
        data: handledData
      }`
      }else{
        str += `${
          index === 0
            ? '{'
            : `,
      {`
        }
        type: 'pie',
        radius:['${val.radius[0]?val.radius[0]:''}','${val.radius[1]?val.radius[1]:''}'],
        data:handledData
      }`
      }

    })
    let optStr = `series: [
      ${str}
    ]`
    return optStr
  },
  legend(val, hData, chartType) {
    let Xstr = ''
    let Ystr = ''
    val.x
      ? Xstr = `x: '${val.x}'`
      : Xstr = `left: '${val.left}'`
    val.y
      ? Ystr = `y: '${val.y}'`
      : Ystr = `top: '${val.top}'`

    if ([2, 6].includes(chartType)) {
      let optStr = `legend: {
        show: ${val.show},
        orient: '${val.orient}',
        ${Xstr},
        ${Ystr},
        textStyle: {
          fontSize: '0.75rem'
        }
      },`
      return optStr
    }
    let str = ''
    val.data.forEach(i => {
      let idx = hData.findIndex(h => {
        return h.label === i
      })
      str += `handledData[${idx}].label, `
    })
    let dataStr = `[${str.substr(0, str.length - 2)}]`
    let optStr = `legend: {
      show: ${val.show},
      orient: '${val.orient}',
      data: ${dataStr},
      ${Xstr},
      ${Ystr},
      textStyle: {
        fontSize: '0.75rem'
      }
    },`
    return optStr
  },

  legendDataChange(val, option) {
    let Xstr = ''
    let Ystr = ''
    option.x
      ? Xstr = `x: '${option.x}'`
      : Xstr = `left: '${valoption.left}'`
      option.y
      ? Ystr = `y: '${option.y}'`
      : Ystr = `top: '${option.top}'`
    
    let str = ''
    val.forEach(i => {
      str += `handledData[${i.id}].label, `
    })
    let dataStr = `[${str.substr(0, str.length - 2)}]`
    let optStr = `legend: {
      show: ${option.show},
      orient: '${option.orient}',
      data: ${dataStr},
      ${Xstr},
      ${Ystr},
      textStyle: {
        fontSize: '0.75rem'
      }
    },`
    return optStr
  },

  seriesLabel(val, series, hData, chartType) {
    let str = ''
    series.forEach((i, index) => {
      let idx = hData.findIndex(h => {
        return i.data === h.value
      })
      str += `${
        index === 0
          ? '{'
          : `,
      {`
      }
        name: handledData[${idx}].label,
        type: '${chartTypeValue[chartType - 1]}',
        smooth: ${i.smooth},
        areaStyle: {
          opacity: '${i.areaStyle.opacity}'
        },
        lineStyle: {
          width: ${i.lineStyle.width}
        },
        label: {
          show: ${val.show},
          color: '${val.color}',
          fontSize: '${val.fontSize}',
          fontWeight: '${val.fontWeight}'
        },
        data: handledData[${idx}].value
      }`
    })
    let optStr = `series: [
      ${str}
    ]`
    return optStr
  }
}

export default transformer
