export default {
  data() {
    return {
      deptOptions: [],
      newDeptOptions: [],
      AllDeptList: [],
      dept: '',
    }
  },

  methods: {
    getDeptList() {
      return this.$apis.getDeptList({}).then(res => {
        this.deptOptions = res
      })
    },
    getNewDeptList() {
      return this.$apis.systemManagequeryCurrentUserDept({}).then(res => {
        this.newDeptOptions = res
      })
    },
    getDeptListByHospitalId() {
      return this.$apis
      .departmentgetFlupDeptByHospitalId({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.AllDeptList = res
      })
    },
    async getAllNewDept() {
      await this.getNewDeptList()
      this.newDeptOptions.unshift({
        serialNo: 'ALL',
        deptName: '全院'
      })
      this.dept = 'ALL'
    },
    async getAllDept() {
      await this.getDeptList()
      this.deptOptions.unshift({
        serialNo: 'ALL',
        deptName: '全院'
      })
      this.dept = 'ALL'
    }
  }
}
