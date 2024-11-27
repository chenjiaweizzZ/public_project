import idCard from 'idcard'
import dayjs from 'dayjs'
export default {
  getInfoByIdCard (v) {
    if(v.length == 15) {
      let obj = idCard.upgrade15To18(v)
      if(obj.code == 0) {
        v = obj.card
      } else {
        return false
      }
    }
    let info = idCard.info(v)
    if(!info.valid) {
      return false
    }
    let sexMap = {
      'M': '男',
      'F': '女'
    }
    
    return {
      sex: sexMap[info.gender],
      birthday: info.birthday.toString().slice(0,4) + '-' + info.birthday.toString().slice(4,6) + '-' + info.birthday.toString().slice(6),
      age: info.age
    }
  },
  encryptPhoneNumber (phone) {
    if(!phone) {
      return phone
    }
    return phone.substring(0,3)+"******"+phone.substring(9,11)
  },
  checkPhone(phone){
    return phone && phone.length==11;
  },
  encryptIdCard(idCard) {
    if(!idCard) {
      return idCard
    }
    if (idCard.length == 18) {
      return idCard.substring(0, 6) + "**********" + idCard.substring(16, 18)
    } else {
      return idCard.substring(0, 6) + "********" + idCard.substring(14, 15)
    }
  },
  getAgeBybirthday (v) {
    let diffYear = dayjs().year() - dayjs(v).year()
    let diffMonth = dayjs().month() - dayjs(v).month()
    let diffDate = dayjs().date() - dayjs(v).date()
    if(diffDate < 0) {
      diffMonth -= 1
    }
    let countMonth = diffYear*12 + diffMonth
    if(countMonth < 12) {
      return countMonth + '个月'
    } else {
      return Math.floor(countMonth/12) + '岁'
    }
  },
  formatDate(date, format = 'YYYY-MM-DD') {
    if (date === undefined || date) {
      return dayjs(date).format(format)
    } else {
      return ''
    }
  },
  formatDate2(timestampInSeconds) {  
    // 将秒转换为毫秒  
    const timestamp = timestampInSeconds * 1000;  
    // 创建一个Date对象  
    const date = new Date(timestamp);  
      
    // 获取年、月、日、时、分、秒  
    // 注意：月份是从0开始的，所以要+1  
    // 使用padStart来确保单数字前面有0（例如，05而不是5）  
    const year = date.getFullYear();  
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const day = String(date.getDate()).padStart(2, '0');  
    const hours = String(date.getHours()).padStart(2, '0');  
    const minutes = String(date.getMinutes()).padStart(2, '0');  
    const seconds = String(date.getSeconds()).padStart(2, '0');  
  
    // 拼接成最终的字符串  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;  
  },  
  debounce(fn, wait, immediate = false) {
    let timeout;
    return function (...args) {
      let context = this;
      if (timeout) clearTimeout(timeout);

      if (immediate) {
        let callNow = !timeout;
        timeout = setTimeout(function () {
          timeout = null;
        }, wait);
        if (callNow) fn.apply(context, args);
      } else {
        timeout = setTimeout(function () {
          fn.apply(context, args);
        }, wait);
      }
    };
  },
}