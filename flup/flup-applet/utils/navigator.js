const encode = param => {
  var paramStr = ''
  if (typeof param == 'object') {
    paramStr = JSON.stringify(param)
  } else
    paramStr = param + ""
  return encodeURIComponent(paramStr)
}

const decode = param => {
  var result = decodeURIComponent(param)
  try {
    result = JSON.parse(result);
  } catch (e) {}
  return result
}


const encodeObj = (key, obj) => {
  var optionsStr = encode(obj)
  return key + "=" + optionsStr
}


//计算年龄
const caculateAge = (birthDay, medicalDate) => {

  // if(birth.slice(5,7)<date.slice(5,7)){
  //   return date.slice(0,4)-birth.slice(0,4)
  // } else if(birth.slice(5,7)==date.slice(5,7)){
  //   if(birth.slice(5,7)<date.slice(5,7)){
  //     return date.slice(0,4)-birth.slice(0,4)
  //   } else{
  //     return date.slice(0,4)-birth.slice(0,4)-1
  //   }
  // } else {
  //   return date.slice(0,4)-birth.slice(0,4)-1
  // }
  let currentDate = new Date(medicalDate);
  let birthDate = new Date(birthDay);
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  let monthDiff = currentDate.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

module.exports = {
  encodeObj: encodeObj,
  decode: decode,
  caculateAge: caculateAge
}