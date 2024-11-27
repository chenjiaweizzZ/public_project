Component({

  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: Object,
      value: {},
      observer(newVal) {
        if(!newVal) return
        try{
          const ext = JSON.parse(newVal.content.ext)
          newVal.content.ext = ext
        }catch(err){
        }
        this.setData({
          message: newVal
        });
      },
    },
    patientName: {
      type: String,
      value: '',
    }
  },
  data: {
    message: {},
  },
  methods: {
    goDetail() {
      let orderId = this.data.message.content.ext.orderId
      orderId ? this.triggerEvent("seePrescriptionDetail", orderId) : ''
    }
  }
})