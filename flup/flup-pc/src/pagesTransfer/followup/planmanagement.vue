//计划管理
<template>
  <div class="container">
    <div class="queryConditionsBox">
      <el-form class="inquirebox" label-width="80px">
        <el-form-item label="启用状态">
          <el-select
            v-model="enable"
            placeholder="请选择启用状态"
            clearable
            @change="cx"
          >
            <el-option label="启用" value="1"></el-option>
            <el-option label="不启用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="规则来源科室">
          <el-select v-model="deptId" placeholder="请选择" @change="cx" clearable filterable>
            <el-option
              v-for="(item, index) in deptlist"
              :key="index"
              :label="item.deptName"
              :value="item.serialNo"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="状态" v-if="componentValue == 1">
          <el-select
            v-model="authState"
            placeholder="请选择"
            @change="cx"
            clearable
          >
            <el-option label="待审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核未通过" value="2"></el-option>
            <el-option label="已撤回" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input
            placeholder="请输入名称查询"
            v-model="keyWord"
            class="input-with-select limiting"
            maxlength="20"
            show-word-limit
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="cx"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-button style="margin-left: 15px" type="primary" plain @click="xz"
          >新增</el-button
        >
      </el-form>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-bottom: 60px;"
      stripe
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="planName" label="计划名称"></el-table-column>
      <el-table-column prop="fuRule" label="随访/慢病规则"></el-table-column>
      <el-table-column
        prop="executiveDept"
        label="规则来源科室"
      ></el-table-column>
      <el-table-column prop="startTime" label="计划开始时间"></el-table-column>
      <el-table-column prop="endTime" label="计划结束时间"></el-table-column>
      <el-table-column prop="fuGroup" label="随访/慢病组"></el-table-column>
      <el-table-column prop="fuDoctor" label="随访/慢病人员"></el-table-column>
      <el-table-column label="启用">
        <template slot-scope="scope">
          <el-switch
            :disabled="time > scope.row.endTime.replace(/\-+/g, '')"
            @change="switchx(scope.row)"
            v-model="scope.row.enable"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否展示">
        <template slot-scope="scope">
          <el-switch
            @change="switchy(scope.row)"
            v-model="scope.row.isShow"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="authState"
        width="130"
        label="状态"
        v-if="componentValue == 1"
      >
        <template slot-scope="{ row }">
          <span v-if="row.authState == 0">待审核</span>
          <span v-else-if="row.authState == 1">审核通过</span>
          <span v-else-if="row.authState == 2">审核不通过</span>
          <span v-else>已撤回</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="xg(scope.row)"
            >修改</el-button
          >
          <el-button type="text" size="small" @click="deletex(scope.row)"
            >删除</el-button
          >
          <el-button type="text" size="small" @click="ruleSetting(scope.row)"
            >获取规则设置</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>

    <el-dialog
      :title="title"
      :visible.sync="tufa"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-esc="false"
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
          ></el-input>
        </el-form-item>
        <el-form-item label="规则来源科室" prop="executiveDeptId">
          <el-select
            v-model="fuFlupPlan.executiveDeptId"
            placeholder="请选择"
            @change="zu(true)"
            filterable
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
            @change="gz(false)"
          >
            <el-option label="全院随访" :value="0"></el-option>
            <el-option label="专科随访" :value="1"></el-option>
            <el-option label="慢病随访" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="随访规则" prop="fuRuleId">
          <el-select v-model="fuFlupPlan.fuRuleId" placeholder="请选择">
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
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="计划结束时间" prop="endTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="fuFlupPlan.endTime"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="formbox">
          <el-form-item label="随访/慢病组" prop="fuGroupId">
            <el-select
              v-model="fuFlupPlan.fuGroupId"
              placeholder="请选择"
              @change="ys"
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
            <el-select v-model="fuFlupPlan.fuDoctorId" placeholder="请选择">
              <el-option
                v-for="(item, index) in fuDoctorlist"
                :key="index"
                :label="item.realName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="启用状态" prop="enable">
          <el-radio-group v-model="fuFlupPlan.enable">
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
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tufa = false">取 消</el-button>
        <el-button :disabled="checkBtn" type="primary" @click="tj">{{
          componentValue == 0 ? "提 交" : "提交审核"
        }}</el-button>
      </span>
    </el-dialog>
    <RuleSetting
      v-if="dialogVisible"
      :data="data"
      :planId="data.serialNo"
      :show.sync="dialogVisible"
    ></RuleSetting>
  </div>
</template>

