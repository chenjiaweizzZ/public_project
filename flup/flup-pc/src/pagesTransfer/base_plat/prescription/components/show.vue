<template>
  <el-dialog
    :title="showTitle"
    :visible.sync="dialogVisible"
    @close="$emit('update:show', false)"
    class="showPreDialog"
    width="50%"
    max-width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <div v-if="editable" class="head">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="姓名" prop="patientName">
              <el-input class="width150" :maxlength="15" v-model="form.patientName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-select class="width100" v-model="form.sex">
                <el-option
                  v-for="item in sexList"
                  :key="item.dict_name"
                  :label="item.dict_name"
                  :value="item.dict_name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄" prop="age">
              <el-input class="width100" v-model="form.age" :maxlength="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="病人ID" prop="userId">
              <el-input class="width100" :maxlength="15" v-model="form.userId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="科室" prop="deptCode">
              <el-select
                v-model="form.deptCode"
                value-key="Value"
                placeholder="科室"
                @change="changeDept"
              >
                <el-option
                  v-for="item in $parent.deptOptions"
                  :key="item.serialNo"
                  :value="item.serialNo"
                  :label="item.deptName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item label="诊断" prop="diagnosis">
              <el-input
                type="textarea"
                v-model="form.diagnosis"
                show-word-limit
                :maxlength="150"
                placeholder="临床诊断"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="ck" v-else>
        <div>
          <p>姓名</p>
          {{ form.patientName }}
        </div>
        <div>
          <p>性别</p>
          {{ form.sex }}
        </div>
        <div>
          <p>年龄</p>
          {{ form.age }}
        </div>
        <div>
          <p>病人ID</p>
          {{ form.userId }}
        </div>
        <div>
          <p>科室</p>
          {{ form.deptName }}
        </div>
        <div>
          <p>诊断</p>
          {{ form.diagnosis }}
        </div>
      </div>
      <el-tabs
        style="margin-top: 20px"
        v-model="editableTabsValue"
        type="border-card"
        @tab-remove="removeTab"
        @tab-click="addTab"
        :before-leave="beforeleave"
      >
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="index"
          :label="item.title"
          :name="item.name"
          :closable="item.closable"
        ></el-tab-pane>
        <el-tab-pane v-if="editable" :key="-1" :name="'-1'">
          <span slot="label">
            <i class="el-icon-plus"></i>
          </span>
        </el-tab-pane>
      </el-tabs>
      <template v-if="editableTabs && editableTabs.length > 0">
        <normal
          ref="normal"
          :normalData="normalData"
          :editable="editable"
          :originalPre="originalPre"
          v-if="showNormal"
        ></normal>
      </template>
    </el-form>
    <div class="bottomAddBox" v-if="!editable">
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
    <span slot="footer" class="dialog-footer">
      <div v-if="editable">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">提 交</el-button>
      </div>
      <div v-else>
        <div v-if="addPlan">
          <el-button @click="addPlan = false">取消</el-button>
          <el-button type="primary" @click="onAddPlan">确定</el-button>
        </div>
      </div>
      <!-- <div v-else style="float: left">
        已入组计划:{{ groupPlan }}
        <div v-if="addPlan">
          <el-select v-model="newPlanId">
            <el-option
              v-for="item in planList"
              :key="item.serialNo"
              :label="item.planName"
              :value="item.serialNo"
            ></el-option>
          </el-select>
          <el-button @click="addPlan = false">取消</el-button>
          <el-button type="primary" @click="onAddPlan">确定</el-button>
        </div>
        <i
          v-else-if="!addPlan && planList.length > 0"
          style="color: gray"
          class="el-icon-circle-plus-outline"
          @click="addPlan = true"
        ></i>
      </div>-->
    </span>
  </el-dialog>
</template>

