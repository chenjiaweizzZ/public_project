<template>
  <div class="IncomingCall">
    <h3>弹屏基本信息</h3>
    <el-form ref="form" :model="form" label-width="90px">
      <el-form-item label="来电号码">
        <el-input
          class="limiting"
          v-model="form.calledPhone"
          maxlength="15"
          show-word-limit
          @input="form.calledPhone = form.calledPhone.replace(/[^\d]/gi, '')"
        ></el-input>
      </el-form-item>
      <el-form-item label="主管医生">
        <el-input v-model="form.signDoctorName"></el-input>
        <el-button type="success" plain @click="exports">导入</el-button>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.patientName"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input
          class="limiting"
          v-model="form.idNo"
          @input="getIdInformation"
          maxlength="18"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="form.age" disabled></el-input>
      </el-form-item>
      <el-form-item label="出生年月">
        <el-input v-model="form.dateOfBirth" disabled></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input
          class="limiting"
          v-model="form.mobile"
          maxlength="15"
          show-word-limit
          @input="form.mobile = form.mobile.replace(/[^\d]/gi, '')"
        ></el-input>
      </el-form-item>
      <el-form-item label="号码备注">
        <el-input class="limiting" maxlength="20" show-word-limit v-model.trim="form.mobileRemark"></el-input>
      </el-form-item>
      <el-form-item style="width:100%" label="常用住址">
        <el-select
          v-model="form.homeAddrState"
          style="width:190px"
          placeholder="请选择医院所在省"
          clearable
          @change="state"
        >
          <el-option
            v-for="(item,index) in areaList.province_list"
            :key="index"
            :label="item"
            :value="index"
          ></el-option>
        </el-select>
        <el-select
          v-model="form.homeAddrCity"
          style="width:190px"
          placeholder="请选择所在市"
          clearable
          @change="city"
        >
          <el-option v-for="(item,index) in cityList" :key="index" :label="item" :value="index"></el-option>
        </el-select>
        <el-select v-model="form.homeAddrCounty" style="width:190px" placeholder="请选择所在区" clearable>
          <el-option v-for="(item,index) in countryList" :key="index" :label="item" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-input
          type="textarea"
          placeholder="请输入地址"
          v-model="form.homeAddrHouseNumber"
          maxlength="50"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <h3>处理方案</h3>
    <el-form
      style="margin-bottom: 80px;"
      ref="form"
      :model="form"
      label-width="90px"
      :rules="rules"
    >
      <el-form-item label="问题分类">
        <el-select
          v-model="form.problemType"
          placeholder="请选择"
          clearable
          @change="typeName(problemList,form.problemType,'dictCode','dictName','problemName')"
        >
          <el-option
            v-for="item in problemList"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="紧急程度">
        <el-select
          v-model="form.urgencyType"
          placeholder="请选择"
          clearable
          @change="typeName(urgencyList,form.urgencyType,'dictCode','dictName','urgencyName')"
        >
          <el-option
            v-for="item in urgencyList"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="涉及科室">
        <el-select
          v-model="form.involveDeptId"
          placeholder="请选择"
          @change="getgetUserBySectionId"
          clearable
        >
          <el-option
            v-for="item in DeptOptions"
            :key="item.serialNo"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="涉及医生">
        <el-select
          v-model="form.involveDoctorId"
          placeholder="请选择"
          clearable
          @change="typeName(userBySection,form.involveDoctorId,'serialNo','realName','involveDoctorName')"
        >
          <el-option
            v-for="item in userBySection"
            :key="item.serialNo"
            :label="item.realName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width:60%;" label="描述" prop="problemDetail">
        <el-input type="textarea" v-model="form.problemDetail" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item style="width:60%;" label="处理结果" prop="processResult">
        <el-input type="textarea" v-model="form.processResult" maxlength="50" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div class="but">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
    <el-dialog title="选择导入患者" :visible.sync="dialogVisible" width="80%">
      <el-input
        class="margin-left10 width300px"
        style="margin-right: 10px"
        v-model="searchValue"
        clearable
      >
        <el-select class="width100px" v-model="searchKey" slot="prepend">
          <el-option
            v-for="item in searchKeyList"
            :key="item.label"
            :value="item.value"
            :label="item.label"
            :disabled="item.disabled"
          ></el-option>
        </el-select>
      </el-input>
      <el-button plain @click="getlist">查询</el-button>
      <el-button type="success" plain @click="rendering">确认</el-button>
      <el-table
        :data="PatientList"
        border
        style="width: 100%"
        max-height="450"
        highlight-current-row
        @current-change="handleCurrent"
      >
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="patientName" label="患者姓名"></el-table-column>
        <el-table-column prop="sex" label="患者性别"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="idNo" label="身份证号" min-width="200"></el-table-column>
        <el-table-column prop="phone" label="联系电话" min-width="100"></el-table-column>
      </el-table>
      <el-pagination
        :page-sizes="[10, 20, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="total,sizes,prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-dialog>
    <FollowupRecord v-if="xs" :patient-info="currentItem"></FollowupRecord>
  </div>
