import {
  getAllPackageClassListApi,
  listPackageInfo,
  flupGroupList
} from "../../../../../utils/api"
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    packageInfo: {
      type: Object,
      observer(newVal) {
        this.setData({
          packageItem: newVal
        });
      },
    },
    roomId: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          roomId: newVal
        })
      }
    },
    roomType: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          roomType: newVal
        })
      }
    },
    consultId: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          consultId: newVal
        })
      }
    },
    sendUserName: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          sendUserName: newVal
        })
      }
    },
    sendUserId: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          sendUserId: newVal
        })
      }
    },
    type: {
      type: Number,
      value: 1,
      observer(newVal) {
        this.setData({
          type: newVal
        })
      }
    },
  },

  lifetimes: {
    created: function() {
      this.getAllPackageClassList()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: "",
    bottomSafeArea: 0,
    activeKey: 0,
    packageClassList: [],
    packageInfoList: [],
    searchPackageInfoList: [],
    pageNo: 1,
    total: 0,
    searchPageNo: 1,
    searchTotal: 0,
    isMore: false,
    isSearch: false,
    searchIsMore: false,
    classId: "",
    consultId: "",
    patientId: "",
    roomType: "",
    roomId: "",
    sourceId: "",
    type: 1,
    sendUserName: "",
    sendUserId: "",
    displayTag: false,
    flupGroupList: [],
    selectIndex: 0,
    selectObj: {
      groupName: "全部",
      serialNo: ""
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShowGroup() {
      this.setData({
        displayTag: true
      })
    },
    handleClose() {
      this.setData({
        displayTag: false
      })
    },

    async onReferral(event) {
      this.setData({
        pageNo: 1,
        packageInfoList: [],
        total: 0,
        isMore: false,
        selectIndex: event.detail.index,
        selectObj: event.detail.value
      })
      let params = {
        classId: this.data.classId,
        fuGroupId: this.data.selectObj.serialNo
      }
      await this.getPackageInfoList(params)
      this.handleClose()
    },
    /**
     * 查询随访慢病组列表
     */
    getFlupGroupList(classId) {
      flupGroupList({
        classId
      }).then(res => {
        if (res.retCode == 0) {
          let list = res.retData.map((item) => {
            return {
              groupName: item.groupName,
              serialNo: item.serialNo
            }
          })
          this.setData({
            flupGroupList: [{
              groupName: "全部",
              serialNo: ""
            }, ...list]
          })
        }
      })
    },
    /**
     * 获取服务包分类列表
     */
    getAllPackageClassList() {
      getAllPackageClassListApi({
        pageNo: 1,
        pageSize: 9999,
        mobileOnly: 1
      }).then(res => {
        if (res.retCode == 0) {
          this.setData({
            packageClassList: res.retData.list
          })
          let classId = this.data.packageClassList[0].classId
          this.setData({
            classId
          })
          if (this.data.packageClassList.length < 1) return
          let params = {
            classId
          }
          this.getPackageInfoList(params)
          this.getFlupGroupList(classId)
        }
      })
    },

    /**
     * 根据服务包分类获取服务包列表 
     */
    async getPackageInfoList(params) {
      await listPackageInfo({
        isOnline: 1,
        pageNo: this.data.pageNo,
        pageSize: 10,
        packageType: 2,
        ...params
      }).then(res => {
        if (res.retCode == 0) {
          let list = res.retData.list
          list.forEach(item => {
            item.floorPrice = (item.floorPrice / 100).toFixed(2)
          })
          list = this.data.packageInfoList.concat(list)
          this.setData({
            total: res.retData.total,
            packageInfoList: list,
            isMore: list.length >= res.retData.total ? true : false
          })
        }
      })
    },

    /**
     * 上拉加载
     */
    scrolltolower() {
      if (!this.data.isMore) {
        this.setData({
          pageNo: this.data.pageNo + 1
        })
        this.getPackageInfoList({
          classId: this.data.classId
        })
      }
    },

    /**
     * 侧边导航栏切换
     */
    onChange(e) {
      let classId = this.data.packageClassList[e.detail].classId
      this.setData({
        classId,
        activeKey: e.detail,
        selectIndex: 0,
        selectObj: {
          groupName: "全部",
          serialNo: ""
        }
      })
      let params = {
        classId
      }
      this.setData({
        total: 0,
        packageInfoList: [],
        pageNo: 1,
        isMore: false
      })
      this.getPackageInfoList(params)
    },

    /**
     * 搜索
     */
    Search() {
      this.setData({
        isSearch: true
      })
    },

    /**
     * 取消搜索
     */
    onCancel() {
      this.setData({
        isSearch: false,
        value: ""
      })
    },

    /**
     * 搜索
     */
    onSearch(v) {
      this.setData({
        searchPackageInfoList: [],
        searchTotal: 0,
        searchPageNo: 1,
        searchIsMore: false,
        value: v.detail
      })
      if (this.data.value) {
        this.getSearchPackageInfo()
      }
    },

    /**
     * 搜索下拉加载
     */
    searchScrolltolower() {
      if (!this.data.searchIsMore) {
        this.setData({
          searchPageNo: this.data.searchPageNo + 1
        })
        this.getSearchPackageInfo()
      }
    },

    /**
     * 请求接口封装
     */
    getSearchPackageInfo() {
      listPackageInfo({
        isOnline: 1,
        pageNo: this.data.searchPageNo,
        pageSize: 6,
        packageType: 2,
        keyWord: this.data.value
      }).then(res => {
        if (res.retCode == 0) {
          let list = res.retData.list
          list.forEach(item => {
            item.floorPrice = (item.floorPrice / 100).toFixed(2)
          })
          list = this.data.searchPackageInfoList.concat(list)
          this.setData({
            searchTotal: res.retData.total,
            searchPackageInfoList: list,
            searchIsMore: list.length >= res.retData.total ? true : false
          })
        }
      })
    },
  }
})