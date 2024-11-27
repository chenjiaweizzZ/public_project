/**
 * Created by liuchuanyang on 2017/3/10.
 */
import $ from 'jquery';
import axios from 'axios'
import store from './vuex/store';
import { wxInvoke } from './wx_methods.js';
// import { EXIF } from './assets/js/exif.js';
import request from '@/config/request'
import { baseUrl } from "./env";
import { createPromise } from '@/config/promise'
import pubConfig from "@/config/pubConfig"
import  Buffer  from 'Buffer'

const _setupWebViewJavascriptBridge = function (callback) {   //ios桥函数
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
};

const invokeNative = function (methodName, param, callback) {
    let currenteNV = getEnv();
    if (currenteNV == 'isApp') {
        _setupWebViewJavascriptBridge(function (bridge) {

            bridge.callHandler(methodName, param, function responseCallback(responseData) {
                callback && callback(responseData);
            });
        });
    } else {
        console.log(wxInvoke, "---")
        wxInvoke(methodName, param, callback);
        // wxInvoke()
    }

};



// IOS图片旋转
var _imgName = "";  //保存图片名称
function getEnv() {
    const ua = navigator.userAgent.toLowerCase();
    const isWeixin = ua.indexOf('micromessenger') !== -1
    const isApp = /(^|;\s)app\//.test(ua);
    if (isWeixin) {
        return 'isWeixin'
    } else {
        return 'isApp'
    }

};

function stringToUint8Array(str) {
    const encoder = new TextEncoder();
    const encodedString = encoder.encode(str);
    return new Uint8Array(encodedString.buffer);
  }

/**图片压缩 */
function ImageCompress(file, maxSizeMB = 4) {
    return new Promise((resolve, reject) => {
      const rFilter = /^(image\/jpeg|image\/jpg|image\/png|image\/heic)$/i;
      if (!rFilter.test(file.type)) {
        reject(new Error('请选择jpg、jpeg、png格式的图片'));
        return;
      }
  
      if (file.size > maxSizeMB * 1024 * 1024) {
        reject(new Error(`图片太大无法上传，请选择小于${maxSizeMB}MB的图片`));
        return;
      }
  
      console.log(`选择的文件 path:${file.path},name:${file.name} size:${file.size} type:${file.type} webkitRelativePath: ${file.webkitRelativePath}`);
  
      const oReader = new FileReader();
      oReader.onload = function (event) {
        const image = new Image();
        image.src = event.target.result;
        image.onload = function () {
          let expectWidth = this.naturalWidth;
          let expectHeight = this.naturalHeight;
  
          if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
            expectWidth = 800;
            expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
          } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
            expectHeight = 1200;
            expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
          }
  
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = expectWidth;
          canvas.height = expectHeight;
          ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
  
          const base64 = canvas.toDataURL("image/jpeg", 0.8);
          const input = base64.split(',')[1];
          const buffer = stringToUint8Array(atob(input));
          const u8arr = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  
          const compressedFile = new File([u8arr], `${file.name.substring(0, 32)}.jpeg`, {
            type: 'image/jpeg'
          });
  
          resolve(compressedFile);
        };
      };
  
      oReader.onerror = function (event) {
        reject(new Error('文件读取失败'));
      };
  
      oReader.readAsDataURL(file);
    });
  }


