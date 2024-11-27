// component/input/tsl-input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    inputValue: {
      type: String,
        observer: function (newVal, oldVal) {
            if (newVal){
                this.setData({
                    showClear: true,
                    disabled: false,
                })
            }
        }
    },
    placeholder: {
      type: String,
      value: "医生、科室、疾病"
    },
    confirmType:{
      type: String,
      value: "search"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showClear: false,
    disabled: true,
    confirmHold:false

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //输入改变回调
    input: function(event) {
      this.properties.inputValue = event.detail.value
      this.triggerEvent('input', {
        value: event.detail.value
      })
      if (event.detail.value.length > 0 && !this.showClear) {
        this.setData({
          showClear: true
        })
      } else {
        this.setData({
          showClear: false
        })
      }
    },
    //聚焦回调
    focus: function(event) {
      if (this.data.disabled) {
        this.setData({
          disabled: false
        })
      }
    },
    //失去焦点回调
    blur: function(event) {
    },
    //确认事件
    confirm: function (event) {
      this.triggerEvent('confirm', {
        value: event.detail.value
      })
    },
    clearInput: function() {
      this.setData({
        inputValue: ""
      })
    },
    cancelClick: function() {
      this.setData({
        inputValue: "",
        disabled: true,
        showClear: false
      })

      this.triggerEvent('input', {
        value: ""
      })

      this.triggerEvent('cancel')

    },
    click:function(){
      if(this.data.disabled){
        this.setData({
          disabled:false
        })
      }
    }
  }
})