export default {
  data () {
    return {
      dialogVisible: this.show
    }
  },
  watch: {
    show() {
      console.log(1)
      this.dialogVisible = this.show
    }
  },
  props: {
    show: Boolean
  }
}