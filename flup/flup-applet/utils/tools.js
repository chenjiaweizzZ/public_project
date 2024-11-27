/**
 * 格式化聊天时间
 * @param {*} time
 */
export function formatDate(time) {
  if (!time) return "";
  var date = new Date(time),
    m = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours(),
    min = date.getMinutes(),
    s = date.getSeconds(),
    m = m < 10 ? `0${m}` : m;
  d = d < 10 ? `0${d}` : d;
  h = h < 10 ? `0${h}` : h;
  min = min < 10 ? `0${min}` : min;
  s = s < 10 ? `0${s}` : s;
  return `${m}-${d} ${h}:${min}:${s}`;
}

/**
 * 对消息进行排序
 * @param {*} message
 */
export async function formatMessageList(messageList) {
  // 对数据去重
  let temp = {};
  // 对数据按照ID进行去重
  messageList = messageList.reduce(function (prev, current) {
    // 针对老的数据结构
    if (!current.ID) {
      prev.push({
        ...current,
        ID: randomString()
      });
    } else {
      if (!temp[current.ID]) {
        prev.push(current);
        temp[current.ID] = true;
      }
    }
    return prev;
  }, []);
  // 对数据按时间排序
  messageList.sort(function (value1, value2) {
    return value1.time - value2.time;
  });
  for (let i = 0; i < messageList.length; i++) {
    let message = formatMessage(messageList[i]);
    if (i === 0 || message.type === "TIMCustomElem" || message.isRevoked) {
      message.isShowTime = true;
      message.timeStr = formatDate(message.time * 1000);
    } else {
      // 时间差 > 5分钟时显示
      if (message.time - messageList[i - 1].time > 300) {
        message.isShowTime = true;
        message.timeStr = formatDate(message.time * 1000);
      } else {
        message.isShowTime = false;
        message.timeStr = formatDate(message.time * 1000);
      }
    }
    if (message.type == "TIMImageElem") {
      message.bigImage = await getApp().getPrivateCosSignImage(
        message.bigImage
      );
      message.oriImage = await getApp().getPrivateCosSignImage(
        message.oriImage
      );
      message.smallImage = await getApp().getPrivateCosSignImage(
        message.smallImage
      );
    }
  }
  return new Promise((resolve, reject) => {
    resolve(messageList);
  });
}

/**
 * 格式化消息
 * @param {*} message
 */
export function formatMessage(message) {
  if (message.ID) {
    message.ID = message.ID.replace(/\@|#/g, "");
  }
  if (!message.payload) {
    if (message.type == "TIMCustomElem" && message.content.desc === "图片") {
      message.bigImage = message.content.data.filePath;
      message.oriImage = message.content.data.filePath;
      message.smallImage = message.content.data.filePath;
      message.type = "TIMImageElem";
    }
    return message;
  }
  let content = message.payload;
  if (content.data) {
    try {
      if (typeof content.data === "string") {
        content.data = JSON.parse(content.data);
      }
      let text = content.data.text;
      content.data.text = JSON.parse(text);
    } catch (error) {}
  }
  if (content.description) {
    content.desc = content.description;
  }
  message.content = content;

  if (message.from) {
    message.fromAccount = message.from;
  }
  if (message.flow === "in") {
    message.isSend = false;
  }
  if (message.flow === "out") {
    message.isSend = true;
  }
  if (
    message.type === "TIMImageElem" &&
    message.payload &&
    message.payload.imageInfoArray
  ) {
    //图片
    let imgArr = message.payload.imageInfoArray;
    imgArr.forEach((imagemessage) => {
      if (imagemessage.sizeType == 0) {
        message["smallImage"] = imagemessage.imageUrl;
      } else if (imagemessage.sizeType == 2) {
        message["bigImage"] = imagemessage.imageUrl;
      } else {
        message["oriImage"] = imagemessage.imageUrl;
      }
    });
  }
  if (
    message.type === "TIMCustomElem" &&
    message.payload &&
    message.payload.desc === "图片"
  ) {
    //图片
    message["smallImage"] = message.payload.data.filePath;
    message["bigImage"] = message.payload.data.filePath;
    message["oriImage"] = message.payload.data.filePath;
    message.type = "TIMImageElem"; // 自定义消息为图片类型的修改成图片消息
  }
  if (message.type === "TIMTextElem" && message.payload) {
    message.content = message.content.text;
  }
  return message;
}

function randomString(e) {
  var e = e || 32,
    t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

//计算年龄
export function age(birthDay,medicalDate){

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
function num(str){
  if(str[0]!='0'){
    return parseInt(str)
  } else {
    return parseInt(str.slice(-1))
  }
}