function selectFileImage(event, fileCallback) {
    var _file = event.target.files[0];
    _imgName = _file.name;
    //图片方向角  
    var Orientation = null;
    console.log("正在上传,请稍后...");
    var rFilter = /^(image\/jpeg|image\/jpg|image\/png|image\/heic)$/i; // 检查图片格式
    if (!rFilter.test(_file.type)) {
        store.dispatch('toast', { msg: '请选择jpg、jpeg、png格式的图片', timeout: 3000 });
        return;
    }

    // 限制上传大小
    if ((_file.size / 1024).toFixed(0) > 4096) {
        store.dispatch('toast', { msg: '图片太大无法上传,请选择小于4M的图片', timeout: 3000 });
        return;
    }
    // var URL = URL || webkitURL;
    //获取照片方向角属性，用户旋转控制
    // EXIF.getData(_file, function () {
    //     EXIF.getAllTags(this);
    //     Orientation = EXIF.getTag(this, 'Orientation');
    // });

    var oReader = new FileReader();
    oReader.onload = function (event) {
        //var blob = URL.createObjectURL(file);
        //_compress(blob, file, basePath);
        var image = new Image();
        image.src = event.target.result;
        image.onload = function () {
            var expectWidth = this.naturalWidth;
            var expectHeight = this.naturalHeight;

            if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                expectWidth = 800;
                expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
            } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                expectHeight = 1200;
                expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
            }
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = expectWidth;
            canvas.height = expectHeight;
            ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
            var base64 = null;
            //修复ios
            if (navigator.userAgent.match(/iphone/i)) {
                console.log('iphone');
                //alert(expectWidth + ',' + expectHeight);
                //如果方向角不为1，都需要进行旋转  
                // if (Orientation != "" && Orientation != 1) {
                //     // alert('旋转处理');
                //     switch (Orientation) {
                //         case 6://需要顺时针（向左）90度旋转
                //             // alert('需要顺时针（向左）90度旋转');
                //             rotateImg(this, 'left', canvas);
                //             break;
                //         case 8://需要逆时针（向右）90度旋转
                //             // alert('需要顺时针（向右）90度旋转');
                //             rotateImg(this, 'right', canvas);
                //             break;
                //         case 3://需要180度旋转
                //             // alert('需要180度旋转');
                //             rotateImg(this, 'right', canvas);//转两次
                //             rotateImg(this, 'right', canvas);
                //             break;
                //     }
                // }

                base64 = canvas.toDataURL("image/jpeg", 0.8);
            } else {
                //alert(Orientation);
                // if (Orientation != "" && Orientation != 1) {
                //     //alert('旋转处理');
                //     switch (Orientation) {
                //         case 6://需要顺时针（向左）90度旋转
                //             // alert('需要顺时针（向左）90度旋转');
                //             rotateImg(this, 'left', canvas);
                //             break;
                //         case 8://需要逆时针（向右）90度旋转
                //             // alert('需要顺时针（向右）90度旋转');
                //             rotateImg(this, 'right', canvas);
                //             break;
                //         case 3://需要180度旋转
                //             // alert('需要180度旋转');
                //             rotateImg(this, 'right', canvas);//转两次
                //             rotateImg(this, 'right', canvas);
                //             break;
                //     }
                // }

                base64 = canvas.toDataURL("image/jpeg", 0.8);
            }
            // alert(base64)
            getBlob(base64, fileCallback);
        };
    };
    oReader.readAsDataURL(_file);
};

//对图片旋转处理  
function rotateImg(img, direction, canvas) {
    //alert(img);
    //最小与最大旋转方向，图片旋转4次后回到原方向  
    var min_step = 0;
    var max_step = 3;
    //var img = document.getElementById(pid);  
    if (img == null) return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错  
    var height = img.height;
    var width = img.width;
    //var step = img.getAttribute('step');  
    var step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值  
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    //旋转角度以弧度值为参数  
    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
};
// 将转码后的图片文件上传到服务器
function getBlob(base64, fileCallback) {
    var img = getBlobBydataURI(base64, "image/jpeg");
    uploadPhoto(img, fileCallback);
};
// 图片转码方法
function getBlobBydataURI(dataURI, type) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: type });
};

function uploadPhoto(img, fileCallback) {
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", uploadProgress, false);
    xhr.addEventListener("load", uploadComplete, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);
    xhr.open("POST", '/file/upload');
    var formData = new FormData();
    formData.append('file', img, _imgName);
    xhr.send(formData);

    function uploadProgress(evt) {
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        }
    }
    function uploadComplete(evt) {
        /*上传完成后执行函数*/
        function success() {
            // alert(xhr.responseText);
            var carpht = JSON.parse(xhr.responseText);

            fileCallback && fileCallback(carpht, "success");
        }
        success && success(evt.target.responseText);
    };
    function uploadFailed(evt) {
        fileCallback && fileCallback(evt, "error");
    };
    function uploadCanceled(evt) {
        fileCallback && fileCallback(evt, "abort");
    };
};

let fdfsPrefix = '';

let getStorage = name => {
    return localStorage.getItem(name);
};

