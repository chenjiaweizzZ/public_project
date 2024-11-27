import Vue from "vue";
let state = () => ({
    SDKAppID: '1400183993',
    messageList: [],
    nextReqMessageID: '',
    isCompleted: '',//是否加载完历史数据
    isLogin: false,//是否登陆
    isDisabled: false,//是否禁用
    currentpage: 1,//获取历史记录页数
    pagesize: 50,//获取历史记录条数
    referralStatus: false,//false 管理师 true 医生
    isEmpower: false,//是否获取麦克风权限
    groupUserInfoList: [],//群主成员列表
    healthControlHidden: false,
    preScrollHeight: 0,//初始高度
    unreadMessage: 0,
    aiEnabled: false,
    picList: [],
    trtcRoomId: '',
    trtcRoomId2: '',
    inviteID: '',
    inviteShow: false,
    inviteShowType: "",
    callName: '',
    toBottom: false,
    consultId: '',
    endate: '',
    managerId: '',
    graphicSustain: true
})
let time = null;
let mutations = {
    // setGraphic(state,value) {
    //     state.graphic = value
    // },
    setGraphicSustain(state, value) {
        state.graphicSustain = value
    },
    setManagerId(state,value) {
        state.managerId = value
    },
    setRoomId(state,value) {
        state.trtcRoomId = value
    },
    setRoomId2(state,value) {
        state.trtcRoomId2 = value
    },
    setEndate(state,value) {
        state.endate = value
    },
    setInviteId(state,value) {
        state.inviteID = value
    },
    setConsultId(state,value) {
        state.consultId = value
    },
    setInviteShow(state,value) {
        state.inviteShow = value
    },
    setInviteShowType(state,value) {
        state.inviteShowType = value
    },
    setCallName(state,value) {
        state.callName = value
    },
    setToBottom(state, value) {
        state.toBottom = value
    },
    updatePicList(state, obj) {
        let arr = state.picList
        arr.forEach(i => {
            if(i.href == obj.href) {
                i.poster = obj.poster
            }
        })
        state.picList = arr
    },
    UpdateMessageList(state,value){
        state.messageList = [...setMessageList(value)];
        state.picList = getPicList(state.messageList)
    },
    UpdatePicListAfterRevoked(state, url) {
        let arr = []
        state.picList.forEach(i => {
            if(i.href !== url) {
                arr.push(i)
            }
        })
        arr.forEach((elem,index,array) => {
            elem.title = `${index+1}/${array.length}`
        })
        state.picList = arr
    },
    putMessage(state, value) {
        console.log('新消息', value);
        if (Array.isArray(value)) {
            value.map(elem => {
                console.log(elem,elem.type)
                if (!state.messageList.some(item => item.ID == elem.ID)) {
                    if(elem.type !== 'TIMGroupSystemNoticeElem') state.messageList.push(elem);
                }
            })
        } else {
            if (!state.messageList.some(item => item.ID == value.ID)) {
                if(value.type !== 'TIMGroupSystemNoticeElem') state.messageList.push(value);
            }
        }
        state.picList = getPicList(state.messageList)
    },
    clearMessageList(state) {
        state.messageList = []
    },
    resetMessage(state, obj) {
        state.messageList = state.messageList.filter(item => item.ID != obj.ID);
        state.messageList.push(obj);
    },
    restInfo(state) {
        state.messageList = [];
        state.nextReqMessageID = '';
        state.isCompleted = '';
        state.currentpage = 1;
        state.isDisabled = false;
        state.referralStatus = false;
    },
    setNextReqMessageID(state, value) {
        state.nextReqMessageID = value;
    },
    setIsCompleted(state, value) {
        state.isCompleted = value;
    },
    setIsLogin(state, value) {
        state.isLogin = value;
    },
    setIsDisabled(state, value) {
        state.isDisabled = value;
    },
    setReferralStatus(state, value) {
        state.referralStatus = value;
    },
    setAiEnable(state, value) {
        state.aiEnabled = value
    },
    setScrollHeight(state, value) {
        let dom = document.getElementById(value);
        if (dom) {
            dom.scrollTop = dom.scrollHeight;
            console.log(11, dom.scrollHeight)
        }
    },
    setScrollHeightProMax(state, value) {
        let messageListNode = document.getElementById(value);
        if (!messageListNode) {
            return false;
        }
        if (state.preScrollHeight - messageListNode.clientHeight - messageListNode.scrollTop < 30) {
            if (time) {
                clearTimeout(time);
                time = null;
            }
            time = setTimeout(() => {
                messageListNode.scrollTop = messageListNode.scrollHeight
            }, 0);
        }
        state.preScrollHeight = messageListNode.scrollHeight
    },
    setIsEmpower(state, value) {
        state.isEmpower = value;
    },
    setPreScrollHeight(state, value) {
        state.preScrollHeight = value;
    },
    updateHealthControl(state, value) {
        state.healthControlHidden = value;
    },
    updateUnreadMessage(state, value) {
        state.unreadMessage = value
    },
}

