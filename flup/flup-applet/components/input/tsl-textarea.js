// component/input/tsl-textarea.js
Component({
  behaviors: ['wx://form-field', "wx://component-export"],

  export() {
    return { [this.properties.name]: this.properties.inputValue,
      updateValue:(value)=>{
        this.setData({
          inputValue:value
        })
        this.setData({ currentLength: this.properties.inputValue.length })
      } }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    inputValue: {
      type: String
    },
    placeholder: {
      type: String,
      value: ""
    },
    maxLength:{
      type: Number,
      value: 100
    },
    bgc: { type: String, value:'white'},
    height:{type:Number,value:260},
    moduleHidden: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    hiddenmoment: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentLength:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    input:function(event){
      if (event.detail.value.length>this.properties.maxLength){
        this.setData({ inputValue: this.properties.inputValue })
      }else{
        this.properties.inputValue = event.detail.value
      }
      this.setData({ currentLength: this.properties.inputValue.length })
      this.triggerEvent('inputChange', this.properties.inputValue)
    }
  }
})
