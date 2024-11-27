export default {
  data() {
    return {
      pageSize:10,
      pageIndex: 1,
      total: 0,
    }
  },
  methods: {
    handleSizeChange(v) {
      this.pageSize = v;
      this.pageIndex = 1;
      this.getMainList ? this.getMainList() : this.$emit('getMainList')
    },
    handleCurrentChange() {
      this.getMainList ? this.getMainList() : this.$emit('getMainList')
    },
  },
}