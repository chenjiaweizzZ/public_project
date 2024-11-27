<template>
  <div class="sickPersonMigrate">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>状态</p>
        <el-select v-model="status" placeholder="请选择状态" @change="handleClick">
          <el-option label="待处理" value="0"></el-option>
          <el-option label="拒回" value="-1"></el-option>
          <el-option label="已接收" value="1"></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>{{activeName==2?'转入':'转出'}}时间</p>
        <el-date-picker
          clearable
          type="daterange"
          v-model="time"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
          @change="handleClick"
        ></el-date-picker>
      </div>

      <div v-if="hidden" class="queryConditions">
        <el-input
          placeholder="请输入内容"
          v-model="searchValue"
          class="input-with-select margin-left20 limiting"
          maxlength="20"
          show-word-limit
        >
          <el-select style=" width: 100px" v-model="searchKey" slot="prepend" placeholder="请选择">
            <el-option label="姓名" value="patientName"></el-option>
            <el-option label="联系电话" value="phone"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleClick"></el-button>
        </el-input>
      </div>
      <div class="butBox">
        <el-button
          style="width:80px"
          class="margin-left10"
          v-if="!hidden"
          type="text"
          @click="showOrHide"
        >高级查询</el-button>
        <el-button
          style="width:80px"
          class="margin-left10"
          v-else
          type="text"
          @click="showOrHide"
        >收起</el-button>
        <el-button
          :disabled="activeName==1||status==1||status==-1"
          class="margin-left10"
          type="primary"
          plain
          @click="transferPatientHandleList('1')"
        >批量接收</el-button>
        <el-button
          :disabled="activeName==1||status==0||status==-1"
          class="margin-left10"
          type="primary"
          plain
          @click="addPlan"
        >批量入组</el-button>
        <el-button
          :disabled="activeName==1||status==1||status==-1"
          class="margin-left10"
          type="warning"
          plain
          @click="transferPatientHandleList('-1')"
        >批量拒回</el-button>
      </div>
    </div>
    <div class="nowadayHospital">
      <div>
        <h3>
          <span>当前医院：</span>
          {{$global.unitName}}
        </h3>
        <div v-if="activeName ==2" class="queryConditions">
          <p>来源医院</p>
          <el-select v-model="sourceHospital" placeholder="请选择来源医院" clearable @change="handleClick">
            <el-option
              v-for="item in inList"
              :key="item.targetHospitalId"
              :label="item.targetHospitalName"
              :value="item.targetHospitalId"
            ></el-option>
          </el-select>
        </div>
        <div v-if="activeName ==1" class="queryConditions">
          <p>目标医院</p>
          <el-select
            v-model="targetHospital"
            placeholder="请选择目标医院"
            clearable
            @change="getdepartmentgetDeptByHospitalId"
          >
            <el-option
              v-for="item in outList"
              :key="item.targetHospitalId"
              :label="item.targetHospitalName"
              :value="item.targetHospitalId"
            ></el-option>
          </el-select>
        </div>
        <div class="queryConditions">
          <p>{{activeName==1?'转出':'转入'}} 科室</p>
          <el-select
            v-model="deptId"
            placeholder="请选择科室"
            clearable
            @change="getTransferPatientRecordList"
          >
            <el-option
              v-for="item in hospitalList"
              :key="item.serialNo"
              :label="item.deptName"
              :value="item.serialNo"
            ></el-option>
          </el-select>
        </div>
      </div>
      <el-button type="primary" @click="dialogVisible=true" :disabled="transferOut">患者转出</el-button>
    </div>
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="转入" name="2"></el-tab-pane>
      <el-tab-pane label="转出" name="1"></el-tab-pane>
    </el-tabs>
    <el-table
      v-if="refresh"
      :data="tableData"
      border
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      style="width: 100%;margin-bottom:60px;margin-top: -1px;"
    >
      <el-table-column v-if="activeName==2" type="selection" width="40"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名" width="90">
        <template slot-scope="scope">
          <el-button
            @click="onView(scope.row)"
            type="text"
          >{{ scope.row.patientName | hideInfo('name') }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="患者性别" width="80"></el-table-column>
      <el-table-column prop="age" label="年龄" width="50"></el-table-column>
      <el-table-column prop="dateOfBirth" label="出生日期" width="110"></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="130"></el-table-column>
      <el-table-column prop="patientId" label="病案号"></el-table-column>
      <el-table-column prop="transferDatetime" label="转院时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sourceHospitalName" label="来源医院" width="240" show-overflow-tooltip></el-table-column>
      <el-table-column prop="targetHospitalName" label="目标医院" width="240" show-overflow-tooltip></el-table-column>
      <el-table-column prop="deptName" label="转院科室"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==0">待处理</span>
          <span v-if="scope.row.status==-1">拒回</span>
          <span v-if="scope.row.status==1">已处理</span>
        </template>
      </el-table-column>
      <el-table-column v-if="activeName==2" label="操作" width="170" fixed="right">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status !=0"
            type="text"
            @click="transferPatientHandle('1',scope.row)"
          >接收</el-button>
          <el-button
            :disabled="scope.row.status !=1"
            type="text"
            @click="addPlan(scope.row,true)"
          >入组计划</el-button>
          <el-button
            :disabled="scope.row.status !=0"
            type="text"
            @click="transferPatientHandle('-1',scope.row)"
          >拒回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
    ></el-pagination>
    <el-dialog
      title="入组计划"
      :visible.sync="dialogVisible"
      width="75%"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
    >
      <div class="enterProject">
        <p>患者类型</p>
        <el-select
          v-model="patientObj.patientTypeCode"
          placeholder="请选择患者类型"
          @change="getPatientList"
        >
          <el-option
            v-for="item in patientTypeList"
            :key="item.patientTypeCode"
            :value="item.patientTypeCode"
            :label="item.patientTypeName"
          ></el-option>
        </el-select>
        <p>科室</p>
        <el-select
          v-model="patientObj.deptId"
          placeholder="请选择科室"
          clearable
          @change="getPatientList"
        >
          <el-option
            v-for="item in newDeptOptions"
            :key="item.serialNo"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          v-model="patientObj.searchVal"
          class="input-with-select margin-left20 limiting"
          maxlength="20"
          show-word-limit
        >
          <el-select
            style=" width: 100px"
            v-model="patientObj.searchKey"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option
              v-for="item in searchKeyList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getPatientList"></el-button>
        </el-input>
      </div>
      <el-table
        :data="patientList"
        border
        style="width: 100%;margin-top: 10px;"
        max-height="350"
        @selection-change="handleSelectionChange1"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="patientName" label="患者姓名" width="100">
          <template slot-scope="scope">
            <el-button
              @click="onView(scope.row)"
              type="text"
            >{{ scope.row.patientName | hideInfo('name') }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="患者性别" width="80"></el-table-column>
        <el-table-column prop="age" label="年龄" width="50"></el-table-column>
        <el-table-column prop="dateOfBirth" label="出生日期"></el-table-column>
        <el-table-column prop="idNo" label="身份证" width="180"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column prop="inpNo" label="病案号"></el-table-column>
        <el-table-column prop="wardName" label="科室"></el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="patientObj.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="patientObj.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total1"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="candidateship">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible1"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
    >
      <div class="shiftWarnBox">
        <p>所选患者将从当前医院转出到目标医院</p>
        <p>1.患者的个人信息将会保留，同时全部信息转移到目标医院</p>
        <p>2.目标医院接收后，当前医院患者随访计划将全部中止此操作无法撤销，请确认后操作</p>
        <p>
          患者({{saveTransferPatientObj.list.length}})：
          <el-button
            v-for="(item, index) in saveTransferPatientObj.list"
            :key="index"
            @click="onView(item.row)"
            type="text"
          >{{ item.patientName | hideInfo('name') }}</el-button>
        </p>
        <div class="shiftDetails">
          <div class="text">
            当前医院：{{$global.unitName}}
            <span style="color: #0283ef;">转出</span>
          </div>
          <div class="shiftSelect">
            <div>
              <span>目标医院：</span>
              <el-select
                v-model="saveTransferPatientObj.targetHospitalId"
                placeholder="请选择医院"
                clearable
                @change="getDeptByHospitalId"
              >
                <el-option
                  v-for="item in outList"
                  :key="item.targetHospitalId"
                  :label="item.targetHospitalName"
                  :value="item.targetHospitalId"
                ></el-option>
              </el-select>
            </div>
            <div>
              <span>科室：</span>
              <el-select
                v-model="saveTransferPatientObj.deptId"
                placeholder="请选择科室"
                clearable
                @change="getDeptName"
              >
                <el-option
                  v-for="item in deptList"
                  :key="item.serialNo"
                  :label="item.deptName"
                  :value="item.serialNo"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="shiftConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="入组计划"
      :visible.sync="dialogVisible2"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
    >
      <p style="line-height: 40px;">请选择患者需要入组的计划</p>
      <el-select v-model="FlupPlanSerialNo" placeholder="请选择随访计划">
        <el-option
          v-for="item in FlupPlanList"
          :key="item.serialNo"
          :label="item.planName"
          :value="item.serialNo"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible3"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
    >
      <span>请为患者分配随访/慢管医生</span>
      <p>患者:</p>
      <div class="margin-top10">
        <span style="display: inline-block; width: 100px">执行科室:</span>
        <el-select disabled v-model="planDept" placeholder="请选择">
          <el-option
            v-for="item in newDeptOptions"
            :key="item.serialNo"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
      </div>
      <div class="margin-top10">
        <span style="display: inline-block; width: 100px">随访/慢病组:</span>
        <el-select disabled v-model="fuGroupId" placeholder="请选择">
          <el-option
            v-for="(item, index) in fuGrouplist"
            :key="index"
            :label="item.groupName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
      </div>
      <div class="margin-top10">
        <span style="display: inline-block; width: 100px">随访/慢病医生:</span>
        <el-select v-model="fuDoctorId" placeholder="请选择" @change="getFuDoctorName">
          <el-option
            v-for="(item, index) in fuDoctorlist"
            :key="index"
            :label="item.realName"
            :value="item.userId"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="tijiao">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NewPatientAlert from '@/components/newPatientAlert'
import { patientModel } from '@/mixins/enum.js'
export default {
  components: { NewPatientAlert },
  mixins: [patientModel],
  data() {
    return {
      refresh: true,
      total: 0,
      total1: 0, //弹窗患者列表
      pageNo: null,
      pageSize: null,
      deptId: null,
      time: null,
      hospitalList: [], //联动科室列表
      sourceHospital: '', //来源医院id
      targetHospital: '', //目标医院id
      status: '0',
      searchKey: 'patientName',
      searchValue: '',
      activeName: '2',
      outList: [], //转出医院列表
      inList: [], //转入医院列表
      dialogVisible: false, //患者转出显示判断
      dialogVisible1: false, //患者转出下一步显示判断
      dialogVisible2: false, //入组计划显示判断
      dialogVisible3: false, //入组计划下一步显示判断
      hidden: false, //高级筛选
      tableData: [],
      patientTypeList: [
        // { label: '出院患者', value: '2' },
        // { label: '在院患者', value: '1' },
        // { label: '门诊患者', value: '4' },
        // { label: '互联网患者', value: '5' },
        // { label: '签约患者', value: '3' },
        // { label: '转院患者', value: '6' },
      ],
      searchKeyList: [
        { label: '姓名', value: 'patientName' },
        { label: '电话', value: 'flupPhone' },
        { label: '病案号', value: 'patientId' },
        { label: '身份证', value: 'idNo' },
      ],
      newDeptOptions: [], //所有科室
      //患者列表查询条件
      patientObj: {
        pageNo: 1,
        pageSize: 10,
        patientTypeCode: 'DISCHARGE_PATIENT',
        searchKey: 'patientName',
        searchVal: '',
        deptId: '',
      },
      patientList: [],
      multipleSelection: [],
      //患者转入表单
      saveTransferPatientObj: {
        deptId: null,
        deptName: null,
        targetHospitalId: null,
        targetHospitalName: null,
        list: [],
      },
      //患者转入表单科室
      deptList: [],
      FlupPlanList: [], //计划列表
      FlupPlanSerialNo: '',
      fuGrouplist: [],
      fuDoctorlist: [],
      planDept: null,
      fuGroupId: null,
      fuDoctorId: null,
      fuDoctorName: null,
      groupPatients: [],
      transferOut: false,
    }
  },
  mounted() {
    this.getTransferHospitalList('1')
    this.getTransferHospitalList('2')
    this.getTransferPatientRecordList()
    this.$apis.systemManagequeryCurrentUserDept({}).then((res) => {
      this.newDeptOptions = res
    })
    this.getPatientgetPatientList()
    this.$apis
      .transferPatientQueryCurrentUserFlupPlanList({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.FlupPlanList = res
        if (res.length != 0) {
          this.FlupPlanSerialNo = res[0].serialNo
        }
      })
    this.$apis
      .queryFlupConfigOne({
        hospitalId: this.$global.hospital_id,
        componentKey: 'transferOut',
        moduleCode: 'transferHospital',
      })
      .then((res) => {
        if (res.componentValue == 0) {
          this.transferOut = true
        } else {
          this.transferOut = false
        }
      })
    this.getDeptByHospitalIdList()
    this.$apis.queryPatientTypeAll().then((res) => {
      this.patientTypeList = res.filter((x) => x.enabled)
    })
    this.patientObj.patientTypeCode = this.patientModel.discharge
  },
  methods: {
    getDeptByHospitalIdList() {
      this.$apis
        .departmentgetDeptByHospitalId({
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.hospitalList = res
        })
    },
    transferPatientHandleList(status) {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请勾选需要操作的记录',
          type: 'warning',
        })
        return
      }

      let serialNo = []
      for (const key in this.multipleSelection) {
        if (this.multipleSelection[key].status != 0) {
          this.$message({
            message: '当前所选患者无法执行该操作!',
            type: 'warning',
          })
          return
        }
        serialNo.push(this.multipleSelection[key].serialNo)
      }
      // this.multipleSelection.forEach((element) => {
      //   if (element.status != 0) {
      //     this.$message({
      //       message: '当前所选患者无法执行该操作!',
      //       type: 'warning',
      //     })
      //     return
      //   }
      //   serialNo.push(element.serialNo)
      // })

      this.$apis
        .transferPatientHandle({
          status,
          serialNo: serialNo.join(','),
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            })
            this.handleClick()
          }
        })
    },
    transferPatientHandle(status, row) {
      this.$apis
        .transferPatientHandle({
          status,
          serialNo: row.serialNo,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            })
            this.handleClick()
          }
        })
    },
    //患者添加计划
    tijiao() {
      if (!this.fuDoctorId) {
        this.$message({
          message: '请选择随访慢病医生',
          type: 'warning',
        })
        return
      }
      this.$apis
        .AddIcdmPatientManage({
          joinPlanPatientType: 6,
          joinType: '转院患者',
          patientTypeCode: 'TRANSFER_PATIENT',
          flupPlanId: this.FlupPlanSerialNo,
          groupPatients: this.groupPatients,
          fuDoctorName: this.fuDoctorName,
          fuDoctorId: this.fuDoctorId,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.dialogVisible3 = false
          let succeedCount = 0
          let errorList = []
          for (let i in res) {
            if (res[i].groupCount == 0) {
              errorList.push(res[i])
            } else {
              succeedCount += res[i].groupCount
            }
          }

          if (succeedCount > 0) {
            this.$message({
              message: '操作成功，共生成 ' + succeedCount + ' 条任务',
              type: 'success',
            })
          }
          if (errorList.length > 0) {
            const h = this.$createElement
            this.$notify.error({
              title: '失败',
              duration: 0,
              message: h('NewPatientAlert', {
                props: {
                  errorList,
                },
              }),
            })
          }
        })
    },
    getFuDoctorName() {
      this.fuDoctorlist.forEach((element) => {
        if (this.fuDoctorId == element.userId) {
          this.fuDoctorName = element.realName
        }
      })
    },
    getfuGrouplist() {
      this.$apis
        .systemManagequeryFlupGroupByDeptId({
          deptId: this.planDept,
        })
        .then((res) => {
          this.fuGrouplist = res
        })
    },
    getfuDoctorlist() {
      this.fuDoctorlist = []
      this.$apis
        .systemManagequeryFlupGroupMembersByGroupId({
          groupId: this.fuGroupId,
        })
        .then((res) => {
          this.$nextTick(() => {
            this.fuDoctorlist = res
            this.fuDoctorId = null
          })
        })
    },
    addPlan(row, odd) {
      if (!odd && this.multipleSelection.length == 0) {
        this.$message({
          message: '请勾选需要操作的记录',
          type: 'warning',
        })
        return
      }
      this.groupPatients = []
      this.dialogVisible2 = true
      if (!odd) {
        this.multipleSelection.forEach((element) => {
          let obj = {
            groupPatientRecordSerialNo: element.serialNo,
            groupPatientRecordTime: element.transferDatetime,
            patientName: element.patientName,
            userId: element.userId,
          }
          this.groupPatients.push(obj)
        })
      } else {
        let obj = {
          groupPatientRecordSerialNo: row.serialNo,
          groupPatientRecordTime: row.transferDatetime,
          patientName: row.patientName,
          userId: row.userId,
        }
        this.groupPatients.push(obj)
      }
    },
    nextStep() {
      this.FlupPlanList.forEach((element) => {
        if (this.FlupPlanSerialNo == element.serialNo) {
          this.planDept = element.executiveDeptId
          this.fuGroupId = element.fuGroupId
          this.getfuGrouplist()
          this.getfuDoctorlist()
        }
      })
      this.dialogVisible2 = false
      this.dialogVisible3 = true
    },
    shiftConfirm() {
      if (
        !this.saveTransferPatientObj.deptId ||
        !this.saveTransferPatientObj.targetHospitalId
      ) {
        this.$message({
          message: '请选择医院和科室',
          type: 'warning',
        })
        return
      } else {
        this.dialogVisible1 = false
        this.$apis
          .saveTransferPatient({
            ...this.saveTransferPatientObj,
            patientTypeCode: this.patientObj.patientTypeCode,
          })
          .then((res) => {
            if (res) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              this.handleClick()
            }
          })
      }
    },
    getDeptName() {
      this.deptList.forEach((element) => {
        if (this.saveTransferPatientObj.deptId == element.serialNo) {
          this.saveTransferPatientObj.deptName = element.deptName
        }
      })
    },
    candidateship() {
      if (this.saveTransferPatientObj.list.length == 0) {
        this.$message({
          message: '请至少选一个患者!',
          type: 'warning',
        })
        return
      } else {
        this.dialogVisible = false
        this.dialogVisible1 = true
      }
    },
    handleSelectionChange(val) {
      for (let i in val) {
        if (val[i].status != -1) {
          this.multipleSelection = val
        } else {
          this.$message({
            message: '已拒回的患者不可选择!',
            type: 'warning',
          })
          this.$refs.multipleTable.toggleRowSelection(val[i], false)
        }
      }
    },
    handleSelectionChange1(val) {
      this.saveTransferPatientObj.list = val
    },
    getPatientList() {
      this.patientObj.pageNo = 1
      this.getPatientgetPatientList()
    },
    getPatientgetPatientList() {
      this.$apis
        .PatientgetPatientList({
          ...this.patientObj,
          hospitalId: this.$global.hospital_id,
          isNormal: 1,
        })
        .then((res) => {
          this.patientList = res.list
          this.total1 = res.total
        })
    },
    getTransferPatientRecordList() {
      let startDate, endDate
      if (this.time) {
        startDate = this.time[0]
        endDate = this.time[1]
      }
      this.$apis
        .getTransferPatientRecordList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          type: this.activeName == 2 ? 1 : 2,
          startDate,
          endDate,
          status: this.status,
          targetHospital: this.targetHospital,
          sourceHospital: this.sourceHospital,
          deptId: this.deptId,
          searchKey: this.searchKey,
          searchValue: this.searchValue,
        })
        .then((res) => {
          this.tableData = res.list
          this.total = res.total
          this.$nextTick(() => {
            this.refresh = true
          })
        })
    },
    handleClick() {
      this.multipleSelection = []
      this.refresh = false
      this.pageNo = 1
      // this.getTransferHospitalList()
      this.getdepartmentgetDeptByHospitalId()
      this.getTransferPatientRecordList()
    },
    getDeptByHospitalId() {
      this.saveTransferPatientObj.deptId = null
      this.saveTransferPatientObj.deptName = null
      this.outList.forEach((element) => {
        if (
          this.saveTransferPatientObj.targetHospitalId ==
          element.targetHospitalId
        ) {
          this.saveTransferPatientObj.targetHospitalName =
            element.targetHospitalName
        }
      })
      this.$apis
        .departmentgetDeptByHospitalId({
          hospitalId: this.saveTransferPatientObj.targetHospitalId,
        })
        .then((res) => {
          this.deptList = res
        })
    },
    getdepartmentgetDeptByHospitalId() {
      this.deptId = null
      if (this.activeName == 2) {
        this.targetHospital = null
        this.getDeptByHospitalIdList()
      } else {
        this.sourceHospital = null
        if (!this.targetHospital) {
          this.hospitalList = []
        } else {
          this.$apis
            .departmentgetDeptByHospitalId({
              hospitalId: this.targetHospital,
            })
            .then((res) => {
              this.hospitalList = res
            })
        }
      }
      // this.deptId = null
      // if (!hospitalId) {
      //   this.hospitalList = []
      //   return
      // }
      this.getTransferPatientRecordList()
      // this.$apis
      //   .departmentgetDeptByHospitalId({
      //     hospitalId,
      //   })
      //   .then((res) => {
      //     this.hospitalList = res
      //   })
    },
    getTransferHospitalList(status) {
      this.$apis
        .getTransferHospitalList({
          status: status,
        })
        .then((res) => {
          if (status == '1') {
            this.outList = res
          } else {
            this.inList = res
          }
        })
    },
    showOrHide() {
      this.hidden = !this.hidden
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNo = 1
      this.handleClick()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.handleClick()
    },
    handleSizeChange1(val) {
      this.patientObj.pageSize = val
      this.patientObj.pageNo = 1
      this.getPatientgetPatientList()
    },
    handleCurrentChange1(val) {
      this.patientObj.pageNo = val
      this.getPatientgetPatientList()
    },
    onView(row) {
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/healtharchives?userId=${row.userId}&name=${
              row.patientName
            }&sex=${row.sex}&age=${this.$utils.getAge(row.dateOfBirth)}&phone=${
              row.phone
            }&dateTime=${this.$utils.formatDate(row.createDatetime)}
             &recordSerialNo=${row.recordSerialNo}
            &joinPlanPatientType=transfer&flupPlanId=${
              row.flupPlanId ? row.flupPlanId : ''
            }&conceal=${true}`,
          title: '健康档案',
        }),
        '*'
      )
    },
  },
}
</script>
<style lang="scss">
.sickPersonMigrate {
  padding: 0 20px;
  .nowadayHospital {
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      display: flex;
      align-items: center;
    }
  }
  .queryConditions {
    margin: 10px;
    display: inline-block;
    p {
      margin-left: 10px;
      display: inline-block;
      margin-right: 14px;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
    }
  }
  .enterProject {
    display: flex;
    align-items: center;
    > p {
      margin: 0 10px 0 20px;
    }
    > .el-input {
      width: 350px;
      .el-input-group__append,
      .el-input-group__prepend {
        background-color: #fff;
      }
    }
  }
  .shiftWarnBox {
    padding: 0px 20px;
    > p {
      line-height: 30px;
    }
    .shiftDetails {
      width: 100%;
      height: 120px;
      padding: 10px;
      margin-top: 10px;
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .text {
        width: 60%;
        line-height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .shiftSelect {
        width: 50%;
        height: 100px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
      }
    }
  }
}
</style>
