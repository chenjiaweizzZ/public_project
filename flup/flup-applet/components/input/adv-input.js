// component/input/adv-input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    style: String,
    name: String,
    placeholder: String,
    value: String,
    type: {
      type: String,
      value: 'text'
    },
    focus: Boolean,
    maxlength: {
      type: Number,
      value: 99
    },
    hasmargin: Boolean,
    hasplain: {
      type: Boolean,
      value: false
    },
    hasclear: {
      type: Boolean,
      value: true
    },
    tip:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    input_type: 'text',
    isfocus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindconfirm(evt) {
      this.triggerEvent('confirm', {
        value: evt.detail.value
      })
    },
    bindblur(evt) {
      this.setData({
        isfocus: false
      })
      this.triggerEvent('blur', {
        value: evt.detail.value
      })
    },
    bindfocus(evt) {
      this.setData({
        isfocus: true
      })
      this.triggerEvent('focus', {
        value: evt.detail.value
      })
    },
    bindinput(evt) {

      this.triggerEvent('input', {
        value: evt.detail.value
      })
    },
    clearcontent() {
      this.triggerEvent('input', {
        value: ""
      })
    },
    showpassword() {
      if (this.data.input_type === 'password') {
        this.setData({
          input_type: 'text'
        })
      }
      else {
        this.setData({
          input_type: 'password'
        })
      }
    }
  },
  attached() {
    this.setData({
      input_type: this.data.type
    })
  }
})
