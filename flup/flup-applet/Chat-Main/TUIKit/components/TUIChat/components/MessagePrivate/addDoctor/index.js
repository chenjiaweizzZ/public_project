import {
  selectDockerListByDept,
  selectGroupUserInfoList
} from "../../../../../../../utils/api"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    display: {
      type: Boolean,
      value: "",
      observer(newVal) {
        this.setData({
          displayTag: newVal,
        });
      },
    },
    conversation: {
      type: Object,
      value: {},
      observer(newVal) {
        if (newVal && newVal.groupProfile && newVal.groupProfile.groupID) this.getGroupUserInfoList(newVal.groupProfile.groupID)
        this.setData({
          conversation: newVal,
        });
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    displayTag: false,
    dataTree: [],
    selectDoctorList: [],
    conversation: {},
    value: "",
    filterDataTree: [],
    activeKey: 0,
    conversation: {},
    groupMemberProfile: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取群成员
    getGroupUserInfoList(id) {
      selectGroupUserInfoList({
        roomId: id
      }).then(res => {
        if (res.retCode == 0) {
          // 过滤掉患者数据
          let arr = res.retData.filter((item) => {
            return item.roleName != "患者"
          })
          this.setData({
            groupMemberProfile: arr.reverse()
          })
          this.getDockerList()
        }
      })
    },
    // 获取医生列表
    getDockerList() {
      selectDockerListByDept({
        // 医院ID写死
        hospitalId: "1118033010334208499",
      }).then((res) => {
        if (res.retCode == 0) {
          let arr = [];
          const keys = Object.keys(res.retData);
          keys.forEach((item) => {
            arr.push({
              name: item,
              id: item,
              children: res.retData[item].map((items) => {
                return {
                  name: items.name,
                  id: items.UserId,
                  checked: false,
                  disabled: this.data.groupMemberProfile.some(itemss => {
                    return items.UserId == itemss.userId
                  })
                };
              }),
            });
          });
          this.setData({
            dataTree: JSON.parse(JSON.stringify(arr)),
            filterDataTree: arr
          });
        }
      });
    },
    onCheckedChange(event) {
      let key = this.data.activeKey
      let index = event.currentTarget.dataset.index
      let item = event.currentTarget.dataset.item
      this.setData({
        ['filterDataTree[' + key + '].children[' + index + '].checked']: event.detail
      })
      if (event.detail) {
        this.data.selectDoctorList.push(item)
      } else {
        this.setData({
          selectDoctorList: this.data.selectDoctorList.filter(items => {
            return items.id != item.id
          })
        })

      }
    },
    onChange1(event) {
      this.setData({
        activeKey: event.detail
      })
    },
    onChange(e) {
      this.setData({
        value: e.detail,
      });
    },
    onSearch() {
      let arr = this.filterTree(this.data.dataTree, this.data.value)
      this.setData({
        filterDataTree: arr,
        selectDoctorList: [],
        activeKey: 0
      })
    },
    // 取消
    handleClose() {
      this.triggerEvent("close", {
        key: "1",
      });
      this.setData({
        selectDoctorList: [],
        filterDataTree: this.data.dataTree
      });
    },
    // 确定
    handleConfirm() {
      if (this.data.selectDoctorList.length > 0) {
        let arr = [];
        this.data.selectDoctorList.forEach(item => {
          arr.push(item.id)
        })
        this.triggerEvent('selectDoctorList', {
          selectDoctorList: arr
        })
      } else {
        wx.showToast({
          title: '请选择医生',
          icon: 'none'
        })
      }
    },
    filterTree(arr, keyword, first = true) {
      let that = this;
      if (first) {
        arr = JSON.parse(JSON.stringify(arr))
      }
      let emptyArr = [];
      for (let item of arr) {
        if (item.name.includes(keyword)) {
          if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            item.children = that.filterTree(item.children, keyword, false);
          }
          emptyArr.push(item);
        } else if (item.children && Array.isArray(item.children) && item.children.length > 0) {
          item.children = that.filterTree(item.children, keyword, false);
          if (item.children.length) {
            emptyArr.push(item);
          }
        }
      }
      return emptyArr;
    }
  },
});