let actions = {
    getImInfo({ commit }, value) {
        return new Promise((resolve, reject) => {
            let params = {
                ...value
            }
            Vue.prototype.$apis.initiateChat(params).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err)
            })
        })
    },
    getMessageList(context, conversationID) {
        return new Promise((resolve, reject) => {
            const { nextReqMessageID, messageList } = context.state
            Vue.prototype.$chat.getMessageList({
                conversationID: `GROUP${conversationID}`,
                nextReqMessageID,
            }).then(function (imResponse) {
                // console.log(imResponse)
                // const messageList = imResponse.data.messageList; // 消息列表。
                context.state.nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
                context.state.isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
                context.state.messageList = [...setMessageList(imResponse.data.messageList), ...messageList];
                state.picList = getPicList(state.messageList)
                resolve();
            })
        })
    },
    loginChat(context, { userID, userSig }) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$chat.login({ userID, userSig }).then(() => {
                console.log('登陆成功')
                resolve();
            }).catch(() => {
                console.log('登陆失败')
                reject()
            })
        })
    },
    getHistoryQuery(context, { roomId, enddate = '' }) {
        return new Promise((resolve, reject) => {
            const { currentpage, pagesize, messageList, endate } = context.state
            let time = enddate ? enddate : endate
            Vue.prototype.$apis.getHistoryQuery({ roomId, enddate: time, currentpage, pagesize }).then((res) => {
                let oldMessage = messageList
                // if (context.state.currentpage == 1) {
                //     oldMessage = []
                // }
                ++context.state.currentpage;
                let info = JSON.parse(res.retData);
                let newinfo = JSON.parse(info.Data);
                newinfo.reverse();
                context.state.messageList = [...setMessageList(setForm(newinfo)), ...oldMessage];
                context.state.isCompleted = !(newinfo.length >= pagesize);
                context.state.picList = getPicList(context.state.messageList)
                resolve();
            }).catch(() => {
                reject()
            })
        })
    },
    getGroupUserInfoList(context, { roomId }) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$apis.selectGroupUserInfoList({ roomId }).then((res) => {
                console.log('-------群主成员列表----', res.retData)
                context.state.groupUserInfoList = res.retData;
                resolve();
            }).catch(() => {
                reject()
            })
        })
    },
    getGraphicGroupUserInfoList(context, { roomId }) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$apis.selectGraphicGroupUserInfoList({ roomId }).then((res) => {
                console.log('-------图文咨询成员列表----', res.retData)
                context.state.groupUserInfoList = res.retData;
                resolve();
            }).catch(() => {
                reject()
            })
        })
    },
    getPersonalGroupUserInfoList(context, { roomId }) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$apis.selectPersonalGroupUserInfoList({ roomId }).then((res) => {
                console.log('-------售前群主成员列表----', res.retData)
                context.state.groupUserInfoList = res.retData;
                resolve();
            }).catch(() => {
                reject()
            })
        })
    },
    getUnreadMessage(context) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$apis.homeConsultUnreadMessages({
                pageNo: 1,
                pageSize: 999
            }).then(res => {
                context.state.unreadMessage = res.retData
                resolve(res);
            }).catch(() => {
                reject(err)
            })
        })
    },
}

