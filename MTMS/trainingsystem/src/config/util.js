
import axios from 'axios'

import { MessageBox } from "element-ui";
import store from '../store'
import pubConfig from "./pubConfig"
const request = axios.create(
    {
        // baseURL: process.env.NODE_ENV == 'development' ? 'http://192.168.3.191' : process.env.VUE_APP_API_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') || '',
            "Need-xyj": true
        }
    }
);

function showErrorImport(errorList) {
    let a = 0;
    const newDatas = document.createElement("div")
    for (let i in errorList) {
        a++;
        if (errorList.length > 1) {
            let temp = document.createElement("p")
            temp.style="margin-bottom:10px;font-size:16px"
            temp.innerHTML = errorList[i]
            newDatas.appendChild(temp)
        } else {
            let temp = document.createElement("p")
            temp.style="margin-bottom:8px;font-size:14px"
            temp.innerHTML = errorList[i]
            newDatas.appendChild(temp)
        }
    }
   MessageBox.confirm(newDatas.outerHTML,"提示",{
        dangerouslyUseHTMLString: true,
        showCancelButton: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {

    });
}

//获取url参数
function GetQueryString(name) {
    //获取url参数值
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
}
function formatUrl(url, data) {
    let replaceStr = store.state.sysType == 'escort' ? '/pub/' : '/pub/'
    pubConfig.forEach(item => {
        if (url.indexOf(item) > -1 || item.indexOf(url) > -1) {
            url = url.replace('/base/', replaceStr)
        }
    })
    if (url.indexOf('/base/') > -1 || url.indexOf('/pub') > -1) {
        url = '/prod-api' + url
    } else {
        url = '/service-pub' + url
    }
    data = data || {}
    data.sysType = store.state.sysTypeNum
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
    return request.post(url, getData, {
        data: getData,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getStorage('token') || '',
            "Need-xyj": true,
            "sysType": store.state.sysTypeNum
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
    request.defaults.headers.common['sysType'] =  store.state.sysTypeNum
    return request.get(formatData.url, {}, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getStorage('token') || '',
            "Need-xyj": true
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

let setTitle = titletext => {
    document.getElementsByTagName('title')[0].innerHTML = titletext
    // $("title").html(titletext);
};
let setStorage = (name, val) => {
    localStorage.setItem(name, val);
};
let getStorage = name => {
    return localStorage.getItem(name);
};
let removeStorage = name => {
    localStorage.setItem(name, "");
};
let getCookie = name => {
    //获取cookie
    var arr = document.cookie.split("; ");
    for (var i = 0; i < arr.length; i++) {
        var _arr = arr[i].split("=");
        if (_arr[0] == name) {
            return _arr[1];
        }
    }
    return "";
};
let setCookie = (name, value, iDay) => {
    //设置cookie
    var oDate = new Date();
    if (iDay > 10) {
        oDate.setMinutes(oDate.getMinutes() + iDay);
    } else {
        oDate.setDate(oDate.getDate() + iDay);
    }
    document.cookie = name + "=" + value + ";expires=" + oDate + ";Path=/";
};
let removeCookie = name => {
    //删除cookie
    setCookie(name, "", -1);
};

let exportExcel = data => {
    data.menusId = getStorage('menuId')
    var url = `/service-pub/export/exportExcel?sysType=${store.state.sysTypeNum}`;
    var name = "download_name" + new Date().getTime();

    const iframe = document.createElement("iframe");
    iframe.name = name
    document.body.appendChild(iframe);

    const formEle = document.createElement("form");
    formEle.target = name;
    formEle.action = url;
    formEle.method = "POST";
    formEle.enctype = "application/x-www-form-urlencoded";
    document.body.appendChild(formEle);

    const inputEle = document.createElement("input");
    inputEle.type = "hidden";
    inputEle.name = "_form_body";
    formEle.appendChild(inputEle);
    iframe.style.display = 'none'
    formEle.style.display = 'none'
    inputEle.value = JSON.stringify({
        "1": data
    })
    formEle.submit();
};
let exportWord = data => {
    var url = `/service-pub/export/exportWord?sysType=${store.state.sysTypeNum}`;
    var name = "download_name" + new Date().getTime();
    const iframe = document.createElement("iframe");
    iframe.name = name
    document.body.appendChild(iframe);

    const formEle = document.createElement("form");
    formEle.target = name;
    formEle.action = url;
    formEle.method = "POST";
    formEle.enctype = "application/x-www-form-urlencoded";
    document.body.appendChild(formEle);

    const inputEle = document.createElement("input");
    inputEle.type = "hidden";
    inputEle.name = "_form_body";
    formEle.appendChild(inputEle);
    iframe.style.display = 'none'
    formEle.style.display = 'none'

    inputEle.value = JSON.stringify({
        "1": data
    })

    formEle.submit();
};
let exportMouldExcel = data => {
    data.menusId = getStorage('menuId')
    var url = `/service-pub/export/exportExcelMould?sysType=${store.state.sysTypeNum}`;
    var name = "download_name" + new Date().getTime();
    const iframe = document.createElement("iframe");
    iframe.name = name
    document.body.appendChild(iframe);

    const formEle = document.createElement("form");
    formEle.target = name;
    formEle.action = url;
    formEle.method = "POST";
    formEle.enctype = "application/x-www-form-urlencoded";
    document.body.appendChild(formEle);

    const inputEle = document.createElement("input");
    inputEle.type = "hidden";
    inputEle.name = "_form_body";
    formEle.appendChild(inputEle);
    iframe.style.display = 'none'
    formEle.style.display = 'none'

    inputEle.value = JSON.stringify({
        "1": data
    })
    formEle.submit();
};
let importExcel = ($form, data, successFunc, errFunc) => {
    data.menusId = getStorage('menuId')
    $.ajaxFileUpload({
        url: "/service-pub/import/importExcel",
        secureuri: false,
        timeout: 1000 * 60 * 2,
        fileElementId: $form,
        data: {
            _upload_data: JSON.stringify({ "1": data })
        },
        dataType: "json",
        success: function (data, status) {
            // self.user = data.data;
            // self.refreshLoginUser(data.data);
            // self.hideLoading();
            typeof successFunc == "function" && successFunc(data);
        },
        error: function (data, status, e) {
            // self.hideLoading();
            typeof errFunc == "function" && errFunc(data);
        }
    });
};
let downloadExcelHeader = (url, downloadFileName) => {   
    let formatData = formatUrl(url, {})
    return request({
        method: 'POST',
        url: formatData.url,
        responseType: 'blob'    
    }).then(res=>{
        documentStreamHeader(res.data, downloadFileName)
    })
};

//参数不拼接在url后面而放在body里时候用downloadExcelHeader2这个方法
let downloadExcelHeader2 = (url, downloadFileName, param) => {
    let formatData = formatUrl(url, param)
    let params = JSON.stringify(formatData.data);
    return request({
        contentType: false,
        method: 'POST',
        url: formatData.url,
        data: params,
        responseType: 'blob',
        success: (res) => {
            documentStreamHeader(res.data, downloadFileName)
        }
    });
};
/**返回的文档流下载处理 */
let documentStreamHeader = (res, downloadFileName) => {
    var name = "download_name" + new Date().getTime();
    if (window.navigator.msSaveOrOpenBlob) {
        // 兼容ie11
        const blobObject = new Blob([res])
        window.navigator.msSaveOrOpenBlob(blobObject, name + '.xlsx')
    } else {
        console.log("this is res2", res);
        var url = URL.createObjectURL(new Blob([res]))
        var a = document.createElement('a')
        document.body.appendChild(a) // 此处增加了将创建的添加到body当中
        a.href = url
        a.download = `${downloadFileName || '异常'}.xlsx`
        a.target = '_blank'
        a.click()
        a.remove() // 将a标签移除
    }
}
let exportToExcel = (res, fileName) => {
    let url = window.URL.createObjectURL(new Blob([res], { type: ".xlsx" }));
    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.setAttribute('download', `31313.xlsx`);
    document.body.appendChild(a);
    a.click();
    url = window.URL.revokeObjectURL(url);
    document.body.removeChild(a)
}

let filterEmpty = (objData, option = {}) => {
    for (let key of Object.keys(objData)) {
        objData[key] = typeof objData[key] === 'string' ? objData[key].trim() : objData[key];
        if (objData[key] !== '' &&
            objData[key] !== undefined &&
            objData[key] !== null
        ) {
            option[key] = objData[key];
            //过滤查询列表中的空值 和首尾空格
        }
    }
    return option;
};
let _ajax = (port, option) => {
    return post(port, {
        sessionid: getCookie('sid'),
        loginid: getCookie('uid'),
        ...option
    })
};
let currentYear = () => {
    //返回当前年月
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    return year + '-' + month;
};
let currentDate = () => {
    // 返回当前年月日
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return year + '-' + month + '-' + day;
}

let isArray = (arr) => {
    return Object.prototype.toString.call(arr) === '[object Array]';
};
let clone = obj => JSON.parse(JSON.stringify(obj));
let exportPdf = data => {
    var url = "/export/exportPdf";
    var name = "download_name" + new Date().getTime();
    const iframe = document.createElement("iframe");
    iframe.name = name
    document.body.appendChild(iframe);

    const formEle = document.createElement("form");
    formEle.target = name;
    formEle.action = url;
    formEle.method = "POST";
    formEle.enctype = "application/x-www-form-urlencoded";
    document.body.appendChild(formEle);

    const inputEle = document.createElement("input");
    inputEle.type = "hidden";
    inputEle.name = "_form_body";
    formEle.appendChild(inputEle);
    iframe.style.display = 'none'
    formEle.style.display = 'none'

    inputEle.value = JSON.stringify({
        "1": data
    })

    formEle.submit();

    // var url = "/export/exportPdf";
    // var name = "download_name" + new Date().getTime();
    // var $iframe = $('<iframe name="' + name + '"></iframe>').appendTo("body");
    // var $form = $(
    //     '<form target="' +
    //     name +
    //     '" action="' +
    //     url +
    //     '" method="POST" ' +
    //     'enctype="application/x-www-form-urlencoded">' +
    //     "</form>"
    // ).appendTo("body");
    // var $content = $('<input type="hidden" name="_form_body" />').appendTo(
    //     $form
    // );

    // $iframe.css("display", "none");
    // $form.css("display", "none");

    // $content.val(
    //     JSON.stringify({
    //         "1": data
    //     })
    // );
    // $form.submit();
}
export {
    post,
    get,
    setCookie,
    getCookie,
    setTitle,
    removeCookie,
    exportExcel,
    exportWord,
    exportMouldExcel,
    importExcel,
    setStorage,
    getStorage,
    removeStorage,
    filterEmpty,
    _ajax,
    currentYear,
    currentDate,
    isArray,
    clone,
    exportPdf,
    downloadExcelHeader,
    downloadExcelHeader2,
    showErrorImport
};
