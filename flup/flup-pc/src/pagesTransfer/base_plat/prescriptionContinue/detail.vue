<template>
  <section class="prescription_detail">
    <!-- <div style="width:80%; border-bottom: 1px solid #d7dae0;"></div> -->
    <div
      style="border-top: 1px solid #d7dae0; display: flex;align-items: center; justify-content: space-between;"
    >
      <div class="prescriptionInfo">
        <div>
          <span>姓名：</span>
          <p>{{ preDetail.patientName }}</p>
        </div>
        <div>
          <span>性别：</span>
          <p>{{ preDetail.sex }}</p>
        </div>
        <div>
          <span>年龄：</span>
          <p>{{ preDetail.age }}</p>
        </div>
      </div>
      <template v-if="!autoStatus">
        <ol style="display: flex;align-items: center; ">
          &emsp;
          <el-radio v-model="autoGroup" label="0">自动入组</el-radio>
          <el-radio v-model="autoGroup" label="1">手动入组</el-radio>
          <div v-if="autoGroup=='1'">
            随访计划 &emsp;
            <el-select v-model="newPlanId">
              <el-option
                v-for="item in planList"
                :key="item.serialNo"
                :label="item.planName"
                :value="item.serialNo"
              ></el-option>
            </el-select>
          </div>
        </ol>
      </template>
    </div>
    <div class="prescriptionInfo">
      <div>
        <span>用户ID：</span>
        <p>{{ preDetail.userId }}</p>
      </div>
      <div>
        <span>科室：</span>
        <p>{{ preDetail.deptName }}</p>
      </div>
    </div>
    <div class="prescriptionInfo">
      <div>
        <span>临床诊断：</span>
        <p>{{ preDetail.diagnosis }}</p>
      </div>
    </div>
    <div style="width:100%; border-bottom: 1px solid #d7dae0;"></div>
    <div>
      <el-table style="margin-top:16px" :data="mainList" stripe border>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip label="药品名称" min-width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.drugName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="药物剂量" min-width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.drugDose }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip v-if="editable" label="药物剂量单位" min-width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.drugDoseUnit }}</div>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.drugNum }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="editable" show-overflow-tooltip label="数量单位" min-width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.drugNumUnit }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="天数(天)" min-width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.drugDays }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="用法" min-width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.usageAndDosage }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="首条发送时间" min-width="210">
          <template slot-scope="scope">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-if="scope.$index == editIndex"
              v-model="editRow.firstSendTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
            <div v-else>{{scope.row.firstSendTime }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="发送间隔(天)" min-width="120">
          <template slot-scope="scope">
            <el-input-number
              v-if="scope.$index == editIndex"
              v-model="editRow.sendInterval"
              :max="9999"
              :min="1"
              controls-position="right"
            ></el-input-number>
            <div v-else>{{ scope.row.sendInterval }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="共计发送次数" min-width="120">
          <template slot-scope="scope">
            <el-input-number
              v-if="scope.$index == editIndex"
              v-model="editRow.sendTimes"
              :min="1"
              :max="9999"
              controls-position="right"
            ></el-input-number>
            <div v-else>{{ scope.row.sendTimes }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="autoStatus" show-overflow-tooltip label="发送进度" min-width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.sendingProgress }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!autoStatus"
          fixed="right"
          prop="createTime"
          label="操作"
          min-width="100"
        >
          <template slot-scope="scope">
            <div v-if="scope.$index == editIndex && editSattus !== 'none'">
              <el-button @click="onCancel" type="text">撤销</el-button>
              <el-button type="text" @click="onConfirm(scope.$index)">确定</el-button>
            </div>
            <div v-else>
              <el-button type="text" @click="onEdit(scope.$index)">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="width:100%; border-bottom: 1px solid #d7dae0; margin-top:16px"></div>
    <div class="bottomAddBox" v-if="autoStatus">
      已入组计划:{{ groupPlan }} &ensp;
      <div v-if="addPlan">
        &ensp;
        <el-select v-model="newPlanId">
          <el-option
            v-for="item in planList"
            :key="item.serialNo"
            :label="item.planName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
      </div>
      <i
        v-else-if="!addPlan && planList.length > 0"
        style="color: #0283ef; font-size: 17px; font-weight: 600"
        class="el-icon-circle-plus-outline"
        @click="addPlan = true"
      ></i>
    </div>
    <div class="footer padding-top20">
      <el-row v-if="!autoStatus" type="flex" align="middle" justify="center">
        <el-button class="width100px" type="primary" @click="onSubmit">提交</el-button>
      </el-row>
      <el-row v-if="addPlan" type="flex" align="middle" justify="center">
        <el-button @click="addPlan = false">取消</el-button>
        <el-button type="primary" @click="onAddPlan">确定</el-button>
      </el-row>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      preDetail: {},
      autoGroup: '0',
      editable: true,
      newPlanId: '',
      planList: [],
      editIndex: -1,
      editSattus: 'none',
      mainList: [],
      editRow: {},
      autoStatus: true,
      groupPlan: '',
      newPlanId: '',
      addPlan: false,
    }
  },
  created() {
    this.getPrescriptionDetail()

    //获取开启处方计划
    this.$apis
      .queryFlupPlanListByPrescriptionEnable({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.planList = res
        if (this.planList.length > 0) {
          this.newPlanId = this.planList[0].serialNo
        }
      })
  },
  methods: {
    getPrescriptionDetail() {
      this.$apis
        .getPrescriptionDetail({ serialNo: this.$route.query.serialNo })
        .then((res) => {
          this.preDetail = res
          //是否处理状态
          this.autoStatus = this.preDetail.status == 1
          if (this.preDetail.detail[1]) {
            this.mainList = this.preDetail.detail[1]
          } else {
            //如果没有处方屏蔽提交按钮
            this.autoStatus = true
          }

          //已入组计划
          if (res.groupPlanId) {
            res.groupPlanId.forEach((element) => {
              var index = this.planList.findIndex((x) => x.serialNo == element)
              if (index > -1) {
                this.groupPlan += this.planList[index].planName + '; '
                this.planList.splice(index, 1)
              }
            })
            this.newPlanId = this.planList[0].serialNo
          }
        })
    },
    onEdit(index) {
      if (this.editSattus !== 'none') {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!',
        })
        return
      }
      this.editSattus = 'edit'
      this.editIndex = index
      this.editRow = { ...this.mainList[index] }
    },
    onConfirm(index) {
      if (!this.editRow.firstSendTime) {
        this.$message({
          type: 'warning',
          message: '请选择首条发送时间',
        })
        return
      }
      if (!this.editRow.sendInterval) {
        this.$message({
          type: 'warning',
          message: '请选择发送间隔',
        })
        return
      }
      if (!this.editRow.sendTimes) {
        this.$message({
          type: 'warning',
          message: '请选择共计发送次数',
        })
        return
      }
      this.editSattus = 'none'
      this.$set(this.mainList, index, this.editRow)
      this.editIndex = -1
    },
    onCancel() {
      if (this.editSattus === 'add') {
        this.mainList.splice(this.mainList.length - 1, 1)
      }
      this.editSattus = 'none'
      this.editIndex = -1
    },
    onSubmit() {
      try {
        this.mainList.forEach((x) => {
          if (!x.firstSendTime) {
            this.$message({
              type: 'warning',
              message: '数据未选择首条发送时间！',
            })
            throw new Error('')
          }
          if (!x.sendInterval) {
            this.$message({
              type: 'warning',
              message: '数据未选择发送间隔！',
            })
            throw new Error('')
          }
          if (!x.sendTimes) {
            this.$message({
              type: 'warning',
              message: '数据未选择共计发送次数',
            })
            throw new Error('')
          }
        })

        //自动入组或手动入组
        if (this.autoGroup == '0') {
          this.preDetail.flupPlanId = ''
        } else {
          this.preDetail.flupPlanId = this.newPlanId
        }
        this.preDetail.detail[1] = this.mainList
        this.$apis
          .savePrescriptionAndJoiningGroup(this.preDetail)
          .then((res) => {
            if (!res && this.autoGroup == '0') {
              this.$message({
                message: '自动入组任务生成失败，请进行手动入组',
                type: 'error',
              })
              return
            }
            this.$message({
              message: '操作成功，共生成 ' + res + ' 条任务',
              type: 'success',
            })
            this.getPrescriptionDetail()
          })
      } catch (e) {}
    },
    onAddPlan() {
      this.$confirm('患者暂未入组该计划，是否执行入组操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$apis
          .prescriptionJoiningGroup({
            flupPlanId: this.newPlanId,
            serialNo: this.$route.query.serialNo,
          })
          .then((res) => {
            this.$message({
              message: '操作成功，共生成 ' + res + ' 条任务',
              type: 'success',
            })
            this.addPlan = false
            this.getPrescriptionDetail()
          })
      })
    },
  },
}
</script>
<style lang="scss">
.prescription_detail {
  padding: 20px;
  .prescriptionInfo {
    padding: 20px 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    > div {
      min-width: 10%;
      display: flex;
      font-size: 14px;
      line-height: 40px;
      span {
        width: 100px;
        display: block;
        text-align: right;
        margin-right: 10px;
        color: #333333;
      }
      p {
        color: #111111;
      }
    }
  }
  .bottomAddBox {
    padding: 15px;
    margin-top: 10px;
    margin-bottom: 100px;
    display: flex;
    align-items: center;
    background-color: #f8f8f8;
  }
}
</style>