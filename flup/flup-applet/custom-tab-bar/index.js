// 自定义导航栏
Component({
  /**
   * 组件的初始数据
   */
  data: {
    is_health_admin: wx.getStorageSync('is_health_admin') || 0,
    selected: 0, // 当前选中菜单项，第一个是0
    list: [],
    list1: [{
        pagePath: '/pages/index/index',
        text: '服务列表',
        iconPath: '../assets/images/home.png',
        selectedIconPath: '../assets/images/home-light.png',
      },
      {
        pagePath: '/pages/bulletinBoard/index',
        text: '看板',
        iconPath: '../assets/images/bulletinboard.png',
        selectedIconPath: '../assets/images/bulletinboard-light.png',
      },
      {
        pagePath: '/pages/referralExamine/referralExamine',
        text: '双向转诊',
        iconPath: '../assets/images/referral.png',
        selectedIconPath: '../assets/images/referral-light.png',
      },
      {
        pagePath: '/pages/personal/personal',
        text: '个人中心',
        iconPath: '../assets/images/personal.png',
        selectedIconPath: '../assets/images/personal-light.png',
      },
    ],
    list2: [{
        pagePath: '/pages/index/index',
        text: '服务列表',
        iconPath: '../assets/images/home.png',
        selectedIconPath: '../assets/images/home-light.png',
      },
      {
        pagePath: '/pages/referralExamine/referralExamine',
        text: '双向转诊',
        iconPath: '../assets/images/referral.png',
        selectedIconPath: '../assets/images/referral-light.png',
      },
      {
        pagePath: '/pages/personal/personal',
        text: '个人中心',
        iconPath: '../assets/images/personal.png',
        selectedIconPath: '../assets/images/personal-light.png',
      },
    ]
  },
  lifetimes: {
    attached: function () {
      this.changeList()
      getApp().eventBus.on('rightChange', data => {
        if (data !== this.data.is_health_admin) {
          this.setData({
            is_health_admin: data
          })
          this.changeList()
        }
      })
    },
    detached: function () {
      applicationCache.eventBus.off('rightChange')
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeList() {
      this.setData({
        is_health_admin: wx.getStorageSync('is_health_admin') || 0,
      })
      if (this.data.is_health_admin === 1) {
        this.setData({
          list: this.data.list1
        })
      } else {
        this.setData({
          list: this.data.list2
        })
      }
    },
    _switchTab(e) {
      wx.requestSubscribeMessage({
        tmplIds: [
          "0vKM6iLYfw26FQRad00vmAWaXUPBDK8lFz7ZYxgSpns",
          "gfbcIm3_kh-cuDTeKagJtktM64prQMZsh_PYJUfyyL8",
          "W_LIVV4q2Ld9F24nwh4-w_4MTrOlPBaKbwQolrKOhxE"
        ],
      })
      const _path = e.currentTarget.dataset.path;
      wx.switchTab({
        url: _path
      });
    },
  }
});