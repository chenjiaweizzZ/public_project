import {
  commonPhrasesQuery
} from "../../../../../../../utils/api"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    display: {
      type: Boolean,
      value: '',
      observer(newVal) {
        this.setData({
          displayTag: newVal,
        });
      },
    },
  },

  lifetimes:{
    created(){
      this.getCommonPhrasesQueryList()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    displayTag: true,
    words: '',
    activeKey: 0,
    queryList: [], // 常用语列表
    pageNo1: 1,
    total: 0,
    type: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //  获取常用语
    getCommonPhrasesQueryList() {
      commonPhrasesQuery({
        pageNo: this.data.pageNo1,
        pageSize: 20,
        phrasesType: this.data.type
      }).then(res => {
        if (res.retCode == 0) {
          this.setData({
            queryList: res.retData.list,
            total: res.retData.total
          })
        }
      })
    },
    // 常用语分类切换
    onChange(event) {
      this.setData({
        activeKey: event.detail,
        type: event.detail == 0 ? 1 : 0
      })
      this.getCommonPhrasesQueryList()
    },
    // 关闭
    handleClose() {
      this.triggerEvent('close', {
        key: '2',
      });
      this.setData({
        words: ""
      })
    },
    // 常用语发送
    sendMessage(e) {
      this.triggerEvent('sendMessage', {
        message: e.currentTarget.dataset.words.contents,
      });
    },
  },
});