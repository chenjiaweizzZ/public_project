
import methods from "./methods.js"
import wx from "weixin-js-sdk"
import store from './vuex/store';
import { Base64 } from 'js-base64';
import { base64toFile } from '@/config/base64'
let tempArr = []
function getLocalImgData(localIds, length, params, callback, files) {
  console.log(localIds, length, params, callback, files)
  if (localIds.length == 0) {
    return false
  }
  let num = params.imgMax || 100
  // let self = this;
  let localId = localIds.pop()

  return new Promise(function (resolve, reject) {
    wx.getLocalImgData({
      localId: localId, // 图片的localID
      success: function (res) {
        var localData = res.localData; // localData是图片的base64数据，可以用 img 标签显示
        console.log(`图片的BASE64 ==== ${localData.length}`)
        if (localData.indexOf('data:image') != 0) {
          //判断是否有这样的头部
          localData = 'data:image/jpeg;base64,' + localData
        }
        localData = localData.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg')
        tempArr.push(0)
        const _file = base64toFile(localData)
        files.push(_file)
        if (tempArr.length < length && params.currentImg < num) {
          getLocalImgData(localIds, length, params, callback, files)
        } else {
          if (tempArr.length > 0) {
            tempArr = []
            console.log(`图片请求上传`)
            console.log(files)
            methods.postFile(files).done(data => {
              if (Array.isArray(data.data)) {
                let dataParams = []
                data.data.forEach(item => {
                  let temp = {
                    status: 1,
                    uri: item.uri,
                    url: item.url,
                    fullname: item.fullname,
                    fdfs_path: item.fdfs_path,
                    data: {
                      ...item
                    }
                  }
                  dataParams.push(temp)
                })
                callback(JSON.stringify({
                  data: dataParams
                }))
              } else {
                let dataParams = {
                  status: 1,
                  uri: data.data.uri,
                  url: data.data.url,
                  fullname: data.data.fullname,
                  fdfs_path: data.data.fdfs_path,
                  data: {
                    ...data.data
                  }
                }
                callback(JSON.stringify({
                  data: dataParams
                }))
              }
            })
          }
        }
      }
    });
  })

};


function getWechatInfo(callback) {
  function call(res) {
    console.log(res[1].result)
    let list = res[1].result
    list.language = "zh_CN"
    callback(list)
  }
  let data = {
    token: $.cookie('token'),
    command: "usr/getTencentUserInfoByToken",
  }
  return post("/usr/getTencentUserInfoByToken", data, call, errcodefn, errfn);
};

async function wxInvoke(methodName, param, callback) {
  switch (methodName) {
    case "TakeAndUploadPhoto":
      methods.get(`/tencent/public/getSignConfig?url=${encodeURIComponent(location.href.split("#")[0])}`).done(res => {
        if (res.resCode == 200) {
          wx.config({
            debug: false,
            appId: res.model.appId,
            timestamp: res.model.timestamp,
            nonceStr: res.model.nonceStr,
            signature: res.model.signature,
            jsApiList: [
              "chooseImage",
              "uploadImage"
            ]
          })

          let count = 1
          param.currentImg = param.currentImg || 0
          if (param.imgMax) {
            count = param.imgMax - param.currentImg
          } else if (param.count) {
            count = param.count
          }

          wx.ready(function () {
            wx.chooseImage({
              count: count > 9 ? 9 : count, // 默认9
              sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                if (res.errMsg == "chooseImage:ok") {
                  var localIds = res.localIds; // 返回选定照片的本地 ID 列表，localId可以作为 img 标签的 src 属性显示图片
                  console.log(localIds)
                  getLocalImgData(localIds, localIds.length, param, callback, [])
                } else {
                  store.dispatch('toast', res.errMsg);
                }
              }
            });
          })
        } else {
          store.dispatch('toast', res.resMsg);
        }
      })
      break;
    case "OpenDocument":
      // var base = new Base64();
      console.log(param.url);
      var result = Base64.encode(param.url);
      window.location.href = `${window.location.origin}/fileView/onlinePreview?url=${result}`
      break;
    case "IntentMarkGradeActivity":
    // this.$router.push({
    //   name: 'fdCkExamExamDetail',
    //   query: {
    //     ...param
    //   }
    // })
    case 'Logout':
      // $.cookie("token",null);
      // window.location.href = `${window.location.origin}/pages/futuredoctorapp/index.html/#wxLogin`
      location.href = "/pages/futuredoctorapp/index.html/#/wxLogin";
      break;
    case 'GetCurrentVersion':
      callback('1.1.8')
      break;
    case 'GetWiFiStatus':
      callback({ currentWiFi: true, designWiFi: true })
      break;
    case 'Share':
      console.log(param)
      callback(param)
      tihs.$router.push({
        name: 'fdCkExamExamDetail',
        query: {
          ...param
        }
      })
    case 'scanQRCode':
      console.log("sys")
      methods.get(`/tencent/public/getSignConfig?url=${location.href.split("#")[0]}`).done(res => {
        if (res.resCode == 200) {
          wx.config({
            debug: false,
            appId: res.model.appId,
            timestamp: res.model.timestamp,
            nonceStr: res.model.nonceStr,
            signature: res.model.signature,
            jsApiList: [
              "scanQRCode"
            ]
          })
          wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
            wx.scanQRCode({
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
              scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
              success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                console.log(res)
                console.log(result)
                var ru = {
                  result: result,
                  status: "OK"
                }
                callback(JSON.stringify(ru))
              }
            });
          });
        }
      })

      break;
    case 'GetWiFiStatus':
      callback(JSON.stringify({ currentWiFi: true, designWiFi: true }))
      break;
    case 'GetWeChatInfo':
      getWechatInfo(callback)
      break;
    default:
      break;
  }
};

export {
  wxInvoke
};