import {
  selectAllPackageDept,
  getAllPackageClassListApi,
  listPackageInfo
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
    selectIndex: 0
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
    /**
     * 获取服务包分类列表
     */
    getAllPackageClassList() {
      selectAllPackageDept().then(res => {
        if (res.retCode == 0) {
          this.setData({
            packageClassList: res.retData
          })
          console.log(this.data.packageClassList)
          let classId = this.data.packageClassList[0].serialNo
          console.log(classId)
          this.setData({
            classId
          })
          if (this.data.packageClassList.length < 1) return
          let params = {
            deptId: classId
          }
          this.getPackageInfoList(params)
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
        packageType: 1,
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
          deptId: this.data.classId
        })
      }
    },

    /**
     * 侧边导航栏切换
     */
    onChange(e) {
      let classId = this.data.packageClassList[e.detail].serialNo
      this.setData({
        classId,
        activeKey: e.detail,
        selectIndex: 0,
      })
      let params = {
        deptId: this.data.classId
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
        packageType: 1,
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