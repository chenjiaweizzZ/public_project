<template>
  <section class="device-manager">
    <div class="queryConditionsBox">
      <el-row type="flex" align="middle">
        <el-input
          class="margin-left10 width300px limiting"
          v-model="search.searchVal"
          maxlength="20"
          show-word-limit
        >
          <el-select class="width110px" v-model="search.searchKey" slot="prepend">
            <el-option
              v-for="item in searchKeyList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-input>设备编号：
        <el-input
          class="margin-left10 width300px limiting"
          v-model="search.searchVal3"
          maxlength="20"
          show-word-limit
        >
          <el-select class="width110px" v-model="search.searchVal2" slot="prepend">
            <el-option value label="全部"></el-option>
            <el-option
              v-for="item in deviceTypeList"
              :key="item.deviceTypeId"
              :value="item.deviceTypeId"
              :label="item.deviceType"
            ></el-option>
          </el-select>
        </el-input>
        <el-button @click="onSearch" plain>查询</el-button>
        <el-button type="success" plain @click="addto">新增关联</el-button>
      </el-row>
    </div>

    <el-table
      style="margin-bottom:60px"
      ref="table"
      class="margin-top20"
      :data="mainList"
      border
      stripe
    >
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-table :data="row.devices" border stripe>
            <el-table-column show-overflow-tooltip prop="deviceType" label="设备类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="deviceSerialNumber" label="设备编号"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="createTime"
              :formatter="$utils.formatTableDate()"
              label="绑定时间"
            ></el-table-column>
            <el-table-column show-overflow-tooltip prop="bindFrom" label="绑定途径"></el-table-column>
            <el-table-column show-overflow-tooltip label="操作">
              <template slot-scope="{ row }">
                <el-button type="text" @click="unbind(row)">解绑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip width="90" prop="patientName" label="姓名">
        <template slot-scope="scope">{{ scope.row.patientName | hideInfo("name") }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="60" prop="sex" label="性别"></el-table-column>
      <el-table-column show-overflow-tooltip width="60" prop="age" label="年龄"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" label="手机号码">
        <template slot-scope="scope">
          <span>{{ $utils.shield( scope.row.contactPhone || scope.row.phone || scope.row.mobile, 2 ) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="formatIdNo"
        min-width="110"
        prop="idNo"
        label="身份证"
      ></el-table-column>
      <el-table-column show-overflow-tooltip :min-width="100" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="openBindDialog(scope.row)" type="text">绑定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      v-if="mainList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>
    <el-dialog
      class
      title="绑定"
      :visible.sync="dialogVisiable"
      width="418px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      modal-append-to-body
    >
      <el-form
        :model="bindInfo"
        ref="bindInfo"
        :rules="rules"
        label-width="84px"
        class="demo-ruleForm"
      >
        <el-form-item label="设备类型" prop="deviceTypeId">
          <el-select v-model="bindInfo.deviceTypeId" placeholder="设备类型">
            <el-option
              v-for="item in deviceTypeList"
              :key="item.deviceTypeId"
              :value="item.deviceTypeId"
              :label="item.deviceType"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceSerialNumber">
          <el-input
            class="limiting"
            v-model="bindInfo.deviceSerialNumber"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="监测指标">
          <el-select
            v-model="bindInfo.targets"
            placeholder="监测指标"
            multiple
            style="display: inline-block;"
          >
            <el-option
              v-for="item in healthParameterList"
              :key="item.id"
              :value="item.name"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisiable = false">取 消</el-button>
        <el-button v-if="this.bindInfo.userId" type="primary" @click="onConfirmBind">确 定</el-button>
        <el-button v-else type="primary" @click="nextfu">下一步</el-button>
      </div>
    </el-dialog>

    <el-dialog
      class
      title="设备绑定"
      :visible.sync="next"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div
        style="padding: 0 10px 20px;display: flex;align-items: center;justify-content: space-between;border-bottom: 1px solid #ccc;"
      >
        <p>设备绑定:{{bindInfo.deviceType}}</p>
        <p>设备编号:{{bindInfo.deviceSerialNumber}}</p>
        <p>监测指标:{{bindInfo.targets}}</p>
      </div>
      <div style="padding: 10px">
        <el-input class="margin-left10 width250px" v-model="keyValue" clearable>
          <el-select class="width110px" v-model="keyword" slot="prepend">
            <el-option
              v-for="item in searchKeyList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-input>
        <el-button type="success" plain @click="getPatientBySearch">查询</el-button>
      </div>

      <el-table
        :data="PatientBasicInfoList"
        border
        style="width: 100%"
        highlight-current-row
        @current-change="handleCurrentChangedx"
      >
        <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
        <el-table-column prop="patientName" label="姓名" min-width="90"></el-table-column>
        <el-table-column prop="sex" label="性别" min-width="60"></el-table-column>
        <el-table-column prop="age" label="年龄" min-width="60">
          <template slot-scope="scope">{{ $utils.getInfoByIdCard(scope.row.idNo).age }}</template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="130"></el-table-column>
        <el-table-column prop="idNo" label="身份证" min-width="180"></el-table-column>
      </el-table>
      <el-pagination
        :page-sizes="[5, 10, 20, 50]"
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page.sync="pageNo2"
        background
        layout="total,sizes,prev, pager, next"
        :total="total2"
      ></el-pagination>
      <div slot="footer">
        <el-button @click="qx">取 消</el-button>
        <el-button type="primary" @click="onConfirmBind">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import Pagination from '@/mixins/pagination'
export default {
  mixins: [Pagination],
  data() {
    return {
      next: false,
      // token: this.$cookie.get('token'),
      dialogVisiable: false,
      // dialogBook: false,
      // patientStateChanged: '',
      mainList: [],
      currentRow: {},
      patientTypeList: [
        { label: '出院患者', value: 2 },
        { label: '在院患者', value: 1 },
        { label: '门诊患者', value: 4 },
        { label: '互联网患者', value: 5 },
        { label: '签约患者', value: 'unknown3', disabled: true },
      ],
      timeKeyList: [
        { label: '入院时间', value: 'admissionDatetime' },
        { label: '出院时间', value: 'dischargeDatetime' },
        { label: '手术时间', value: 'unknown1', disabled: true },
        { label: '登记时间', value: 'registerDatetime' },
        { label: '签约时间', value: 'unknown2', disabled: true },
        { label: '就诊时间', value: 'medicalDate' },
      ],
      searchKeyList: [
        { label: '姓名', value: 'patientName' },
        { label: '电话', value: 'flupPhone' },
        // { label: "病案号", value: "patientId" },
        // { label: "门诊号", value: "unknown", disabled: true },
        { label: '身份证', value: 'idNo' },
        // { label: "诊断", value: "dischargeDiagnosis" }
      ],
      stateList: [
        { label: '未随访', value: 1 },
        { label: '正常随访', value: 2 },
        { label: '居民死亡', value: 4 },
        { label: '电话错号', value: 5 },
        { label: '电话空号', value: 6 },
        { label: '电话关机', value: 7 },
        { label: '无人接听', value: 8 },
        { label: '拒绝随访', value: 9 },
        { label: '电话停机', value: 10 },
      ],
      patientStateList: [
        { label: '正常', value: 1 },
        { label: '死亡', value: 3 },
        { label: '拒绝', value: 4 },
        { label: '终止', value: 5 },
      ],
      search: {
        // patientType: 2,
        // searchTimeKey: 'admissionDatetime',
        // searchTimeVal: '',
        searchKey: 'patientName',
        searchVal: '',
        searchKey2: 'device_type_id',
        searchVal2: '',
        searchKey3: 'device_serial_number',
        searchVal3: '',
      },
      healthParameterList: [],
      deviceTypeList: [],
      bindInfo: {
        deviceTypeId: '',
        deviceSerialNumber: '',
        targets: [],
      },
      PatientBasicInfoList: [],
      pageSize2: 10,
      pageNo2: 1,
      total2: 0,
      keyword: 'patientName',
      keyValue: null,
      currentRowdx: {},
      rules: {
        deviceTypeId: [
          { required: true, message: '请选择设备类型', trigger: 'change' },
        ],
        deviceSerialNumber: [
          { required: true, message: '请输入设备编号', trigger: 'blur' },
        ],
      },
    }
  },
  async created() {
    this.$apis
      .gethealthparameter({
        pageNo: 1,
        pageSize: 100,
      })
      .then((res) => {
        this.healthParameterList = res.list
      })
    this.$apis
      .queryDevicesTypeList({
        grandParentDictCode: 'Flup',
        parentDictCode: 'device_type',
      })
      .then((res) => {
        console.log(222, res)

        this.deviceTypeList = res
      })
    // window.addEventListener('refresh-data', this.onSearch)
    this.getMainList()
    this.getPatient()
  },
  // computed: {
  //   plan() {
  //     return this.planList.find(item => item.serial_no === this.search.flup_plan_id)
  //   },
  // },
  // destroyed () {
  //   // window.removeEventListener('refresh-data', this.onSearch)
  // },
  methods: {
    handleCurrentChangedx(val) {
      this.currentRowdx = val
      this.bindInfo.userId = val.userId
    },
    nextfu() {
      this.$refs['bindInfo'].validate((valid) => {
        if (valid) {
          this.next = true
          let obj =
            this.deviceTypeList.find(
              (item) => item.deviceTypeId === this.bindInfo.deviceTypeId
            ) || {}
          this.bindInfo.deviceType = obj.deviceType
          this.pageNo2 = 1
          this.keyValue = null
          this.keyword = 'patientName'
          this.getPatient()
        } else {
          return false
        }
      })
    },
    handleSizeChange2(val) {
      this.pageSize2 = val
      this.pageNo2 = 1
      this.getPatient()
    },
    handleCurrentChange2(val) {
      this.pageNo2 = val
      this.getPatient()
    },
    getPatientBySearch() {
      this.pageNo2 = 1
      this.getPatient()
    },
    getPatient() {
      this.$apis
        .getPatientBasicInfo({
          pageSize: this.pageSize2,
          pageNo: this.pageNo2,
          keyword: this.keyword,
          keyValue: this.keyValue,
        })
        .then((res) => {
          this.PatientBasicInfoList = res.list
          this.total2 = res.total
        })
    },
    addto() {
      this.bindInfo.userId = null
      this.bindInfo.deviceTypeId = null
      this.bindInfo.deviceSerialNumber = null
      this.bindInfo.targets = []
      this.dialogVisiable = true
      if (this.$refs['bindInfo']) {
        this.$refs['bindInfo'].resetFields()
      }
    },
    // book() {
    //   // this.dialogBook = true
    //   if (this.$isProduction) {
    //     window.parent.postMessage(
    //       JSON.stringify({
    //         method: "addTab",
    //         url:
    //           location.origin +
    //           "/VUE/#/patientregister?type=" +
    //           this.search.patientType,
    //         title: `住院详情`
    //       }),
    //       "*"
    //     )
    //   } else {
    //     window.open(location.origin + "/#/patientregister?type=" + this.search.patientType)
    //   }
    // },
    onSearch() {
      this.pageIndex = 1
      this.getMainList()
    },
    getMainList() {
      let query = { ...this.search }
      query.searchTimeVal = query.searchTimeVal
        ? this.search.searchTimeVal.join(',')
        : ''
      return this.$apis
        .PatientgetPatientListNew({
          ...query,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          console.log(11, this.search.searchVal2)
          this.mainList = res.list || []
          this.total = res.total
          this.mainList.forEach((element) => {
            this.$apis
              .queryBindDevices({
                userId: element.userId,
                deviceTypeId: this.search.searchVal2,
              })
              .then((res) => {
                this.$set(element, 'devices', res)
              })
          })
        })
    },
    refresh() {
      this.dialogVisiable = false
      // this.dialogBook = false
      this.pageIndex = 1
      this.getMainList()
    },
    // changeState(row) {
    //   this.currentRow = row
    //   this.dialogVisiable = true;
    // },
    // downloadTemplate() {
    //   let host = this.$baseURL.FollowUp
    //   if (this.search.patientType === 'admission') {
    //     location.href = host + '/Document/templates/ImportTemplate/emr_admission_record.xlsx '
    //   } else {
    //     location.href = host + '/Document/templates/ImportTemplate/emr_discharge_record.xlsx'
    //   }
    // },
    // onSuccess(response) {
    //   if ((response.ret_code === 0)) {
    //     this.$notify({
    //       title: '导入完成',
    //       message: response.ret_info,
    //       duration: 0
    //     })
    //     this.getList()
    //   } else {
    //     this.$notify({
    //       title: '导入失败',
    //       message: response.ret_info,
    //       type: 'error',
    //       duration: 0
    //     })
    //   }
    // },
    // onError() {
    //   this.$message({
    //     type: 'error',
    //     message: '导入失败'
    //   })
    // },
    formatPatientType(row, col, val) {
      let obj = this.patientTypeList.find((item) => item.value == val)
      return obj && obj.label
    },
    formatIdNo(row, col, val) {
      return this.$utils.shield(val, 3)
    },
    // formatState(row, col, val) {
    //   let obj = this.stateList.find(item => item.value === val)
    //   return obj && obj.label
    // },
    // async confirmChangeState() {
    //   this.dialogVisiable = false
    //   await this.$apis.updatePatientStatus({serial_no: this.currentRow.serial_no, status: this.currentRow.flup_state})
    //   this.getMainList()
    // },
    // onViewToPatient(row = {}) {
    //   window.parent.postMessage(
    //     JSON.stringify({
    //       method: "addTab",
    //       url: decodeURIComponent(
    //         location.origin + `/PatientArchive/PatientArchive?user_id=${row.user_id}`
    //       ),
    //       title: "患者基本信息"
    //     }),
    //     "*"
    //   );
    // },
    openBindDialog(row = {}) {
      this.bindInfo.deviceTypeId = null
      this.bindInfo.deviceSerialNumber = null
      this.bindInfo.targets = []
      this.dialogVisiable = true
      this.bindInfo.userId = row.userId
      if (this.$refs['bindInfo']) {
        this.$refs['bindInfo'].resetFields()
      }
    },
    onConfirmBind() {
      this.$refs['bindInfo'].validate((valid) => {
        if (valid) {
          if (!this.bindInfo.userId) {
            this.$message({
              message: '请选择患者',
              type: 'warning',
            })
            return
          }

          let obj =
            this.deviceTypeList.find(
              (item) => item.deviceTypeId === this.bindInfo.deviceTypeId
            ) || {}
          this.bindInfo.deviceType = obj.deviceType
          this.$apis.bindDevice(this.bindInfo).then((res) => {
            this.$notify({
              title: '绑定设备成功',
              type: 'success',
            })
            this.getMainList()
            this.dialogVisiable = false
            this.pageNo2 = 1
            this.keyValue = null
            this.next = false
            this.bindInfo = {
              deviceTypeId: '',
              deviceSerialNumber: '',
              targets: [],
            }
          })
        } else {
          return
        }
      })
    },
    unbind(row) {
      this.$confirm(`是否解绑该设备`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$apis.unBindDevice(row).then((res) => {
            this.$notify({
              title: '解绑成功',
              type: 'success',
            })
            this.getMainList()
          })
        })
        .catch(() => {})
    },
    qx() {
      this.next = false
      this.bindInfo.userId = ''
    },
  },
}
</script>

<style lang="scss">
.device-manager {
  padding: 0px 20px 20px 20px;
  font-size: 14px;
  color: #111;
  .el-input-group__prepend {
    color: rgb(96, 98, 102);
    background-color: #fff;
  }
  .el-button--text {
    color: #0283ef;
  }
  .select-time-key {
    .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
  }
  .select-time-val {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  /deep/.dialog {
    .el-dialog__body {
      border: 0;
    }
  }
  /deep/.el-dialog {
    .el-dialog__body {
      padding-left: 24px;
      .demo-ruleForm {
        .el-form-item {
          .el-form-item__label {
            width: 84px;
          }
          .el-form-item__content {
            .el-select {
              width: 294px;
            }
          }
        }
      }
    }
  }
  .el-table__body-wrapper {
    table {
      .el-table__expanded-cell {
        padding: 20px;
      }
    }
  }
  .el-table__fixed-right {
    .el-table__fixed-body-wrapper {
      .el-table__body {
        .el-table__expanded-cell {
          padding: 20px;
        }
      }
    }
  }
}
</style>