<script>
import normal from './normal'
export default {
  props: {
    data: Object,
    show: Boolean,
    editable: Boolean,
    showTitle: String,
  },
  components: { normal },
  async created() {
    await this.$apis
      .BaseDictGetDictItems({
        parentId: '201707131413454942d2',
      })
      .then((res) => {
        this.sexList = res
      })

    await this.$apis
      .queryPatientFlupPlanList({
        hospitalId: this.$global.hospital_id,
        pageNo: 1,
        pageSize: 100,
      })
      .then((res) => {
        this.planList = res.list
      })
    if (this.data) {
      this.form = { ...this.data }
      this.form.hospitalId = this.$global.hospital_id
      if (this.editable) {
        this.editableTabs.push({
          key: 0,
          name: '0',
          title: '原始处方',
          closable: false,
        })
        this.form.detailList = { 0: [] }
        this.addTab({ name: -1 })
      } else {
        this.$apis
          .getPrescriptionDetail({ serialNo: this.form.serialNo })
          .then((res) => {
            if (res.detailList) {
              this.editableTabs.push({
                key: 0,
                name: '0',
                title: '原始处方',
                closable: false,
              })
            }
            for (var i = 0; i < parseInt(res.detailTotal); i++) {
              this.editableTabs.push({
                key: i + 1,
                name: i + 1 + '',
                title: '处方任务' + (i + 1),
                closable: false,
              })
            }
            this.editableTabsValue = res.detailList
              ? '0'
              : this.detailTotal == 0
              ? '-1'
              : '1'
            if (!this.editable) {
              if (this.editableTabsValue == '0') {
                this.normalData = res.detailList
                this.originalPre = true
              } else if (this.editableTabsValue != '-1') {
                this.normalData = res.detail['1']
                this.originalPre = false
              }
            }
            if (res.groupPlanId) {
              res.groupPlanId.forEach((element) => {
                var index = this.planList.findIndex(
                  (x) => x.serialNo == element
                )
                if (index > -1) {
                  this.groupPlan += this.planList[index].planName + '; '
                  this.planList.splice(index, 1)
                }
              })
            }

            if (this.planList.length > 0) {
              this.newPlanId = this.planList[0].serialNo
            }
            this.form = res
          })
      }
    }
  },
  watch: {
    show() {
      this.dialogVisible = this.show
    },
  },
  data() {
    return {
      form: {},
      dialogVisible: true,
      rules: {
        patientName: [
          { required: true, message: '请输入患者姓名', trigger: 'blur' },
        ],
        sex: [{ required: true, message: '请输入患者性别', trigger: 'blur' }],
        age: [{ required: true, message: '请输入患者年龄', trigger: 'blur' }],
        userId: [{ required: true, message: '请输入患者ID', trigger: 'blur' }],
        deptCode: [{ required: true, message: '请选择科室', trigger: 'blur' }],
      },

      editableTabsValue: '',
      editableTabs: [],
      normalData: [],
      sexList: [],
      planList: [],
      showNormal: true,
      //是否为原始处方
      originalPre: true,
      tabIndex: '0',
      groupPlan: '',
      addPlan: false,
      newPlanId: '',
    }
  },
  methods: {
    addTab(targetName) {
      if (this.canConfirm()) {
        this.originalPre = false

        if (targetName.name == '-1') {
          var tablsit = this.editableTabs.map((x) => x.name)
          var tabMax = Math.max(...tablsit)
          let newTabName = tabMax + 1 + ''
          this.editableTabs.push({
            key: newTabName,
            title: '处方任务' + newTabName,
            name: newTabName,
            closable: true,
          })

          this.form.detailList[newTabName] = []
          this.normalData = this.form.detailList[newTabName]
          this.$nextTick(() => {
            this.$refs.normal.onAdd()
          })

          this.editableTabsValue = newTabName
          this.tabIndex = newTabName
        } else {
          this.showNormal = false
          if (this.editable) {
            if (targetName.name == '0') {
              this.originalPre = true
            }
            this.normalData = this.form.detailList[targetName.name]
          } else {
            if (targetName.name == '0') {
              this.originalPre = true
              this.normalData = this.form.detailList
            } else {
              this.normalData = Array.from(this.form.detail[targetName.name])
            }
          }
          this.showNormal = true
          this.tabIndex = targetName.name
        }
      }
    },
    removeTab(targetName) {
      this.$nextTick(() => {
        this.$refs.normal.onCancel()
      })
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      tabs.forEach((tab, index) => {
        if (index >= parseInt(targetName)) {
          let nextTab = tabs[index + 1]
          if (!nextTab) {
            this.editableTabs = tabs.filter((tab) => tab.name !== index + '')
            this.form.detailList[index] = []
            this.editableTabsValue = '0'
          } else {
            this.form.detailList[index] = this.form.detailList[index + 1]
          }
        }
      })
    },
    canConfirm() {
      if (this.$refs.normal) {
        if (this.$refs.normal.editSattus !== 'none') {
          this.$message({
            type: 'warning',
            message: '请保存后再编辑!',
          })
          return false
        }
      }
      return true
    },
    beforeleave(activeName, oldActiveName) {
      if (!this.canConfirm()) {
        return false
      }
    },
    onConfirm() {
      if (this.canConfirm()) {
        this.$refs['form'].validate((valid) => {
          let detailList = []
          let sendForm = { ...this.form }
          if (valid) {
            this.$confirm(
              '保存成功后，本条数据内容不允许修改请确认是否完成创建？',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              }
            ).then(() => {
              this.editableTabs.forEach((element) => {
                sendForm.detailList[element.name].forEach((element1) => {
                  element1.prescriptionType = element.name
                  element1.firstSendTime = element1.firstSendTime
                    ? element1.firstSendTime + ' 00:00:00'
                    : this.$utils.formatDate(new Date()) + ' 00:00:00'
                  detailList.push(element1)
                })
              })
              sendForm.detailList = detailList
              this.$apis.savePrescription(sendForm).then((res) => {
                if (res.retCode == 0) {
                  this.$message({
                    message: '新增成功',
                    type: 'success',
                  })
                  this.show = false
                } else {
                  this.$alert(res.retInfo, '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                  }).then(() => {
                    this.show = false
                  })
                }
                this.$emit('getMainList')
              })
            })
          }
        })
      }
    },
    changeDept() {
      this.form.deptName = this.$parent.deptOptions.filter(
        (x) => x.serialNo == this.form.deptCode
      )[0].deptName
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
            serialNo: this.form.serialNo,
          })
          .then((res) => {
            this.$message({
              message: '操作成功，共生成 ' + res + ' 条任务',
              type: 'success',
            })
            this.show = false
            this.$emit('getMainList')
          })
      })
    },
  },
}
</script>
<style lang="scss">
.showPreDialog {
  .head {
    border-bottom: 1px solid #d7dae0;
  }
  .ck {
    padding-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border-bottom: 1px solid #d7dae0;
    > div {
      min-width: 33%;
      display: flex;
      align-items: center;
      p {
        width: 50px;
        margin-right: 10px;
        text-align: right;
        line-height: 30px;
      }
    }
  }
  .bottomAddBox {
    padding: 15px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    background-color: #f8f8f8;
  }
}
</style>