<template>
  <div>
    <el-dialog
      title="健康管理计划审核"
      :visible.sync="tufa"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
      @close="handClose"
      class="planDialog"
    >
      <el-form
        :model="fuFlupPlan"
        :rules="rules"
        ref="fuFlupPlan"
        label-width="135px"
        class="demo-ruleForm"
      >
        <el-form-item label="计划名称" prop="planName">
          <el-input
            class="limiting"
            v-model.trim="fuFlupPlan.planName"
            maxlength="20"
            show-word-limit
            :disabled="isStatus"
          ></el-input>
        </el-form-item>
        <el-form-item label="执行科室" prop="executiveDeptId">
          <el-select
            v-model="fuFlupPlan.executiveDeptId"
            placeholder="请选择"
            @change="zu"
            :disabled="isStatus"
          >
            <el-option
              v-for="(item, index) in deptlist"
              :key="index"
              :label="item.deptName"
              :value="item.serialNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="随访方式" prop="fuWay">
          <el-select
            v-model="fuFlupPlan.fuWay"
            placeholder="请选择随访方式"
            @change="gz"
            :disabled="isStatus"
          >
            <el-option label="全院随访" :value="0"></el-option>
            <el-option label="专科随访" :value="1"></el-option>
            <el-option label="慢病随访" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="随访规则" prop="fuRuleId">
          <el-select :disabled="isStatus" v-model="fuFlupPlan.fuRuleId" placeholder="请选择">
            <el-option
              v-for="(item, index) in fuRulelist"
              :key="index"
              :label="item.ruleName"
              :value="item.serialNo"
            >
              <span style="float: left">{{ item.ruleName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                setPatientType(item.enrollmentConfig)
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <div class="formbox">
          <el-form-item label="计划开始时间" prop="startTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="fuFlupPlan.startTime"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              :disabled="isStatus"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="计划结束时间" prop="endTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="fuFlupPlan.endTime"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              :disabled="isStatus"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="formbox">
          <el-form-item label="随访/慢病组" prop="fuGroupId">
            <el-select
              v-model="fuFlupPlan.fuGroupId"
              placeholder="请选择"
              @change="ys"
              :disabled="isStatus"
            >
              <el-option
                v-for="(item, index) in fuGrouplist"
                :key="index"
                :label="item.groupName"
                :value="item.serialNo"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="随访/慢病人员" prop="fuDoctorId">
            <el-select v-model="fuFlupPlan.fuDoctorId" placeholder="请选择" :disabled="isStatus">
              <el-option
                v-for="(item, index) in fuDoctorlist"
                :key="index"
                :label="item.realName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- <el-form-item label="入组患者类型" prop="joinPlanPatientTypeArray">
          <el-checkbox-group v-model="fuFlupPlan.joinPlanPatientTypeArray">
            <el-checkbox
              v-for="(item, index) in FLupPlanPatientlist"
              :key="index"
              :label="item.patientTypeCode"
              @change="changePatientType"
            >{{item.patientTypeName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->

        <!-- <div v-for="(item,index) in fuFlupPlan.relationDetail" :key="index">
          <el-form-item v-if="selectRefresh" :label="getLabel(item)">
            <el-select
              style="width: 100%;display: inline-block;"
              v-model="item.relationTypeCodeList"
              multiple
              placeholder="请选择"
              @change="relationRefresh"
            >
              <div v-if="item.relationTypeKey=='base_service_package'">
                <el-option
                  v-for="jitem in PackageTypeList"
                  :key="jitem.serialNo"
                  :label="jitem.packageName"
                  :value="jitem.serialNo"
                ></el-option>
              </div>
              <div v-else>
                <el-option
                  v-for="(jitem, index) in deptlist"
                  :key="index"
                  :label="jitem.deptName"
                  :value="jitem.serialNo"
                ></el-option>
              </div>
            </el-select>
          </el-form-item>
        </div>-->

        <el-form-item label="启用状态" prop="enable">
          <el-radio-group v-model="fuFlupPlan.enable" :disabled="isStatus">
            <el-radio
              :label="1"
              :disabled="
                fuFlupPlan.endTime
                  ? time > fuFlupPlan.endTime.replace(/\-+/g, '')
                  : false
              "
              >启用</el-radio
            >
            <el-radio
              :label="0"
              :disabled="
                fuFlupPlan.endTime
                  ? time > fuFlupPlan.endTime.replace(/\-+/g, '')
                  : false
              "
              >停用</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model.trim="fuFlupPlan.remarks"
            maxlength="100"
            show-word-limit
            v-if="tufa"
            :disabled="isStatus"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <template v-if="isAuditing == 0">
          <el-button @click="handClose">取 消</el-button>
          <el-button
            type="danger"
            plain
            @click="isrefuse = true"
            style="min-width: 56px"
            >拒绝</el-button
          >
          <el-button type="success" @click="subAuditing">通过审核</el-button>
        </template>
        <template v-else-if="isAuditing == 1">
          <el-button type="success" @click="handClose">确认</el-button>
        </template>
        <template v-else>
          <el-button @click="handClose">取 消</el-button>
          <el-button :disabled="checkBtn" type="primary" @click="tj">提 交</el-button>
        </template>
      </span>
    </el-dialog>
    <el-dialog
      title="拒绝理由"
      :visible.sync="isrefuse"
      width="348px"
      :close-on-press-esc="false"
      class="refuse"
      :before-close="handleCloseRefuse">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label-width="0" prop="name" :rules="[{ required: true, message: '请输入拒绝理由', trigger: ['blur', 'change'] },]">
          <el-input class="input" v-if="isrefuse" type="textarea" :rows="2" v-model.trim="ruleForm.name" placeholder="请输入拒绝理由"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleCloseRefuse">取 消</el-button>
        <el-button type="primary" @click="subRefuse" style="min-width:60px">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm:{
        name:''
      },
      serialNo:'',
      isrefuse:false,
      isStatus: true, //true 详情 false 编辑
      isAuditing:0,//0审核 1不审核 2修改
      tufa: false,
      deptlist: [],
      fuRulelist: [],
      fuGrouplist:[],
      fuDoctorlist:[],
      checkBtn: false,
      FLupPlanPatientlist: [],
      time:null,
      bf:null,
      fuFlupPlan: {
        // dischargeAdmissionDeptRelation: [],
        // transferDeptRelation: [],
        // clinicDeptRelation: [],
        // baseServicePackageCodes: [],
        // joinPlanPatientTypelist: [],
        // joinPlanPatientTypeArray: [],
        hospitalId: null,
        planName: null,
        executiveDept: null,
        executiveDeptId: null,
        fuWay: null,
        fuRule: null,
        fuRuleId: null,
        startTime: null,
        endTime: null,
        fuGroup: null,
        fuGroupId: null,
        fuDoctor: null,
        fuDoctorId: null,
        enable: 1,
        remarks: null,
        serialNo: null,
        planType: 0,
      },
      rules: {
        // joinPlanPatientTypeArray: [
        //   {
        //     type: 'array',
        //     required: true,
        //     message: '请至少选择一个入组患者类型',
        //     trigger: 'change',
        //   },
        // ],
        planName: [
          { required: true, message: "请输入计划名称", trigger: "blur" },
        ],
        fuDoctorId: [
          { required: true, message: "请选择随访/慢病人员", trigger: "change" },
        ],
        executiveDeptId: [
          { required: true, message: "请选择执行科室", trigger: "change" },
        ],
        fuWay: [
          { required: true, message: "请选择随访方式", trigger: "change" },
        ],
        fuRuleId: [
          { required: true, message: "请选择随访规则", trigger: "change" },
        ],
        startTime: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        endTime: [
          {
            type: "string",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        fuGroupId: [{ required: true, message: "请选择组", trigger: "change" }],
        enable: [
          { required: true, message: "请选择启用状态", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    async init(serialNo, isStatus = true , isAuditing = 0) {
      this.serialNo = serialNo;
      this.isStatus = isStatus;
      this.isAuditing = isAuditing;
      this.time = this.getCurrentDate().replace(/\/+/g, '')
      this.hospitalId = JSON.parse(
        sessionStorage.getItem("global")
      ).hospital_id;
      this.fuFlupPlan.hospitalId = this.hospitalId;
      this.getDeptlist();
      await this.getInfo();
      this.zu();
      this.$nextTick(() => { 
        this.tufa = true;
      })
    },
    async getInfo(){
      let res = await this.$apis.queryFlupPlanDetail(this.serialNo);
      res.relationDetail = res.relationDetail || []
      this.fuFlupPlan = res;
      this.bf = JSON.parse(JSON.stringify(res));
    },
    gz() {
      this.fuFlupPlan.fuRuleId = null;

      this.$apis
        .systemManagequeryFlupGroupByDeptId({
          deptId: this.fuFlupPlan.executiveDeptId,
          groupType: this.fuFlupPlan.fuWay == "2" ? "1" : "0",
        })
        .then((res) => {
          this.fuGrouplist = res;
          this.fuFlupPlan.executiveDept = this.deptlist.filter(
            (x) => x.serialNo == this.fuFlupPlan.executiveDeptId
          )[0].deptName;
        });

      if (
        this.fuFlupPlan.fuWay == "0"
          ? true
          : this.fuFlupPlan.fuWay && this.fuFlupPlan.executiveDeptId
      ) {
        this.$apis
          .flupRulequeryFollowUpRuleList({
            pageNo: 1,
            pageSize: 10000,
            hospitalId: this.hospitalId,
            ruleType: this.fuFlupPlan.fuWay,
            relationDept: this.fuFlupPlan.executiveDept,
          })
          .then((res) => {
            this.fuRulelist = res.list;
          });
      }
    },
    ys() {
      this.fuFlupPlan.fuDoctorId = null
      this.fuDoctorlist = []
      // this.fuGrouplist.forEach((res) => {
      //   if (res.serialNo == this.fuFlupPlan.fuGroupId) {
      //     this.fuFlupPlan.fuGroup = res.groupName
      //   }
      // })
      if (this.bf != null) {
        this.fz(this.bf)
      }
      if (this.fuFlupPlan.fuGroupId) {
        this.$apis
          .systemManagequeryFlupGroupMembersByGroupId({
            groupId: this.fuFlupPlan.fuGroupId,
          })
          .then((res) => {
            this.fuDoctorlist = res
          })
      }
    },
    tj() {
      this.checkBtn = true
      this.$refs['fuFlupPlan'].validate((valid) => {
        if (valid) {
          if (this.fuFlupPlan.startTime > this.fuFlupPlan.endTime) {
            this.$message({
              message: '开始时间不可大于结束时间!',
              type: 'warning',
            })
            this.checkBtn = false
            return
          }
          //判断是否管理科室
          try {
            this.fuFlupPlan.relationDetail.forEach((item) => {
              if (
                !item.relationTypeCodeList ||
                item.relationTypeCodeList.length < 1
              ) {
                let patientTypeName = this.FLupPlanPatientlist.find(
                  (x) => x.patientTypeCode == item.patientTypeCode
                ).patientTypeName
                this.$message({
                  message: patientTypeName + '未选择关联！',
                  type: 'warning',
                })
                throw new Error('')
              }
            })
          } catch (e) {
            this.checkBtn = false
            return
          }
          this.gxName()

          this.$apis
            .flupPlansaveFollowPlanNew(this.fuFlupPlan)
            .then((res) => {
              if (res) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                })
                // this.tufa = false
                // this.getflupPlanqueryCurrentUserFlupPlanlist()
                this.handClose();
                this.$emit('refurbish');
              }
              setTimeout(() => {
                this.checkBtn = false
              }, 2000)
            })
            .catch((e) => {
              setTimeout(() => {
                this.checkBtn = false
              }, 2000)
            })
        } else {
          this.checkBtn = false
          return false
        }
      })
    },
    zu() {
      this.fuFlupPlan.fuGroupId = null
      // this.deptlist.forEach((res) => {
      //   if (res.serialNo == this.fuFlupPlan.executiveDeptId) {
      //     this.fuFlupPlan.executiveDept = res.deptName
      //   }
      // })
      this.$apis
        .systemManagequeryFlupGroupByDeptId({
          deptId: this.fuFlupPlan.executiveDeptId,
          groupType: this.fuFlupPlan.fuWay,
        })
        .then((res) => {
          this.fuGrouplist = res
          this.fuFlupPlan.executiveDept = this.deptlist.filter(
            (x) => x.serialNo == this.fuFlupPlan.executiveDeptId
          )[0].deptName

          this.gz()
          this.ys()
        })
    },
    fz(row) {
      this.fuFlupPlan.planName = row.planName
      this.fuFlupPlan.executiveDeptId = row.executiveDeptId
      this.fuFlupPlan.executiveDept = row.executiveDept
      this.fuFlupPlan.fuWay = row.fuWay
      this.fuFlupPlan.fuRuleId = row.fuRuleId
      this.fuFlupPlan.fuRule = row.fuRule
      this.fuFlupPlan.startTime = row.startTime
      this.fuFlupPlan.endTime = row.endTime
      this.fuFlupPlan.fuGroupId = row.fuGroupId
      this.fuFlupPlan.fuGroup = row.fuGroup
      this.fuFlupPlan.fuDoctorId = row.fuDoctorId
      this.fuFlupPlan.fuDoctor = row.fuDoctor
      this.fuFlupPlan.enable = row.enable
      this.fuFlupPlan.remarks = row.remarks
      this.fuFlupPlan.serialNo = row.serialNo
      this.bf = null
    },
    gxName() {
      this.fuDoctorlist.forEach((res) => {
        if (res.userId == this.fuFlupPlan.fuDoctorId) {
          this.fuFlupPlan.fuDoctor = res.realName
        }
      })
      this.fuRulelist.forEach((res) => {
        if (res.serialNo == this.fuFlupPlan.fuRuleId) {
          this.fuFlupPlan.fuRule = res.ruleName
        }
      })
      this.fuGrouplist.forEach((res) => {
        if (res.serialNo == this.fuFlupPlan.fuGroupId) {
          this.fuFlupPlan.fuGroup = res.groupName
        }
      })
      this.deptlist.forEach((res) => {
        if (res.serialNo == this.fuFlupPlan.executiveDeptId) {
          this.fuFlupPlan.executiveDept = res.deptName
        }
      })
    },
    getflupPlanqueryCurrentUserFlupPlanlist() {
      this.$apis
        .flupPlanqueryCurrentUserFlupPlanListNew({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
          planType: this.planType,
          enable: this.enable,
          keyWord: this.keyWord,
          deptId: this.deptId,
          isExpire: 1,
        })
        .then((res) => {
          this.total = res.total
          this.tableData = res.list
        })
    },
    getCurrentDate() {
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year, month, day].join('/')
    },
    setPatientType(enrollmentConfig) {
      if (enrollmentConfig) {
        let patientType = JSON.parse(enrollmentConfig).patientType
        let patient = this.FLupPlanPatientlist.find(
          (element) => element.patientTypeCode == patientType
        )
        return patient ? patient.patientTypeName : ''
      } else {
        return ''
      }
    },
    async getDeptlist() {
      let res = await this.$apis.systemManagequeryCurrentUserDept({
        hospitalId: this.$global.hospital_id,
      });
      this.deptlist = res;
    },
    handClose(){
      this.fuFlupPlan = this.$options.data().fuFlupPlan;
      this.deptlist = []
      this.fuRulelist = []
      this.fuGrouplist = []
      this.fuDoctorlist = []
      this.checkBtn = false
      this.FLupPlanPatientlist = []
      this.time = null
      this.bf = null
      this.ruleForm.name = "";
      setTimeout(() => {
        this.$refs.fuFlupPlan.clearValidate();
        this.tufa = false;
      }, 50);
    },
    handleCloseRefuse(){
      this.ruleForm.name = "";
      setTimeout(() => {
        this.$refs.ruleForm.clearValidate();
        this.isrefuse = false;
      }, 50);
    },
    //拒绝
    subRefuse(){
      this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            await this.$apis.authApply({
              authState:2,
              remark:this.ruleForm.name,
              serialNo:this.serialNo,
              type:1,
            })
            this.handleCloseRefuse();
            this.handClose();
            this.$emit('refurbish');
          }
        });
    },
    //审核通过
    subAuditing(){
      this.$confirm('确定要通过审核吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async() => {
          await this.$apis.authApply({
            authState:1,
            serialNo:this.serialNo,
            type:1,
          })
          this.handClose();
          this.$emit('refurbish');
        }).catch(() => {       
        });
    }
  },
};
</script>
<style lang="scss" scoped>
.planDialog{
    .formbox {
      &>div{
        flex: 1;
      }
      display: flex;
    }
}
</style>
<style lang="scss">
.planDialog {
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border: 1px solid #d7dae0;
    color: #111;
  }
  .el-textarea.is-disabled .el-textarea__inner{
    background-color: #fff;
    border: 1px solid #d7dae0;
    color: #111;
  }
}
</style>