</template>

<script>
import { areaList } from '@/assets/js/city'
import FollowupRecord from '@/pagesTransfer/components/followup_record'
export default {
  components: { FollowupRecord },
  data() {
    return {
      xs: true,
      currentItem: {
        userId: null,
      },
      dialogVisible: false,
      areaList: areaList,
      form: {
        calledPhone: null,
        signDoctorName: null,
        patientName: null,
        idNo: null,
        age: null,
        dateOfBirth: null,
        mobile: null,
        mobileRemark: null,
        homeAddrState: null,
        homeAddrCity: null,
        homeAddrCounty: null,
        homeAddrHouseNumber: null,
        problemName: null,
        problemType: null,
        urgencyName: null,
        urgencyType: null,
        involveDeptName: null,
        involveDeptId: null,
        involveDoctorName: null,
        involveDoctorId: null,
        problemDetail: null,
        processResult: null,
        callDate: null,
      },
      problemList: [],
      urgencyList: [],
      userBySection: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      searchKey: 'patientName',
      searchValue: null,
      PatientList: [],
      currentRow: null,
      DeptOptions: [],
      searchKeyList: [
        { label: '姓名', value: 'patientName' },
        { label: '电话', value: 'phone' },
        { label: '身份证', value: 'idNo' },
      ],
      rules: {
        problemDetail: [
          { required: true, message: '请输入描述', trigger: 'blur' },
        ],
        processResult: [
          { required: true, message: '请输入处理结果', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    let myDate = new Date()
    let TimeString =
      myDate.getFullYear() +
      '-' +
      (myDate.getMonth() + 1) +
      '-' +
      myDate.getDate() +
      ' ' +
      myDate.getHours() +
      ':' +
      myDate.getMinutes() +
      ':' +
      myDate.getSeconds()
    this.form.callDate = TimeString
    if (this.$route.query.phone) {
      this.form.calledPhone = this.$route.query.phone
      this.$apis
        .getCallPatientInfo({ phone: this.form.calledPhone })
        .then((res) => {
          if (res) {
            this.currentItem = res
            this.form.age = this.currentItem.age
            this.form.homeAddrCity = this.currentItem.homeAddrCity
            this.form.homeAddrCounty = this.currentItem.homeAddrCounty
            this.form.homeAddrState = this.currentItem.homeAddrState
            this.form.homeAddrHouseNumber = this.currentItem.homeAddrHouseNumber
            this.form.idNo = this.currentItem.idNo
            this.form.patientName = this.currentItem.patientName
            this.form.mobile = this.currentItem.phone
            this.form.dateOfBirth = this.currentItem.dateOfBirth
            this.form.sex = this.currentItem.sex
            this.form.userId = this.currentItem.userId
          }
        })
    }
    this.$apis
      .queryDictByCode({
        grandParentDictCode: 'CallCenter',
        parentDictCode: 'problem_type',
      })
      .then((res) => {
        this.problemList = res
      })
    this.$apis
      .queryDictByCode({
        grandParentDictCode: 'CallCenter',
        parentDictCode: 'urgency_type',
      })
      .then((res) => {
        this.urgencyList = res
      })
    this.$apis
      .departmentgetDeptByHospitalId({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.DeptOptions = res
      })
  },
  computed: {
    cityList() {
      if (!this.form.homeAddrState) {
        this.form.homeAddrCity = ''
        this.form.homeAddrCounty = ''
        return {}
      }
      let obj = { ...this.areaList.city_list }
      Object.keys(this.areaList.city_list).forEach((element) => {
        if (element.slice(0, 2) !== this.form.homeAddrState.slice(0, 2)) {
          delete obj[element]
        }
      })
      return obj
    },
    countryList() {
      if (!this.form.homeAddrCity) {
        this.form.homeAddrCounty = ''
        return {}
      }
      let obj = { ...this.areaList.county_list }
      Object.keys(this.areaList.county_list).forEach((element) => {
        if (element.slice(0, 4) !== this.form.homeAddrCity.slice(0, 4)) {
          delete obj[element]
        }
      })
      return obj
    },
  },
  watch: {},
  methods: {
    getIdInformation(value) {
      if (/^\d{17}(\d|x)$/i.test(value)) {
        let arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] //加权因子
        let arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2] //校验码
        let sum = 0,
          idx
        for (let i = 0; i < value.length - 1; i++) {
          // 对前17位数字与权值乘积求和
          sum += parseInt(value.substr(i, 1), 10) * arrExp[i]
        }
        // 计算模（固定算法）
        idx = sum % 11
        // 检验第18为是否与校验码相等
        if (arrValid[idx] == value.substr(17, 1).toUpperCase()) {
          let getCarInfo = this.getCarInfo(value)
          this.form.dateOfBirth = getCarInfo.birthday
          this.form.age = getCarInfo.age
        } else {
          this.form.dateOfBirth = null
          this.form.age = null
        }
      } else {
        this.form.dateOfBirth = null
        this.form.age = null
      }
    },
    typeName(list, type, keyName, labelName, name) {
      for (let i in list) {
        if (list[i][keyName] == type) {
          this.form[name] = list[i][labelName]
        }
      }
    },
    state() {
      this.form.homeAddrCity = null
      this.form.homeAddrCounty = null
    },
    city() {
      this.form.homeAddrCounty = null
    },
    getgetUserBySectionId() {
      for (let i in this.DeptOptions) {
        if (this.DeptOptions[i].serialNo == this.form.involveDeptId) {
          this.form.involveDeptName = this.DeptOptions[i].deptName
        }
      }
      this.form.involveDoctorId = null
      this.form.involveDoctorName = null
      this.$apis
        .getUserBySectionId({
          sectionId: this.form.involveDeptId,
        })
        .then((res) => {
          this.userBySection = res
        })
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (
            (this.form.idNo && this.form.dateOfBirth && this.form.age) ||
            (!this.form.idNo && !this.form.dateOfBirth && !this.form.age)
          ) {
            this.$apis
              .saveFeedback({
                ...this.form,
              })
              .then((res) => {
                if (res) {
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                  })
                }
              })
          } else {
            this.$message({
              message: '身份证号码不正确!',
              type: 'warning',
            })
          }
        } else {
        }
      })
    },
    handleCurrent(val) {
      this.currentRow = val
    },
    rendering() {
      this.xs = false
      if (this.currentRow) {
        this.form.age = this.currentRow.age
        this.form.homeAddrCity = this.currentRow.homeAddrCity
        this.form.homeAddrCounty = this.currentRow.homeAddrCounty
        this.form.homeAddrState = this.currentRow.homeAddrState
        this.form.homeAddrHouseNumber = this.currentRow.homeAddrHouseNumber
        this.form.idNo = this.currentRow.idNo
        this.form.patientName = this.currentRow.patientName
        this.form.mobile = this.currentRow.phone
        this.form.dateOfBirth = this.currentRow.dateOfBirth
        this.form.sex = this.currentRow.sex
        this.form.userId = this.currentRow.userId
        this.currentItem = this.currentRow
        this.dialogVisible = false
      } else {
        this.$message({
          message: '请选择一条信息导入',
          type: 'warning',
        })
      }
      this.$nextTick(() => {
        this.xs = true
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.getgetPatientList()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getgetPatientList()
    },
    exports() {
      this.searchValue = null
      this.dialogVisible = true
      this.getlist()
    },
    getlist() {
      this.pageNo = 1
      this.getgetPatientList()
    },
    getgetPatientList() {
      // this.PatientList = []
      this.$apis
        .getPatientList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          searchKey: this.searchKey,
          searchValue: this.searchValue,
        })
        .then((res) => {
          this.PatientList = res.list
          this.total = res.total
        })
    },
    getCarInfo(UUserCard) {
      //获取输入身份证号码

      var arr = {}

      if (UUserCard != null && UUserCard != '') {
        //获取出生日期

        var birthday =
          UUserCard.substring(6, 10) +
          '-' +
          UUserCard.substring(10, 12) +
          '-' +
          UUserCard.substring(12, 14)

        arr.birthday = birthday

        //获取性别

        if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
          arr.sex = '男'
        } else {
          arr.sex = '女'
        }

        //获取年龄

        var myDate = new Date()

        var month = myDate.getMonth() + 1

        var day = myDate.getDate()

        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1

        if (
          UUserCard.substring(10, 12) < month ||
          (UUserCard.substring(10, 12) == month &&
            UUserCard.substring(12, 14) <= day)
        ) {
          age++
        }

        arr.age = age

        //$("#age").val(age);

        //年龄 age
      }

      return arr
    },
  },
}
</script>

<style lang="scss">
.IncomingCall {
  padding: 0 20px;
  h3 {
    font-size: 16px;
    color: #333333;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #d7dae0;
  }

  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-input {
      width: 260px;
    }
    .el-form-item {
      width: 50%;
    }
    .el-select {
      width: 190px;
      .el-input {
        width: 190px;
      }
    }
  }
  .but {
    width: 100%;
    height: 66px;
    padding: 13px 40px;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #ffffff;
    box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.18);
    .el-button {
      float: right;
    }
  }
  .el-table {
    margin-top: 20px;
  }
}
</style>