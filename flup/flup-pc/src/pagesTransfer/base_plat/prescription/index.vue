<template>
  <div class="prescriptionManage">
    <operationHeader class="margin-bottom20">
      <el-select
        class="margin-left10 width100px select-time-key"
        style="width: 150px"
        default-first-option
        v-model="searchTimeKey"
      >
        <el-option
          v-for="item in timeKeyList"
          :key="item.value"
          :value="item.value"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-date-picker
        class="select-time-val"
        type="daterange"
        v-model="searchTimeValue"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        range-separator="至"
        clearable
        @change="getMainList"
      ></el-date-picker>
      <div style="margin-left: 30px" class="label">科室</div>
      <el-select
        class="width200 value"
        v-model="deptId"
        placeholder="科室"
        @change="getMainList"
        clearable
      >
        <el-option
          v-for="item in deptOptions"
          :key="item.serialNo"
          :value="item.serialNo"
          :label="item.deptName"
        ></el-option>
      </el-select>
      <div class="label">状态</div>
      <el-select
        class="width200 value"
        v-model="automaticCreateStatus"
        placeholder="状态"
        @change="getMainList"
        clearable
      >
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :value="item.value"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-select
        style="margin-left: 20px; width: 110px;margin-right: -5px; z-index: 999; border-right: 0;"
        class="margin-left10 width100px"
        v-model="keyword"
        @change="getMainList"
      >
        <el-option
          v-for="item in keywordList"
          :key="item.value"
          :value="item.value"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-input
        class="width240px value limiting"
        v-model="keyValue"
        placeholder="请输入"
        clearable
        maxlength="20"
        show-word-limit
      >
        <el-button slot="append" icon="el-icon-search" @click="getMainList"></el-button>
      </el-input>
      <template v-slot:right>
        <el-button class="but" type="primary" @click="onAddPre" plain>新增</el-button>
      </template>
    </operationHeader>
    <!-- 处方入组配置     --注释隐藏 -->
    <!-- <div>
      <el-row class="padding-bottom10" type="flex" justify="space-between" align="middle">
        <div style="display: flex;align-items: center;" class="font-size2 color-333">
          计划内患者自动追加新处方
          <el-tooltip
            class="item"
            effect="dark"
            content="（全局控制）开启后已入组计划的患者有新处方时会自动追加临时随访任务"
            placement="top"
          >
            <img
              style="width: 16px;height: 16px;margin-left: 10px;"
              src="~@/assets/images/lsyw.png"
              alt="疑问"
            />
          </el-tooltip>
        </div>
        <div>
          <el-switch
            v-model="paramPre.enabled"
            active-value="1"
            inactive-value="0"
            @change="onEnable"
          ></el-switch>
        </div>
      </el-row>
      <el-table
        ref="table"
        style="margin-bottom:60px"
        class="margin-top20 bdert"
        :data="mainList"
        highlight-current-row
        border
        stripe
      >
        <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
        <el-table-column prop="patientName" label="姓名" width="120"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column show-overflow-tooltip width="120px" prop="userId" label="病人ID"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" label="科室"></el-table-column>
        <el-table-column show-overflow-tooltip width="120px" prop="phone" label="联系电话"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="prescriptionTime"
          label="处方接收/创建时间"
          :formatter="$utils.formatTableDate('YYYY-MM-DD HH:mm:ss')"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="firstSendTime"
          label="首条发送时间"
          :formatter="$utils.formatTableDate('YYYY-MM-DD HH:mm:ss')"
          width="180"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="diagnosis" label="临床诊断" width="200"></el-table-column>
        <el-table-column show-overflow-tooltip prop="doctorName" label="医生" width="100"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="automaticCreateStatus"
          label="自动生成状态"
          width="200"
          :formatter="formatStatus"
        ></el-table-column>
        <el-table-column show-overflow-tooltip :min-width="100" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="onEditPre(scope.row)" type="text">查看</el-button>
            <el-button @click="onDeletePre(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pageBottom"
        v-if="mainList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      ></el-pagination>
      <show
        v-if="dialogVisible"
        :show.sync="dialogVisible"
        :data="dailogData"
        :editable="editable"
        :showTitle="showTitle"
        @getMainList="getMainList"
      ></show>
    </div>-->
  </div>
