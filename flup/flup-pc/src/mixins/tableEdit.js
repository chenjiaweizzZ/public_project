export default {
  data() {
    return {
      mainList: [],
      showList: [],
      editItem: {}
    }
  },
  watch: {
    mainList() {
      this.showList = [...this.mainList]
      this.showList.forEach((item) => {
        this.$set(item, 'isEdit', false)
      })
    }
  },
  methods: {
    onEdit(row) {
      if (row.isEdit) {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!'
        })
        return
      } else {
        row.isEdit = true
      }
    },
    onAdd() {
      console.log(this.editItem)
      let length = this.showList.length
      if (this.showList[length - 1].isEdit === true) {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!'
        })
        return
      } else {
        this.showList.push({...this.editItem})
      }
    },
    onCancel() {
      this.showList = [...this.mainList]
      this.showList.forEach((item) => {
        this.$set(item, 'isEdit', false)
      })
    },
  }
}