// serve-pub
// prod-api/pub
function getSystemType() {
    let system = localStorage.getItem("system")
    switch(system) {
        case 'escort':
            return 4
        case 'yaopei':
            return 5
        case 'zhuanpei':
            return 6
        case 'jishi':
            return 7
        case 'quanke':
            return 8
        default:
            return ''
    }
}
function formatUrl(url, data) {
    console.log(url)
    if (!data) {
        data = {}
    }
    let replaceStr = localStorage.getItem('system') == 'escort' ? '/pub/' : ''
    pubConfig.forEach(item => {
        if (url.indexOf(item) > -1 || item.indexOf(url) > -1) {
            console.log(111,url,item)
            url = url.replace('/base/', replaceStr)
        }
    })
    if (url.indexOf(replaceStr) > -1) {
        // data.sysType = localStorage.getItem('system') == 'escort' ? 4 : ""
        data.sysType = getSystemType()
    }
    if (url.indexOf('/base/') > -1 || url.indexOf('/pub') > -1) {
        url = '/prod-api' + url
    } else {
        url = '/service-pub' + url
    }
    return { url, data }
}
const post = (url, data, param) => {
    if (data && !data.menusId && getStorage("menuId")) {
        data.menusId = getStorage("menuId")
    }
    let formatData = formatUrl(url, data)
    url = formatData.url
    data = formatData.data
    let getData = JSON.stringify({
        "1": data
    })
    if (url.indexOf("/base/") > -1 || url.indexOf("/pub/") > -1 || url.indexOf("/enroll/") > -1 || url.indexOf("/system/") > -1 || url.indexOf("/enrolltrain/") > -1 || url.indexOf("/advanced/") > -1) {
        getData = JSON.stringify(data)
    }
    return axios.post(url, getData, {
        data: getData,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json',
         'Authorization': getStorage('token') || '',
          "Need-xyj": true,
        //   'sysType': localStorage.getItem("system") == 'escort' ? 4 : ""
          'sysType': getSystemType()
     }
    }).then(data => {
        let response = data.data
        if (response && response.resCode) {
            return response;
        }
        let res = response && response["1"];
        if (res.errcode == 9904) {
            clearTimeout(window.alertTimer);
            window.alertTimer = setTimeout(function () {
            }, 1000);
        }
        return res;
    }).catch()
}

const get = (url, res, next) => {
    let formatData = formatUrl(url, {})
    console.log(formatData)
    return axios.get(formatData.url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getStorage('token') || '',
            "Need-xyj": true,
            // 'sysType': localStorage.getItem("system") == 'escort' ? 4 : ""
            'sysType': getSystemType()
        }
    }).then(data => {
        let response = data.data
        if (response && response.resCode) {
            return response;
        }
        let res = response && response["1"];
        return res;
    }).catch(next);
};

