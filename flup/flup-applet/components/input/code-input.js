// component/input/code-input.js
import { getValidate} from "../../utils/api.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phone:{
      type:'String',
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    code: [],
    inputfocus: true,
    cursor: 0,
    activeindex: 0,
    inputlength: 0,
    codeimg:'',
    showtip:false,
    visible:false,
    rawvalue:'',
    codetoken:'',
    phone:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hide(event, success){
      this.callbackfunc({
        code: this.data.code.join(''),
        // codetoken:this.data.codetoken
      })
      this.setData({
        visible: false,
        code: [],
        activeindex: 0,
        inputlength: 0,
        showtip: false,
        inputfocus: false,
        rawvalue: '',
        codetoken: ''
      })
    },
    codecheck(func,e){
      this.setData({
        visible:true,
        // phone:func.phone
      })
      this.callbackfunc=func

      this.refreshcode()
    },
    codeinput(e) {
      // console.log(e)
      let val = e.detail.value;
      this.setData({
        rawvalue:val
      })
      if (val.length > this.data.inputlength) {
        // console.log('input')
        this.setData({
          [`code[${this.data.activeindex}]`]: val[val.length - 1],
          activeindex: this.data.activeindex + 1,
          inputlength: val.length
        })
        if (this.data.activeindex == 4) {
          this.setData({
            inputfocus: false
          })
        }
        this.inputcompelet()
      } else {
        if (this.data.code[this.data.activeindex] || this.data.activeindex === 0)
          this.setData({
            [`code[${this.data.activeindex}]`]: "",
            inputlength: val.length
          })
        else {
          this.setData({
            [`code[${this.data.activeindex-1}]`]: "",
            inputlength: val.length,
            activeindex: this.data.activeindex - 1
          })
        }
      }
      console.log(this.data.activeindex)
      // if (this.data.activeindex>3){
      //   
      // }
    },
    inputtap(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        inputfocus: true,
        activeindex: ~~index
      })
    },
    bindblur() {
      console.log('blur')
      this.setData({
        inputfocus: false
      })
    },
    refreshcode(){
      // console.log(this.data.phone,'phonephonephonephone')
      getValidate({
        length:4,
        phone:this.data.phone
      }).then(data => {
        // let imgsrc = data.retData;
        // let codetoken = data.token;
        this.setData({
          codeimg: data.retData
        })
      })
      
    },
    inputcompelet(){
      let iscom=true;
      for(let i=0;i<4;i++){
        if (!this.data.code[i])
          iscom=false
      }
    //  debugger
      if (!iscom) return;
      // this.setData({
      //   showtip:true
      // })
      this.hide(null,true)
    },
    callbackfunc(){}
  },
  attached(){
  }
})