</template>
<script>
import showDia from './components/show'
import Show from './components/show.vue'
export default {
  components: { showDia, Show },
  data() {
    return {
      searchTimeKey: 'firstSendTime',
      searchTimeValue: [],
      timeKeyList: [
        { name: '首条发送时间', value: 'firstSendTime' },
        { name: '开方时间', value: 'prescriptionTime' },
      ],
      automaticCreateStatus: '',
      statusList: [
        { name: ' 任务未生成', value: '0' },
        { name: '任务已生成', value: '1' },
        { name: '任务生成失败', value: '2' },
      ],
      keyword: 'patientName',
      keywordList: [
        { name: '患者姓名', value: 'patientName' },
        { name: ' 联系电话', value: 'phone' },
      ],
      deptId: '',
      keyValue: '',
      pageNo: 1,
      pageSize: 10,
      total: 0,
      deptOptions: [],
      memberList: [],
      mainList: [],
      hospitalList: [],
      groupTypeList: [
        { label: '随访组', value: 0 },
        { label: '慢病组', value: 1 },
      ],
      currentDialog: '',
      dialogVisible: false,
      dailogData: null,
      currentGroup: null,
      editable: false,
      // paramPre: { enabled: '1' },
      showTitle: '',
    }
  },
  async created() {
    // 处方入组配置     --注释隐藏
    // this.$apis
    //   .ParameterselectParametersByParameterKey({
    //     parameterKey: 'PrescriptionGroup',
    //     hospitalId: this.$global.hospital_id,
    //   })
    //   .then((res) => {
    //     if (res) {
    //       this.paramPre = res
    //     }
    //   })
    await this.getDeptList()
    await this.getMainList()
  },
  methods: {
    getDeptList() {
      return this.$apis
        .departmentgetFlupDeptByHospitalId({
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.deptOptions = res || []
        })
    },
    onAddPre() {
      this.resetDiaData()
      this.showTitle = '新增'
      this.editable = true
      this.dialogVisible = true
    },
    resetDiaData() {
      this.dailogData = {
        patientName: '',
        sex: '',
        age: '',
        userId: '',
        deptCode: '',
        deptName: '',
        diagnosis: '',
        detailList: [],
        detail: {},
      }
    },
    onEditPre(value) {
      this.dailogData = value
      this.editable = false
      this.showTitle = '查看'
      this.dialogVisible = true
    },
    getMainList() {
      var param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        keyword: this.keyword,
        keyValue: this.keyValue,
        hospitalId: this.$global.hospital_id,
        automaticCreateStatus: this.automaticCreateStatus,
        deptId: this.deptId,
        searchTimeKey: this.searchTimeKey,
        searchTimeValue: this.searchTimeValue
          ? this.searchTimeValue.join(',')
          : '',
      }
      this.$apis.getPrescriptionList(param).then((res) => {
        this.mainList = res.list
        this.total = res.total
      })
    },
    formatStatus(value) {
      var name = ''
      var status = this.statusList.filter(
        (x) => x['value'] == value.automaticCreateStatus
      )
      if (status.length > 0) {
        name = status[0].name

        if (value == '2') {
          name += '（请手动操作）'
        }
      }
      return name
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1
      this.pageSize = pageSize
      this.getMainList()
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo
      this.getMainList()
    },
    // 处方入组配置     --注释隐藏
    // onEnable() {
    //   this.$apis.ParameterupdateParameter(this.paramPre).then((res) => {
    //     this.$message({
    //       type: 'success',
    //       message: '修改成功!',
    //     })
    //   })
    // },
    onDeletePre(row) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$apis.deletePrescription(row.serialNo).then((res) => {
          this.$message({
            type: 'warning',
            message: '删除成功!',
          })
          if (this.mainList.length == 1 && this.pageNo != 1) {
            this.pageNo = this.pageNo - 1
          }
          this.getMainList()
        })
      })
    },
  },
}
</script>
<style lang="scss">
.prescriptionManage {
  padding: 0px 20px 20px 20px;
  .el-input-group__prepend {
    color: rgb(96, 98, 102);
    background-color: #fff;
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
}
</style>