export default {
    // post: (url, data, param) => {
    //     data = data || {}
    //     data['menusId'] = localStorage.getItem("menuId")
    //     const _data = $.extend(param, {
    //         "1": data
    //     })
    //     return request({
    //         url,
    //         data: _data,
    //         "headers": {
    //             "Need-xyj": true,
    //             withCredentials: true
    //         },
    //         "xhrFields": {
    //             withCredentials: true
    //         }
    //     }).then(function (res) {
    //         if (res.errcode && res.errcode == 9904) {
    //             store.dispatch('toast', "登录信息已失效，请重新登录");
    //             setTimeout(function () {
    //                 location.href = "/pages/futuredoctorapp/index.html/#/wxLogin";
    //             }, 2000)
    //             return
    //         }
    //         return res 
    //     })
    // },
    post: post,
    get: get,
    getSystemType: getSystemType,
    postRepeat: (url, data, param) => {
        data = data || {}
        data['menusId'] = localStorage.getItem("menuId")
        const _data = $.extend(param, {
            "1": data
        })

        return request({
            url,
            data: _data,
            "headers": {
                "Need-xyj": true,
                withCredentials: true
            },
            "xhrFields": {
                withCredentials: true
            }

        }).then(function (res) {
            if (res.errcode && res.errcode == 9904) {
                store.dispatch('toast', "登录信息已失效，请重新登录");
                // console.log($.cookie('sid'))
                setTimeout(function () {
                    location.href = "/pages/futuredoctorapp/index.html/#/wxLogin";
                }, 2000)
                return
            }
            return res
        })
    },
    postNew: (url, data, param) => {
        url = baseUrl + url;
        // //console.log('发送的数据为:'+JSON.stringify({
        //     "1": data
        // }));
        data = data || {}
        data['menusId'] = localStorage.getItem("menuId")
        return $.ajax(
            url,
            $.extend(
                {
                    type: "POST",
                    contentType: "application/json",
                    withCredentials: true
                },
                {
                    "headers": {
                        "Need-xyj": true,
                        withCredentials: true
                    },
                    "xhrFields": {
                        withCredentials: true
                    }
                },
                param,
                {
                    data: JSON.stringify(data)
                }
            )
        ).then(function (data, status, jqXhr) {
            if (data && data.resCode) {
                return data;
            }
            let res = data && data["1"];
            if (res.errcode == 9904) {
                clearTimeout(window.alertTimer);
                window.alertTimer = setTimeout(function () {
                }, 1000);
            }
            return res;
        }).catch((XMLHttpRequest) => {
        })

    },
    post1: (url, data, param) => {
        const _data = $.extend(data, param)
        return request({
            url,
            data: _data
        }).then(function (res) {
            if (res.errcode && res.errcode == 9904) {
                store.dispatch('toast', "登录信息已失效，请重新登录");
                setTimeout(function () {
                    invokeNative('Logout');
                }, 2000)
                return
            }
            return res
        })
    },
    post2: (url, data, param) => {
        url = baseUrl + url;
        // //console.log('发送的数据为:'+JSON.stringify({
        //     "1": data
        // }));
        return $.ajax(
            url,
            $.extend(
                {
                    type: "GET",
                    contentType: "application/json",
                    withCredentials: true
                },
                {
                    "headers": {
                        "Need-xyj": true,
                        withCredentials: true
                    },
                    "xhrFields": {
                        withCredentials: true
                    }
                },
                param,
                {
                    data: JSON.stringify(data)
                }
            )
        ).then(function (data, status, jqXhr) {
            if (data && data.resCode) {
                return data;
            }
            let res = data && data["1"];
            if (res.errcode == 9904) {
                clearTimeout(window.alertTimer);
                window.alertTimer = setTimeout(function () {
                    //              MessageBox.alert("登录信息失效，请重新登录！", "提示", {
                    //                  type: "warning",
                    //                  callback: function() {
                    //                      var mode = GetQueryString("mode");
                    //
                    //                      if (mode == "nonav") {
                    //                          window.top.location = "/mpg/index.html#/";
                    //                      } else {
                    //                          router.push({ name: store.state.loginType });
                    //                      }
                    //                  }
                    //              });
                }, 1000);
            }
            return res;
        }).catch((XMLHttpRequest) => {
            //  console.log('MessageBox',MessageBox)
            //  console.log('xmlhttprequest',XMLHttpRequest)

            setTimeout(() => {
                // MessageBox({
                //     title: '错误状态：'+XMLHttpRequest.status,
                //     showClose: true,
                //     message: '状态文本：'+XMLHttpRequest.statusText,
                //     type: 'error'
                // });
            }, 300);

            //console.log('XMLHttpRequest:',XMLHttpRequest)
        })
    },
    /**文件上传到服务器 */
    postFile: (fileDataList) => {
        console.log(fileDataList)
        return createPromise((success, error) => {
            const formData = new FormData()
            const fileList = [].concat(fileDataList)
            const promiseAll = []
            fileList.forEach(file => {
                promiseAll.push(
                    // ImageCompress(file).then(file_blob => {
                    //     formData.append('file', file_blob)
                    // })
                        formData.append('file', file)
                )
            })
            console.log(formData)
            Promise.all(promiseAll).then(() => {
                request({
                    url: '/file/upload',
                    data: formData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (res) {
                    if (res.errcode && res.errcode == 9904) {
                        store.dispatch('toast', "登录信息已失效，请重新登录");
                        setTimeout(function () {
                            invokeNative('Logout');
                        }, 2000)
                        return
                    }
                    let message = ''
                    switch (res.code) {
                        case 400: message = '请求错误'; break
                        case 401: message = '未授权，请登录'; break
                        case 403: message = '拒绝访问'; break
                        case 404: message = `请求地址出错: /file/upload`; break
                        case 408: message = '请求超时'; break
                        case 500: message = '服务器内部错误'; break
                        case 501: message = '服务未实现'; break
                        case 502: message = '网关错误'; break
                        case 503: message = '服务不可用'; break
                        case 504: message = '网关超时'; break
                        case 505: message = 'HTTP版本不受支持'; break
                        default: break
                    }

                    if (message != '') {
                        store.dispatch('toast', message);
                        return error()
                    }
                    return success(res)
                }).catch(error)
            })
        })
    },
    // get: (url) => {
    //     return request({
    //         url,
    //         method: 'get'
    //     }).then(function (res) {
    //         if (res.errcode && res.errcode == 9904) {
    //             store.dispatch('toast', "登录信息已失效，请重新登录");
    //             setTimeout(function () {
    //                 invokeNative('Logout');
    //             }, 2000)
    //             return
    //         }
    //         return res
    //     })
    // },
    invokeNative: invokeNative,
    registerToNative: (name, method, callbackResponse) => {
        /*if(navigator.userAgent.indexOf("Android")!=-1||navigator.userAgent.indexOf('Linux')!= -1) {
            // window.JavaInterface.JavaScriptLogout(); //callback android OS logout function
            // window.JavaInterface[name] = method;
            window[name] = method;
        } else{*/
        // callback ios OS function
        _setupWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler(name, function (data, responseCallback) {
                method && method(data);
                if (typeof responseCallback === 'function') {
                    responseCallback(callbackResponse);
                }
            });
        });
        /*}*/
    },
    setTitle: (titletext) => {
        //var u = navigator.userAgent
        //var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
        //var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        //if (isAndroid) {
        //    document.title = titletext
        //} else if (isiOS) {
        //    var $body = $('body')
        //    document.title = titletext
        //    var $iframe = $('<iframe src="/favicon.ico"></iframe>')
        //    $iframe.on('load', function () {
        //        window.setTimeout(function () {
        //            $iframe.off('load').remove()
        //        }, 0)
        //    }).appendTo($body)
        //}else{
        //    document.title = titletext
        //}
        $('title').html(titletext)
    },
    textareaFocus(dom) {
        console.log(dom)
        if (dom) {
            $(dom).css('padding-bottom', '6rem');
        } else {
            $(".g-main").css('padding-bottom', '6rem');
        }

    },
    textareaBlur(dom) {
        if (dom) {
            $(dom).css('padding-bottom', '0');
        } else {
            $('.g-main').css('padding-bottom', '0');
        }

    },
    textResize() {
        $('textarea').each(function () {
            $(this).css('height', $(this).prop('scrollHeight') + 'px')
            $(this).on('input', function () {
                this.style.height = 'auto'
                this.style.height = this.scrollHeight + 'px'
            })
        })
    },
    getFdfsPrefix() {   //

        return new Promise((resolve, reject) => {

            if (fdfsPrefix) {
                return Promise.resolve(fdfsPrefix)
            }
            return this.post("/common/sysconfig", {
                command: "common/sysconfig",
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                code: "fdfs"
            }).done(ret => {
                if (ret && ret.errcode == 0 && ret.fdfs) {
                    fdfsPrefix = ret.fdfs;
                    resolve(ret.fdfs);
                } else {
                    reject();
                }
            }).fail(err => {
                reject();
            });
        });
    },
    getSystemType: getSystemType,
    getTime() {
        let date = new Date();

        let year = date.getFullYear();

        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
    },
    selectFileImage: selectFileImage,
    isiOS: function () {
        return /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(navigator.userAgent || '');
    },
    isAndroid: function () {
        return /Android/i.test(navigator.userAgent || '');
    },

    GetQueryString: function (name) {
        //获取url参数值
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substring(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    },
    findObjectWithDeptLevel3(arr) {
        for (let i = 0; i < arr.length; i++) {
            const obj = arr[i];
            if (obj.deptlevel >= 3 && obj.havePermission) {
                return {
                    object: obj,
                    parentIndex: i
                };
            }
            if (obj.childrens) {
                const recursiveResult = this.findObjectWithDeptLevel3(obj.childrens);
                if (recursiveResult !== null) {
                    return {
                        object: recursiveResult.object,
                        parentIndex: i
                    };
                }
            }
        }
        return null;
    },
    findObjectAndIndex(arr, id) {
        console.log(arr, id)
        // let result = null;
        // function searchArray(array, index = 0) {
        //   for (let i = 0; i < array.length; i++) {
        //     const obj = array[i];

        //     if (obj.id == id && obj.havePermission) {
        //       result = { object: obj, index };
        //       break;
        //     }

        //     if (obj.childrens !== null && Array.isArray(obj.childrens)) {
        //       searchArray(obj.childrens, index + i);
        //     }
        //   }
        // }

        // searchArray(arr);
        // return result;
        for (let i = 0; i < arr.length; i++) {
            const obj = arr[i];
            if (obj.id == id && obj.havePermission) {
                return {
                    object: obj,
                    index: i
                };
            }
            if (obj.childrens) {
                const recursiveResult = this.findObjectAndIndex(obj.childrens, id);
                if (recursiveResult !== null) {
                    return {
                        object: recursiveResult.object,
                        index: i
                    };
                }
            }
        }
        return null;
    },
    getPreId(name) {
        if ($.cookie("preIdList")) {
            let arr = JSON.parse($.cookie("preIdList"))
            console.log(arr)
            console.log(name)
            let item = arr.find(item => item.route == name)
            if (item) {
                let preId = item.id;
                return preId
            } else {
                return null
            }
        } else {
            return null
        }
    },
    getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return decodeURIComponent(arr[2]);
        } else {
            return null;
        }
    },
    removeCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
};
