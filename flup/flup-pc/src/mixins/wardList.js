export default {
  data() {
    return {
      wardOptions: [],
      ward: '',
    }
  },

  methods: {
    getWardList() {
      return this.$apis.getWardList({}).then(res => {
        this.wardOptions = res.data
      })
    },
    async getAllDept() {
      await this.getWardList()
    }
  }
}