function setForm(list) {
    if (!list) {
        return false;
    }
    let newList = list.map(item => setFormItem(item));
    return newList;
}

function setFormItem(info) {
    let obj = {
        ID: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        flow: info.from_account == localStorage.getItem('userId') ? 'out' : 'in',
        type: info.chats_detail[0].msg_type,
        time: new Date(info.msg_timestamp).getTime() / 1000,
        from: info.from_account,
        conversationType: 'GROUP',
        status: 'success',
        isRevoked: !!info.c_id
    }
    if (obj.type == "TIMTextElem") {
        obj.payload = {
            text: info.chats_detail[0].chat_text,
        }
    } else if (obj.type == "TIMImageElem") {
        obj.payload = {
            imageInfoArray: info.chats_detail[0].image_list.map(item => ({ url: item.image_url, width: item.image_width, height: item.image_height })),
        }
    } else if (obj.type == "TIMCustomElem") {
        obj.payload = {
            data: info.chats_detail[0].look_data,
            description: info.chats_detail[0].location_desc || ""
        }
    } else if (obj.type == "TIMSoundElem") {
        obj.type = 'TIMTextElem'
        obj.payload = {
            text: '消息已过期!'
        }
    }
    return obj;
}

function setMessageList(list) {
    let newList = [];
    for (let item of list) {
        if (item.type == "TIMCustomElem" && JSON.parse(item.payload.data).type == 4 && (JSON.parse(item.payload.data).text.includes('订单剩余') || JSON.parse(item.payload.data).text.includes('房间剩余'))) {
            continue
        }
        newList.push(item);
    }
    return newList;
}

function findVideoCover(url) {
    return new Promise((resolve, reject) => {
        // let video = document.createElement('video'); // 创建视频元素
        // video.setAttribute('crossOrigin', 'anonymous');
        // video.setAttribute('src', url);
        // video.currentTime = 0.1; // 获取0.1s处的画面
        // video.addEventListener('loadeddata', function () {
        //     let canvas = document.createElement('canvas'); // 创建画布
        //     let width = video.videoWidth; // canvas的尺寸和视频尺寸一样
        //     let height = video.videoHeight;
        //     canvas.width = width;
        //     canvas.height = height;
        //     canvas.getContext('2d').drawImage(this, 0, 0, width, height); // 绘制canvas
        //     const dataURL = canvas.toDataURL('image/jpeg'); // 转换为base64
        //     console.log("dataURL",dataURL)
        //     resolve(dataURL);
        // })
    });
}

function getPicList(messageList) {
    let picList = []
        for (let i = 0; i < messageList.length; i++) {
            let item = messageList[i]
            console.log("item",item)
            if (item.payload && (item.payload.description == "TIMImageElem") && item.isRevoked == false) {
                console.log("item",item,item.isRevoked)
                let data = JSON.parse(item.payload.data);
                picList.push({
                    title: "",
                    type: 'image/jpeg',
                    href: data.imageUrl,
                    thumbnail: data.imageUrl,
                });
            }
            if (item.payload && (item.payload.description == "TIMVideoFileElem") && item.isRevoked == false) {
                console.log("item",item,item.isRevoked)
                let data = JSON.parse(item.payload.data);
                picList.push({
                    title: "",
                    type: 'video/mp4',
                    href: data.videoUrl,
                    poster: "",
                });
            }
        }
        picList.forEach((elem,index,array) => {
            elem.title = `${index+1}/${array.length}`
        })
        console.log("piclIts",picList)
    return picList 
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}