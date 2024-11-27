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
        this.setData({
          conversation: newVal,
        });
      },
    },
    isOpenAi: {
      type: Boolean,
      value: false,
      observer(newVal){
        this.setData({
          checked: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    displayTag: false,
    conversation: {},
    checked: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 取消
    handleClose() {
      this.triggerEvent("close", {
        key: "4",
      });
    },
    onChange({ detail }) {
      this.triggerEvent("openAI", {
        checked: detail
      })
    },
  },
});