import {
  selectGroupUserInfoList,
  selectConsultRecordTime
} from "../../../../../../utils/api"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 群相关信息
    conversation: {
      type: Object,
      value: '',
      observer(newVal) {
        if (newVal.type === 'GROUP');
        this.getGroupUserInfoList(newVal.groupProfile.groupID);
        this.setData({
          conversation: newVal,
        });
      },
    },
    // 咨询ID
    consultId: {
      type: String,
      value: '',
      observer(newVal) {
        this.setData({
          consultId: newVal
        })
      }
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    conversation: {}, // 群相关信息
    groupMemberProfile: [], // 群成员列表
    loginUserId: "" // 当前登入用户ID
  },

  lifetimes: {
    attached() {
      let userId = wx.getStorageSync('userInfo').UserId
      this.setData({
        loginUserId: userId
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取群成员列表
    getGroupUserInfoList(id) {
      selectGroupUserInfoList({
        roomId: id
      }).then(res => {
        if (res.retCode == 0) {
          // 存储群成员列表
          wx.$globalData.groupMemberList = res.retData
          // 过滤掉患者数据
          let arr = res.retData.filter((item) => {
            return item.roleName != "患者"
          })
          this.setData({
            groupMemberProfile: arr.reverse()
          })
          // 只查询医生数据
          let newArr = res.retData.filter(item => {
            return item.roleName == "医生"
          })
          this.triggerEvent("getGroupMemberList", newArr)
        }
      })
    },
    // 点击群成员过滤消息列表数据
    handleJumpPage(e) {
      let item = e.currentTarget.dataset.value
      this.setData({
        loginUserId: item.userId
      })
      selectConsultRecordTime({
        consultId: this.data.consultId
      }).then(res => {
        let is_health_admin = item.roleName == "个案管理师" ? 1 : 0
        let timeArr = []
        let arr = res.retData.filter(items => {
          return items.recordId
        })
        arr.forEach(item => {
          let startTime = new Date(item.consultStartTime.replace(/-/g, "/")).getTime()
          let endTime = new Date(item.consultEndTime.replace(/-/g, "/")).getTime()
          timeArr.push([startTime / 1000, endTime / 1000])
        })
        this.triggerEvent("getMessageList", {
          is_health_admin: is_health_admin,
          timeArr: timeArr,
          userID: item.userId,
          extendUserId: item.extendUserId,
          name: item.userName
        })
      })
    },
  },
});