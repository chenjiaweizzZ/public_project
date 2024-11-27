import dayjs from 'dayjs'
import idCard from 'idcard'
import Vue from 'vue'
let utils = {
  /**敏感信息脱敏
   * type: 1 姓名；2 手机号； 3 身份证号； 4 住址
   */
  shield(value, type) {
    if (!value) {
      return value
    }
    let isShieldUser = sessionStorage.getItem('isShieldUser')
    let isShieldPhone = sessionStorage.getItem('isShieldPhone')
    switch (type) {
      case 1:
        if (isShieldUser) {
          let pat = /([^\x00-\xff]{1})([^\x00-\xff]{1})*/g
          return value.length > 2 ? value.replace(pat, "$1*$2") : value.replace(pat, "$1*")
        }
        return value
        break
      case 2:
        if (isShieldPhone) {
          return value.replace(/(\d{3})\d*(\d{4})/g, "$1" + "****" + "$2")
        }
        return value
        break
      case 3:
        if (isShieldUser) {
          return value.replace(/(\d{4})\d*(\d{3})/g, "$1" + "********" + "$2")
        }
        return value
        break
      case 4:
        if (isShieldUser) {
          return value.replace(/(\d{1})\d*/g, "**")
        }
        return value
        break
    }
  },
  //格式化时间
  formatDate(date, format = 'YYYY-MM-DD') {
    if (date === undefined || date) {
      return dayjs(date).format(format)
    } else {
      return ''
    }
  },
  dateSpan(date1, date2) {
    let d1 = dayjs(date1)
    let d2 = dayjs(date2)
    return d1.diff(d2, 'day')
  },
  addDate(date, dateSpan) {
    return dayjs(date, 'YYYY-MM-DD').add(dateSpan, 'days').format('YYYY-MM-DD')
  },
  formatTableDate(format = 'YYYY-MM-DD') {
    return function (row, col, value) {
      if (!value) {
        return ''
      }
      return dayjs(value).format(format)
    }
  },
  formatTableAge(row, col, value) {
    return utils.getAge(value);
  },
  shieldName(row, col, value) {
    return utils.shield(value, 1)
  },
  shieldName(row, col, value) {
    return utils.shield(value, 1)
  },
  shieldPhone(row, col, value) {
    return utils.shield(value, 2)
  },
  //获取年龄
  getAge(start, end, hasunit = true) {
    if (!start) {
      return ''
    }
    start = dayjs(start.replace('T', ' ')).format('YYYY-MM-DD')
    end = dayjs(end).format('YYYY-MM-DD')
    start = start.split("-");
    end = end.split("-");
    let temp = (end[0] - start[0]) * 12 + (end[1] - start[1]) + (end[2] - start[2] >= 0 ? 0 : -1);
    if (temp < 12) {
      return temp + (hasunit ? '个月' : '')
    } else {
      return parseInt(temp / 12) + (hasunit ? '岁' : '')
    }
  },
  //格式化检查，检验内容
  formatFollowupContent(row) {
    let content = ''
    if (row.flupType === '定期检查') {
      let arr = row.flupContent.split(',')
      arr.forEach((element, i) => {
        if (i !== 0) {
          content += '，'
        }
        content += element.split('|')[4]
      })
    } else if (row.flupType === '定期检验') {
      let arr = row.flupContent.split(',')
      arr.forEach((element, i) => {
        if (i !== 0) {
          content += '，'
        }
        content += element.split('|')[0]
      })
    } else {
      content = row.flupContent
    }
    return content
  },
  getDeptNameByQu(value, ObjArr) {
    return ObjArr.find((item) => {
      return item.Value === value
    }).Text
  },
  getDeptNameByQuV2(value, ObjArr) {
    let dept = ObjArr.find((item) => {
      return item.serialNo === value
    })
    return dept ? dept.deptName : ''
  },
  getInfoByIdCard(v) {
    if (v.length == 15) {
      let obj = idCard.upgrade15To18(v)
      if (obj.code == 0) {
        v = obj.card
      } else {
        return false
      }
    }
    let info = idCard.info(v)
    if (!info.valid) {
      return false
    }
    let sexMap = {
      'M': '男',
      'F': '女'
    }

    return {
      sex: sexMap[info.gender],
      birthday: info.birthday.toString().slice(0, 4) + '-' + info.birthday.toString().slice(4, 6) + '-' + info.birthday.toString().slice(6),
      age: info.age
    }
  },
  isDef(value) {
    return value !== undefined && value !== null
  },
  //还原检查检验
  regressList(original, addx, editIndex) {
    let arrfuContent = [];
    let serialNo = null
    if (!original) {
      addx.splice(editIndex, 1)
      addx.forEach(element => {
        if (element.fuContent) {
          arrfuContent.push(element.fuContent)
        }
      })
      addx[0].fuContent = arrfuContent.join(',')
      return addx[0]
    }
    arrfuContent.push(original.fuContent)
    if (addx.length != 0) {
      serialNo = addx[0].serialNo
    }
    if (editIndex == 0 || editIndex) {
      addx.splice(editIndex, 1)
    }
    addx.forEach(element => {
      if (element.fuContent) {
        arrfuContent.push(element.fuContent)
      }
      if (element.serialNo) {
        serialNo = element.serialNo
      }
    })
    original.fuContent = arrfuContent.join(',')
    original.serialNo = serialNo
    return original
  },
  /**
    * 校验数学公式是否正确
    * @param 公式字符串
    * @returns true: 正确、false-错误
    */
  checkFormula(str, arr) {
    if (str === "") return false
    //首位是运算符
    if (arr[0].name === '运算符') return false
    //没有题目
    if (!arr.filter(i => i.key === 'subject').length) return false
    //有题目没有数值没有运算符
    if (arr.filter(i => i.key === 'subject').length && !arr.filter(i => i.key === 'number').length && !arr.filter(i => i.key === 'symbol').length) return false
    //有题目有数值没有运算符
    if (arr.filter(i => i.key === 'subject').length && arr.filter(i => i.key === 'number').length && !arr.filter(i => i.key === 'symbol').length) return false
    //有题目没有运算符
    if (arr.filter(i => i.key === 'subject').length && !arr.filter(i => i.name === '运算符').length) return false
    //题目相邻或题目后直接跟数值
    for (let index = 0; index < arr.length; index++) {
      const el = arr[index];
      if (el.key === 'subject') {
        if (index === 0) {
          if (el.key === arr[index + 1].key || arr[index + 1].key === 'number') {
            return false
          }
        } else if (index === arr.length - 1) {
          if (el.key === arr[index - 1].key || arr[index - 1].key === 'number') {
            return false
          }
        } else if (el.key === arr[index + 1].key || arr[index + 1].key === 'number' || arr[index - 1].key === 'number') {
          return false
        }
      } else {
        if (index === 0) {
          if (el.name === arr[index + 1].name) {
            return false
          }
        } else if (index === arr.length - 1) {
          if (el.name === arr[index - 1].name) {
            return false
          }
        } else if (el.name === arr[index + 1].name) {
          return false
        }
      }
    }
    try {
      var tmp = str.replace(/[a-zA-Z]+[0-9]*/g, 10)
      eval(tmp)
      return true
    } catch (err) {
      return false
    }
  },
  // 数值输入框校验
  onlyNumOnePoint(value) {
    //先把非数字的都替换掉，除了数字和小数点
    value = value.replace(/[^\d.]/g, "");
    //必须保证第一个为数字而不是小数点
    value = value.replace(/^\./g, "");
    //保证只有出现一个小数点而没有多个小数点
    value = value.replace(/\.{2,}/g, ".");
    //保证小数点只出现一次，而不能出现两次以上
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    //保证只能输入两个小数  
    // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
    if (value > 9999) value = value.substring(0, 4);
    return value;
  },
  //计算两个日期之间的差值（天/时/分/秒）
  GetDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    startTime = startTime.replace(/\-/g, '/');
    endTime = endTime.replace(/\-/g, '/');
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime); //开始时间
    var eTime = new Date(endTime); //结束时间

    // if (sTime > eTime) {
    //   alert('开始时间不能大于结束时间!!!');
    //   return false;
    // }

    //作为除数的数字
    var divNum = 1;
    switch (diffType) {
      case 'second':
        divNum = 1000;
        break;
      case 'minute':
        divNum = 1000 * 60;
        break;
      case 'hour':
        divNum = 1000 * 3600;
        break;
      case 'day':
        divNum = 1000 * 3600 * 24;
        break;
      default:
        break;
    }
    var ts = null;
    if (sTime < eTime) {
      ts = parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
    } else {
      ts = parseInt((sTime.getTime() - eTime.getTime()) / parseInt(divNum));
    }
    return ts;
  },
}
export default utils