<script>
import RuleSetting from "./group_list/ruleSetting";
export default {
  components: { RuleSetting },
  data() {
    return {
      authState: "",
      fuRulelist: [],
      tufa: false,
      title: null,
      deptlist: [],
      hospitalId: null,
      planType: null,
      enable: null,
      keyWord: null,
      deptId: null,
      tableData: [],
      total: null,
      pageNo: 1,
      pageSize: 10,
      fuGrouplist: [],
      fuDoctorlist: [],
      fuFlupPlan: {
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
        planType: 0
      },
      time: null,
      bf: null,
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
          { required: true, message: "请输入计划名称", trigger: "blur" }
        ],
        fuDoctorId: [
          { required: true, message: "请选择随访/慢病人员", trigger: "change" }
        ],
        executiveDeptId: [
          { required: true, message: "请选择规则来源科室", trigger: "change" }
        ],
        fuWay: [
          { required: true, message: "请选择随访方式", trigger: "change" }
        ],
        fuRuleId: [
          { required: true, message: "请选择随访规则", trigger: "change" }
        ],
        startTime: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        endTime: [
          {
            type: "string",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        fuGroupId: [{ required: true, message: "请选择组", trigger: "change" }],
        enable: [
          { required: true, message: "请选择启用状态", trigger: "change" }
        ]
      },
      FLupPlanPatientlist: [],
      // PackageTypeList: [],
      baseServicePackageCodes: [],
      data: null,
      dialogVisible: false,
      selectedType: [],
      selectRefresh: true,
      checkBtn: false,
      componentValue: 0 //0 不需要审核 1 需要审核
    };
  },
  async created() {
    let res = await this.$apis.queryFlupConfigOne({
      hospitalId: this.$global.hospital_id,
      moduleCode: "followUpSetting",
      componentKey: "flupPlanCreateAuth"
    });
    if (res) {
      this.componentValue = res.componentValue;
    }
  },
  watch: {},
  mounted() {
    this.time = this.getCurrentDate().replace(/\/+/g, "");
    this.hospitalId = JSON.parse(sessionStorage.getItem("global")).hospital_id;
    this.fuFlupPlan.hospitalId = this.hospitalId;
    this.$apis
      .systemManagequeryCurrentUserDept({
        hospitalId: this.$global.hospital_id
      })
      .then(res => {
        this.deptlist = res;
      });

    //患者类型接口更新
    this.$apis.queryPatientTypeAll().then(res => {
      this.FLupPlanPatientlist = res.filter(x => x.enabled);
    });
    this.getflupPlanqueryCurrentUserFlupPlanlist();
  },
  methods: {
    setPatientType(enrollmentConfig) {
      if (enrollmentConfig) {
        let patientType = JSON.parse(enrollmentConfig).patientType;
        let patient = this.FLupPlanPatientlist.find(
          element => element.patientTypeCode == patientType
        );
        return patient ? patient.patientTypeName : "";
      } else {
        return "";
      }
    },

    gxName() {
      this.fuDoctorlist.forEach(res => {
        if (res.userId == this.fuFlupPlan.fuDoctorId) {
          this.fuFlupPlan.fuDoctor = res.realName;
        }
      });
      this.fuRulelist.forEach(res => {
        if (res.serialNo == this.fuFlupPlan.fuRuleId) {
          this.fuFlupPlan.fuRule = res.ruleName;
        }
      });
      this.fuGrouplist.forEach(res => {
        if (res.serialNo == this.fuFlupPlan.fuGroupId) {
          this.fuFlupPlan.fuGroup = res.groupName;
        }
      });
      this.deptlist.forEach(res => {
        if (res.serialNo == this.fuFlupPlan.executiveDeptId) {
          this.fuFlupPlan.executiveDept = res.deptName;
        }
      });
    },
    getCurrentDate() {
      var d = new Date(),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("/");
    },
    switchx(row) {
      this.$apis.flupPlansaveFollowPlan(row).then(res => {
        if (res) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getflupPlanqueryCurrentUserFlupPlanlist();
        }
      });
    },
    switchy(row) {
      this.$apis.flupPlansaveFollowPlan(row).then(res => {
        if (res) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getflupPlanqueryCurrentUserFlupPlanlist();
        }
      });
    },
    tj() {
      this.checkBtn = true;
      this.$refs["fuFlupPlan"].validate(valid => {
        if (valid) {
          if (this.fuFlupPlan.startTime > this.fuFlupPlan.endTime) {
            this.$message({
              message: "开始时间不可大于结束时间!",
              type: "warning"
            });
            this.checkBtn = false;
            return;
          }
          //判断是否管理科室
          try {
            this.fuFlupPlan.relationDetail.forEach(item => {
              if (
                !item.relationTypeCodeList ||
                item.relationTypeCodeList.length < 1
              ) {
                let patientTypeName = this.FLupPlanPatientlist.find(
                  x => x.patientTypeCode == item.patientTypeCode
                ).patientTypeName;
                this.$message({
                  message: patientTypeName + "未选择关联！",
                  type: "warning"
                });
                throw new Error("");
              }
            });
          } catch (e) {
            this.checkBtn = false;
            return;
          }
          this.gxName();

          this.$apis
            .flupPlansaveFollowPlanNew(this.fuFlupPlan)
            .then(res => {
              if (res) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.tufa = false;
                this.getflupPlanqueryCurrentUserFlupPlanlist();
              }
              setTimeout(() => {
                this.checkBtn = false;
              }, 2000);
            })
            .catch(e => {
              setTimeout(() => {
                this.checkBtn = false;
              }, 2000);
            });
        } else {
          this.checkBtn = false;
          return false;
        }
      });
    },
    gz() {
      this.fuFlupPlan.fuGroupId = "";
      this.fuFlupPlan.fuGroup = "";
      this.fuFlupPlan.fuDoctorId = "";
      this.fuFlupPlan.fuDoctor = "";
      this.fuDoctorlist = [];
      this.fuFlupPlan.fuRuleId = "";
      this.zu();
      this.$apis
        .queryFlupGroupByGroupType({
          groupType: this.fuFlupPlan.fuWay == "2" ? "1" : "0"
        })
        .then(res => {
          this.fuGrouplist = res;
          // if (this.fuFlupPlan.fuGroupId) {
          //   this.fuGrouplist = [
          //     {
          //       groupName: this.fuFlupPlan.fuGroup,
          //       serialNo: this.fuFlupPlan.fuGroupId
          //     }
          //   ];
          // } else {
          //   this.fuGrouplist = res;
          // }
          this.fuFlupPlan.executiveDept = this.deptlist.filter(
            x => x.serialNo == this.fuFlupPlan.executiveDeptId
          )[0].deptName;
        });
    },
    ys() {
      this.fuFlupPlan.fuDoctorId = null;
      this.fuDoctorlist = [];
      // if (this.bf != null) {
      //   this.fz(this.bf);
      // }
      if (this.fuFlupPlan.fuGroupId) {
        this.$apis
          .systemManagequeryFlupGroupMembersByGroupId({
            groupId: this.fuFlupPlan.fuGroupId
          })
          .then(res => {
            this.fuDoctorlist = res;
          });
      }
    },
    fz(row) {
      this.fuFlupPlan.planName = row.planName;
      this.fuFlupPlan.executiveDeptId = row.executiveDeptId;
      this.fuFlupPlan.executiveDept = row.executiveDept;
      this.fuFlupPlan.fuWay = row.fuWay;
      this.fuFlupPlan.fuRuleId = row.fuRuleId;
      this.fuFlupPlan.fuRule = row.fuRule;
      this.fuFlupPlan.startTime = row.startTime;
      this.fuFlupPlan.endTime = row.endTime;
      this.fuFlupPlan.fuGroupId = row.fuGroupId;
      this.fuFlupPlan.fuGroup = row.fuGroup;
      this.fuFlupPlan.fuDoctorId = row.fuDoctorId;
      this.fuFlupPlan.fuDoctor = row.fuDoctor;
      this.fuFlupPlan.enable = row.enable;
      this.fuFlupPlan.remarks = row.remarks;
      this.fuFlupPlan.serialNo = row.serialNo;
      this.bf = null;
    },
    zu(bol) {
      if (
        (this.fuFlupPlan.fuWay == 0 || this.fuFlupPlan.fuWay) &&
        this.fuFlupPlan.executiveDeptId
      ) {
        bol ? (this.fuFlupPlan.fuRuleId = "") : "";
        this.fuFlupPlan.executiveDept = this.deptlist.filter(
          x => x.serialNo == this.fuFlupPlan.executiveDeptId
        )[0].deptName;

        this.$apis
          .flupRulequeryFollowUpRuleList({
            pageNo: 1,
            pageSize: 10000,
            hospitalId: this.hospitalId,
            ruleType: this.fuFlupPlan.fuWay,
            relationDept: this.fuFlupPlan.executiveDept
          })
          .then(res => {
            this.fuRulelist = res.list;
          });
      }
    },
    xz() {
      this.title = "新增计划";
      if (this.$refs["fuFlupPlan"]) {
        this.$refs["fuFlupPlan"].resetFields();
      }
      this.fuFlupPlan.serialNo = null;
      this.fuFlupPlan.fuDoctor = null;
      this.fuFlupPlan.executiveDept = null;
      this.fuFlupPlan.fuRule = null;
      this.fuFlupPlan.fuGroup = null;
      this.fuFlupPlan.planName = null;
      this.fuFlupPlan.executiveDeptId = null;
      this.fuFlupPlan.fuWay = null;
      this.fuFlupPlan.fuRuleId = null;
      this.fuFlupPlan.startTime = null;
      this.fuFlupPlan.endTime = null;
      this.fuFlupPlan.fuGroupId = null;
      this.fuFlupPlan.fuDoctorId = null;
      this.fuFlupPlan.enable = 1;
      this.fuFlupPlan.remarks = null;
      this.fuRulelist = [];
      this.fuGrouplist = [];
      this.fuDoctorlist = [];
      this.fuFlupPlan.relationDetail = [];
      this.zu();
      this.tufa = true;
    },
    xg(row) {
      this.title = "修改计划";
      this.bf = JSON.parse(JSON.stringify(row));

      this.tufa = true;
      if (this.$refs["fuFlupPlan"]) {
        this.$refs["fuFlupPlan"].resetFields();
      }
      this.fuFlupPlan.planName = row.planName;
      this.fuFlupPlan.executiveDeptId = row.executiveDeptId;
      this.fuFlupPlan.executiveDept = row.executiveDept;
      this.fuFlupPlan.fuWay = row.fuWay;
      this.fuFlupPlan.fuRuleId = row.fuRuleId;
      this.fuFlupPlan.fuRule = row.fuRule;
      this.fuFlupPlan.startTime = row.startTime;
      this.fuFlupPlan.endTime = row.endTime;
      this.fuFlupPlan.fuGroupId = row.fuGroupId;
      this.fuFlupPlan.fuGroup = row.fuGroup;
      this.fuFlupPlan.fuDoctorId = row.fuDoctorId;
      this.fuFlupPlan.fuDoctor = row.fuDoctor;
      this.fuFlupPlan.enable = row.enable;
      this.fuFlupPlan.remarks = row.remarks;
      this.fuFlupPlan.serialNo = row.serialNo;
      this.fuFlupPlan.relationDetail = row.relationDetail
        ? row.relationDetail
        : [];
      this.zu();
      this.$apis
        .queryFlupGroupByGroupType({
          groupType: this.fuFlupPlan.fuWay == "2" ? "1" : "0"
        })
        .then(res => {
          this.fuGrouplist = res;
          this.fuFlupPlan.executiveDept = this.deptlist.filter(
            x => x.serialNo == this.fuFlupPlan.executiveDeptId
          )[0].deptName;
        });
      this.$apis
        .systemManagequeryFlupGroupMembersByGroupId({
          groupId: this.fuFlupPlan.fuGroupId
        })
        .then(res => {
          let bol = res.some(item => {
            return item.userId == this.fuFlupPlan.fuDoctorId;
          });
          this.fuDoctorlist = !bol
            ? [
                ...res,
                {
                  realName: this.fuFlupPlan.fuDoctor,
                  userId: this.fuFlupPlan.fuDoctorId
                }
              ]
            : res;
        });
      this.relationRefresh();
    },
    deletex(row) {
      this.$confirm("此操作将永久删除该计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$apis.flupPlandeleteFollowPlanById(row.serialNo).then(res => {
            if (res) {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              if (this.tableData.length == 1 && this.pageNo > 1) {
                this.pageNo = this.pageNo - 1;
              }
              this.getflupPlanqueryCurrentUserFlupPlanlist();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    cx() {
      this.pageNo = 1;
      this.getflupPlanqueryCurrentUserFlupPlanlist();
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
          authState: this.authState
        })
        .then(res => {
          this.total = res.total;
          this.tableData = res.list;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getflupPlanqueryCurrentUserFlupPlanlist();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getflupPlanqueryCurrentUserFlupPlanlist();
    },
    ruleSetting(row) {
      this.data = row;
      this.dialogVisible = true;
    },
    getLabel(item) {
      return (
        this.FLupPlanPatientlist.find(
          x => x.patientTypeCode == item.patientTypeCode
        ).patientTypeName + "关联"
      );
    },
    relationRefresh() {
      this.selectRefresh = false;
      this.selectRefresh = true;
    }
  }
};
</script>

<style style lang="scss" scoped>
.container {
  .indicatorbox {
    border-top: 1px solid #d7dae0;
  }
}
.formbox {
  display: flex;
}
</style>
