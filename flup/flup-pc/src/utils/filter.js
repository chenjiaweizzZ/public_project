//过滤器

import { xor } from "lodash";
import { areaList } from '@/assets/js/city'
import Vue from 'vue'

//解析检查检验
let analysisList = function (original) {
  if (!original || original.length == 0) {
    return []
  }
  let arr = []
  let a = original[0].fuContent.split(',')
  a.forEach(element => {
    let k = JSON.parse(JSON.stringify(original[0]))
    k.fuContent = element
    arr.push(k)
  });
  return arr
}

//风险评估url
let riskurl = function (value, id) {
  let smartFormUrl = this.$parent.$baseURL.SmartFormUrl
  let url =
    smartFormUrl +
    '/view/form/createViaFormId?appid=flupsystem&businessId=78978900011&saveHook=' +
    this.$parent.$baseURL.ICDMApiUrl +
    '/s/smartForm/saveHook&templateId=' +
    value +
    '&formId=' + (id ? id : "0001")
  return url
}

let hideInfo = function (value, type, label = ',') {
  if (!value) {
    return value
  }
  let isShieldUser = sessionStorage.getItem('isShieldUser')
  let isShieldPhone = sessionStorage.getItem('isShieldPhone')
  switch (type) {
    case 'name':
    case 'userName':
    case 'realName':
    case 'patientName':
    case 'contactName':
    case 'target_user_name':
      if (isShieldUser) {
        // let pat = /([^\x00-\xff]{1})([^\x00-\xff]{1})*/g
        // return value.length > 2 ? value.replace(pat, "$1*$2") : value.replace(pat, "$1*")
        var len = value.length;
        if (len == 2) {
          return value[0] + "*";
        } else if (len > 2) {
          return value[0] + (new Array(len - 1).join('*')) + value[len - 1]
        }
      }
      return value
      break
    case 'tel':
    case 'contactPhone':
    case 'mobilephone':
    case 'phone':
    case 'contactPhone':
      if (value === undefined || value === null) {
        return ''
      }
      if (isShieldPhone) {
        return value.toString().replace(/(\d{3})\d{4}(\d*)/, '$1****$2')
      }
      return value
      break
    case 'id':
    case 'idNo':
      if (value === undefined || value === null) {
        return ''
      }
      if (isShieldUser) {
        // return value.toString().replace(/(\d{8})\d{8}(\d*)/, '$1********$2')
        return value.replace(/(\d{4})\d*(\d{3})/g, "$1" + "********" + "$2")
      }
      return value
      break
    case 'address':
      if (isShieldUser) {
        return value.replace(/(\d{1})\d*/g, "**")
      }
      return value
    case 'nameArray':
      if (value === undefined || value === null) {
        return ''
      }
      var nameList = value.split(label);
      nameList.forEach(function (value, index, nameList) {
        var len = value.length;
        if (len == 2) {
          nameList[index] = value[0] + "*";
        } else if (len > 2) {
          nameList[index] = value[0] + "*" + value[len - 1]
        };
      });
      return nameList.map(x => x).join(label)
      break
    default:
      return value;
  }
}

let reversalSite = function (value, type) {
  if (type == 1) {
    for (let i in areaList.province_list) {
      if (value == i) {
        if (areaList.province_list[i].indexOf('市') == -1) {
          return areaList.province_list[i]
        }
      }
    }
  } else if (type == 2) {
    for (let i in areaList.city_list) {
      if (value == i) {
        return areaList.city_list[i]
      }
    }
  } else if (type == 3) {
    for (let i in areaList.county_list) {
      if (value == i) {
        return areaList.county_list[i]
      }
    }
  }
}

export { analysisList, riskurl, hideInfo, reversalSite }