//新增患者
<template>
  <section class="patient-list-new">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>患者类型</p>
        <el-select
          class="margin-left14 width200px"
          v-model="search.patientTypeCode"
          placeholder="患者类型"
          @change="onSearch"
        >
          <el-option
            v-for="item in patientTypeList"
            :key="item.patientTypeCode"
            :value="item.patientTypeCode"
            :label="item.patientTypeName"
          ></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <div class="flex">
          <el-select
            class="margin-left10 width110px select-time-key"
            v-model="search.searchTimeKey"
          >
            <el-option
              v-for="item in getTimeKeyList(search.patientTypeCode)"
              :key="item.label"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
          <el-date-picker
            class="select-time-val"
            type="daterange"
            v-model="search.searchTimeVal"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            clearable
          ></el-date-picker>
        </div>
      </div>
      <div class="queryConditions">
        <el-input
          class="margin-left10 width180px"
          v-model="search.searchVal"
          clearable
          maxlength="20"
          show-word-limit
        >
          <el-select
            class="width120px"
            v-model="search.searchKey"
            slot="prepend"
          >
            <el-option
              v-for="item in searchKeyList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-input>
      </div>
      <div class="queryConditions">
        <p v-if="search.patientTypeCode == patientModel.transfer">转院科室</p>
        <p v-else-if="search.patientTypeCode != patientModel.sign">科室</p>
        <el-select
          clearable
          filterable
          v-if="search.patientTypeCode !== patientModel.sign"
          class="margin-left14 width200px"
          v-model="search.deptwardId"
          placeholder="请选择"
          @change="onSearch"
        >
          <el-option
            v-for="item in deptlist"
            :key="item.serialNo"
            :value="item.serialNo"
            :label="item.deptName"
          ></el-option>
        </el-select>
        <div v-else class="queryConditions">
          <p>签约服务内容</p>
          <el-select
            class="width200px"
            v-model="search.packageCode"
            placeholder="请选择"
            clearable
            @change="onSearch"
          >
            <el-option
              v-for="item in packageList"
              :key="item.serialNo"
              :value="item.serialNo"
              :label="item.packageName"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="butBox">
        <el-checkbox class="margin-left10" v-model="isGroup" @change="onSearch"
          >只查看未入组</el-checkbox
        >
        <el-button class="margin-left30" @click="onSearch" plain
          >查询</el-button
        >
        <el-button
          class="margin-left30"
          type="primary"
          @click="choice"
          :disabled="choicefatu"
          >{{ choicetext }}</el-button
        >
      </div>
    </div>
    <el-table
      style="margin-bottom:60px"
      class="margin-top20"
      :data="mainList"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        width="50"
        type="index"
        label="序号"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in baseColumnsV2"
        :key="index"
        show-overflow-tooltip
        :prop="item.fieldName"
        :label="item.displayName"
      >
        <template slot-scope="scope">{{
          scope.row[item.fieldName] | hideInfo(item.fieldName)
        }}</template>
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
    <el-dialog title="提示" :visible.sync="dialogVisibleV2" width="30%" :before-close="disClose">
      <span>请为患者分配随访/慢病人员<span v-if="needStartDate">和任务开始时间</span></span>
      <p>患者:{{ patientNamelist }}</p>
      <div class="margin-top10">
        <span style="display: inline-block; width: 120px">执行科室:</span>
        <el-select v-model="executiveDept" placeholder="请选择" disabled>
          <el-option
            v-for="(item, index) in deptlist"
            :key="index"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
      </div>
      <div class="margin-top10">
        <span style="display: inline-block; width: 120px">随访/慢病组:</span>
        <el-select v-model="fuGroupId" placeholder="请选择" disabled>
          <el-option
            v-for="(item, index) in fuGrouplist"
            :key="index"
            :label="item.groupName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
      </div>
      <div class="margin-top10">
        <span style="display: inline-block; width: 120px">随访/慢病人员:</span>
        <el-select v-model="fuDoctorId" placeholder="请选择">
          <el-option
            v-for="(item, index) in fuDoctorlist"
            :key="index"
            :label="item.realName"
            :value="item.userId"
          ></el-option>
        </el-select>
      </div>
      <div class="margin-top10 start-time" v-if="needStartDate">
          <span style="display: inline-block; width: 120px"><span style="color: #f56c6c">*</span>任务开始时间:</span>
          <el-date-picker
          class="width220px"
            v-model="startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="disClose">取 消</el-button>
        <el-button type="primary" @click="tijiao" :disabled="tijiaofatu">{{
          tijiaotext
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisibleV3" width="50%">
      <span>存在已入组患者，请确认是否再次入组？</span>
      <el-table
        :data="multipleSelection"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange2"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="50"
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column prop="patientName" label="患者姓名" width="100">
          <template slot-scope="scope">{{
            scope.row.patientName | hideInfo("patientName")
          }}</template>
        </el-table-column>
        <el-table-column
          prop="planCondition"
          label="入组计划"
          width="260"
        ></el-table-column>
        <el-table-column
          prop="admissionDatetime"
          label="入组时间"
        ></el-table-column>
      </el-table>
      <p>
        提示：本次入组不影响该患者其他计划，重复入组当前计划，将删除所有未执行任务
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleV3 = false">取 消</el-button>
        <el-button type="primary" @click="choice2">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import NewPatientAlert from "@/components/newPatientAlert";
// import Booked from './components/booked'
import Pagination from "@/mixins/pagination";
import { patientModel } from "@/mixins/enum.js";
import { Table } from "element-ui";
export default {
  mixins: [Pagination, patientModel],
  components: { NewPatientAlert },
  data() {
    return {
      choicetext: "确 定",
      choicefatu: false,
      tijiaotext: "确 定",
      tijiaofatu: false,
      multipleSelection2: [],
      multipleSelection: [],
      dialogVisibleV2: false,
      dialogVisibleV3: false,
      checkList: [],
      alllist: [],
      baseColumns: [],
      baseColumnsV2: [],
      patientTypeTc: "",
      token: this.$cookie.get("token"),
      patientStateChanged: "",
      mainList: [],
      currentRow: {},
      modules: [],
      patientTypeList: [],
      isGroup: false,
      timeKeyList: [
        { label: "入院时间", value: "admissionDatetime" },
        { label: "出院时间", value: "dischargeDatetime" },
        { label: "就诊时间", value: "medicalDate" },
        { label: "创建时间", value: "createDatetime" }
        //{ label: '手术时间', value: 'unknown1', disabled: true },
        //{ label: '签约时间', value: 'signTime' },
        //{ label: '服务失效时间', value: 'validityDatetime' },
      ],
      searchKeyList: [
        { label: "姓名", value: "patientName" },
        { label: "病案号", value: "patientId" },
        { label: "诊断", value: "dischargeDiagnosis" }
        //{ label: '电话', value: 'flupPhone' },
        //{ label: '门诊号', value: 'unknown', disabled: true },
        //{ label: '身份证', value: 'idNo' },
        //{ label: '签约服务包', value: 'packageName' },
      ],
      stateList: [
        { label: "未随访", value: 1 },
        { label: "正常随访", value: 2 },
        { label: "居民死亡", value: 4 },
        { label: "电话错号", value: 5 },
        { label: "电话空号", value: 6 },
        { label: "电话关机", value: 7 },
        { label: "无人接听", value: 8 },
        { label: "拒绝随访", value: 9 },
        { label: "电话停机", value: 10 }
      ],
      patientStateList: [
        { label: "正常", value: 1 },
        { label: "死亡", value: 3 },
        { label: "拒绝", value: 4 },
        { label: "终止", value: 5 }
      ],
      search: {
        deptId: this.$route.query.deptId,
        patientTypeCode: this.$route.query.patientTypeCode
          ? this.$route.query.patientTypeCode
          : "",
        searchKey: "patientName",
        searchVal: "",
        searchTimeKey: "",
        searchTimeVal: null,
        wardId: null, //暂时弃用
        deptwardId: null,
        packageCode: this.$route.query.packageCode
          ? this.$route.query.packageCode
          : ""
      },
      hospitalId: null,
      zc: [],
      userId: null,
      flupPlanId: null,
      deptlist: [],
      fuGrouplist: [],
      fuDoctorlist: [],
      executiveDeptId: null,
      executiveDept: null,
      fuGroupId: null,
      fuDoctorId: null,
      startDate: "",
      patientNamelist: [],
      queryDischargeWardlist: [],
      flupPlanqueryobj: {},
      deptlistArr: [],
      notifyMessage: "block",
      instance: null,
      packageList: [],
      packageArr: [],
      needStartDate: false
    };
  },
  async created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem("global")).hospital_id;
    this.flupPlanId = this.$route.query.flupPlanId;
    this.$apis.queryFlupPlanDetail(this.flupPlanId).then(res => {
        this.needStartDate = res.needStartDate
      })
    if (this.search.deptId) {
      if (this.search.deptId.leng > 0) {
        this.search.deptwardId = this.search.deptId;
      }
    }
    this.getPackageList();
    this.search.searchTimeKey = this.getTimeKeyList(
      this.search.patientTypeCode
    )[0].value;
    window.addEventListener("refresh-data", this.onSearch);
    this.$apis.queryJoinPlanPatientTypeById(this.flupPlanId).then(res => {
      this.patientTypeList = res;
      this.search.patientTypeCode = res[0].patientTypeCode;
      this.search.searchTimeKey = this.getTimeKeyList(
        res[0].patientTypeCode
      )[0].value;
      this.flupPlanquery();
    });
  },
  computed: {
    plan() {
      return this.planList.find(
        item => item.serial_no === this.search.flup_plan_id
      );
    }
  },
  watch: {
    checkList() {
      this.baseColumns = [];
      for (let i in this.checkList) {
        for (let j in this.alllist) {
          if (this.checkList[i] == this.alllist[j].id) {
            this.baseColumns.push(this.alllist[j]);
          }
        }
      }
    }
  },
  destroyed() {
    window.removeEventListener("refresh-data", this.onSearch);
  },
  methods: {
    disClose() {
      this.dialogVisibleV2 = false
      this.startDate = ""
    },
    getTimeKeyList(key) {
      if (key == "ADMISSION_PATIENT" || key == "DISCHARGE_PATIENT") {
        return [
          { label: "入院时间", value: "admissionDatetime" },
          { label: "出院时间", value: "dischargeDatetime" },
          { label: "创建时间", value: "createDatetime" }
        ];
      } else {
        return [
          { label: "就诊时间", value: "medicalDate" },
          { label: "创建时间", value: "createDatetime" }
        ];
      }
    },
    clickHandler(a) {
      if (this.notifyMessage == "none") {
        this.notifyMessage = "block";
        a.currentTarget.parentElement.childNodes[1].style.display =
          "inline-block";
      } else {
        this.notifyMessage = "none";
        a.currentTarget.parentElement.childNodes[1].style.display = "none";
      }
    },
    related() {
      if (this.search.patientTypeCode) {
        this.search.deptId = this.flupPlanqueryobj.executiveDeptId;
      }
    },
    flupPlanquery() {
      this.$apis.queryFlupPlanDetail(this.flupPlanId).then(res => {
        this.flupPlanqueryobj = res;
        this.executiveDeptId = res.executiveDeptId;
        this.executiveDept = res.executiveDept;
        this.fuGroupId = res.fuGroupId;
        this.fuDoctorId = res.fuDoctorId;
        this.related();
        this.getdeptlist();
      });
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
    },
    tijiao() {
      if(!this.startDate && this.needStartDate) {
        this.$message.error('请选择任务开始时间');
        return
      }
      this.tijiaofatu = true;
      this.tijiaotext = "已提交";
      let _this = this;
      setTimeout(function() {
        _this.tijiaofatu = false;
        _this.tijiaotext = "确 定";
      }, 3000);
      let recordSerialNo = [];
      let groupPatients = [];
      this.multipleSelection.forEach(res => {
        // recordSerialNo.push(res.recordSerialNo)
        let patient = {
          groupPatientRecordSerialNo: res.recordSerialNo,
          groupPatientRecordTime: res.groupDatetime,
          patientName: res.patientName,
          userId: res.userId,
          packageCode: res.packageCode
        };
        this.$apis
          .getPatientInfoBySerialNo({
            serialNo: res.recordSerialNo,
            patientTypeCode: this.search.patientTypeCode
          })
          .then(res => {
            if (res) {
              patient.deptName = res.deptName;
              patient.deptCode = res.deptCode;
              patient.dateOfBirth = res.dateOfBirth;
              patient.idNo = res.idNo;
              patient.packageCode = res.packageCode;
            }
            groupPatients.push(patient);
            if (groupPatients.length == this.multipleSelection.length) {
              let realName;
              this.fuDoctorlist.forEach(res => {
                if (this.fuDoctorId == res.userId) {
                  realName = res.realName;
                }
              });
              this.$apis
                .AddIcdmPatientManage({
                  patientTypeCode: this.search.patientTypeCode,
                  joinType: this.patientTypeTc,
                  flupPlanId: this.flupPlanId,
                  // recordSerialNo: recordSerialNo.join('|'),
                  groupPatients: groupPatients,
                  fuDoctorName: realName,
                  fuDoctorId: this.fuDoctorId,
                  hospitalId: this.hospitalId,
                  startDate: this.startDate
                })
                .then(res => {
                  this.dialogVisibleV2 = false;
                  let succeedCount = 0;
                  let errorList = [];
                  this.startDate = ""
                  for (let i in res) {
                    if (res[i].groupCount == 0) {
                      errorList.push(res[i]);
                    } else {
                      succeedCount += res[i].groupCount;
                    }
                  }
                  if (succeedCount > 0) {
                    this.$message({
                      message: "操作成功，共生成 " + succeedCount + " 条任务",
                      type: "success"
                    });
                  }
                  if (errorList.length > 0) {
                    const h = this.$createElement;
                    this.$notify.error({
                      title: "失败",
                      duration: 0,
                      message: h("NewPatientAlert", {
                        props: {
                          errorList
                        }
                      })
                    });
                  }
                });
            }
          });
      });
    },
    getdeptlist() {
      this.$apis.systemManagequeryCurrentUserDept({}).then(res => {
        this.deptlistArr = res;
        this.getMainList();
        this.getfuGrouplist();
      });
    },
    getPackageList() {
      this.$apis
        .getAllPackageList({
          pageStatus: false,
          hospitalId: this.$global.hospital_id
        })
        .then(res => {
          this.packageArr = res.list;
        });
    },
    getfuGrouplist() {
      this.$apis
        .systemManagequeryFlupGroupByDeptId({
          deptId: this.executiveDeptId
        })
        .then(res => {
          this.fuGrouplist = res;

          this.getfuDoctorlist();
        });
    },
    getfuDoctorlist() {
      this.$apis
        .systemManagequeryFlupGroupMembersByGroupId({
          groupId: this.fuGroupId
        })
        .then(res => {
          this.fuDoctorlist = res;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    choice2() {
      if (this.multipleSelection2.length == 0) {
        this.$message({
          message: "未选择任何患者",
          type: "warning"
        });
        return;
      }
      this.multipleSelection = this.multipleSelection2;
      this.dialogVisibleV3 = false;
      this.addTo();
    },
    choice() {
      this.choicefatu = true;
      this.choicetext = "已提交";
      let _this = this;
      setTimeout(function() {
        _this.choicefatu = false;
        _this.choicetext = "确 定";
      }, 3000);
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "未选择任何患者",
          type: "warning"
        });
        return;
      }
      if (this.multipleSelection.length == 1) {
        if (this.multipleSelection[0].planCondition) {
          this.$confirm(
            "患者：" +
              this.multipleSelection[0].patientName +
              "已入组" +
              this.multipleSelection[0].planCondition +
              "计划，继续执行入组操作？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.addTo();
            })
            .catch(() => {
              return false;
            });
        } else {
          this.addTo();
        }
      } else {
        for (let i in this.multipleSelection) {
          if (this.multipleSelection[i].planCondition) {
            this.dialogVisibleV3 = true;
            return false;
          }
        }

        this.addTo();
      }
    },
    async addTo() {
      this.$apis
        .getFlupConfigList({
          hospitalId: this.hospitalId,
          moduleCode: "followUpSetting"
        })
        .then(res => {
          //新增患者分配随访医生

          if (
            res.find(x => x.componentKey == "patientAssignDoctor")
              .componentValue == "2"
          ) {
            this.dialogVisibleV2 = true;
            this.patientNamelist = [];
            this.multipleSelection.forEach(res => {
              this.patientNamelist.push(res.patientName);
            });
          } else {
            let groupPatients = [];
            this.multipleSelection.forEach(async res => {
              // recordSerialNo.push(res.recordSerialNo)
              let patientInfo = {
                groupPatientRecordSerialNo: res.recordSerialNo,
                groupPatientRecordTime: res.groupDatetime,
                patientName: res.patientName,
                userId: res.userId,
                packageCode: res.packageCode
              };
              this.$apis
                .getPatientInfoBySerialNo({
                  serialNo: res.recordSerialNo,
                  patientTypeCode: this.search.patientTypeCode
                })
                .then(res => {
                  if (res) {
                    patientInfo.deptName = res.deptName;
                    patientInfo.deptCode = res.deptCode;
                    patientInfo.dateOfBirth = res.dateOfBirth;
                    patientInfo.idNo = res.idNo;
                    patientInfo.packageCode = res.packageCode;
                  }
                  groupPatients.push(patientInfo);
                  if (groupPatients.length == this.multipleSelection.length) {
                    this.AddPatientManage(groupPatients);
                  }
                });
            });
          }
        });
    },
    AddPatientManage(groupPatients) {
      this.$apis
        .AddIcdmPatientManage({
          patientTypeCode: this.search.patientTypeCode,
          joinType: this.patientTypeTc,
          flupPlanId: this.flupPlanId,
          // recordSerialNo: recordSerialNo.join('|'),
          groupPatients: groupPatients,
          hospitalId: this.hospitalId
        })
        .then(res => {
          let succeedCount = 0;
          let errorList = [];
          for (let i in res) {
            if (res[i].groupCount == 0) {
              errorList.push(res[i]);
            } else {
              succeedCount += res[i].groupCount;
            }
          }
          if (succeedCount > 0) {
            this.$message({
              message: "操作成功，共生成 " + succeedCount + " 条任务",
              type: "success"
            });
          }
          if (errorList.length > 0) {
            const h = this.$createElement;
            this.$notify.error({
              title: "失败",
              duration: 0,
              message: h("NewPatientAlert", {
                props: {
                  errorList
                }
              })
            });
          }
        });
    },
    dragTheStart() {
      this.zc = JSON.parse(JSON.stringify(this.baseColumns));
    },
    dragTheEnter(before, after) {
      if (after.childNodes.length != 0) {
        this.baseColumns = this.zc;
      }
    },
    bc() {
      let arr = [];
      for (let i in this.baseColumns) {
        let a = {
          columnId: this.baseColumns[i].id,
          page: "患者列表",
          sortOrder: Number(i) + 1,
          type: this.patientTypeTc,
          userId: this.userId
        };
        arr.push(a);
      }
      if (arr.length != 0) {
        this.$apis.columnsavePageColumns(arr).then(res => {
          if (res) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getMainList();
          }
        });
      } else {
        this.$message({
          message: "至少配置一个显示字段",
          type: "warning"
        });
      }
    },
    remove(node, data) {
      for (let i in this.checkList) {
        if (this.checkList[i] == data.id) {
          this.checkList.splice(i, 1);
        }
      }
    },
    getlists() {
      this.$apis
        .columnqueryPageColumnConfigDisplay({
          page: "患者列表",
          type: this.patientTypeTc
        })
        .then(res => {
          this.modules = res.modules;
          this.alllist = res.baseColumns;
        });
      this.$apis
        .columnqueryPageColumnDisplay({
          page: "患者列表",
          type: this.patientTypeTc
        })
        .then(res => {
          this.checkList = [];
          this.baseColumns = res.baseColumns;
          this.baseColumnsV2 = res.baseColumns;
          this.baseColumns.forEach(element => {
            this.checkList.push(element.id);
          });
        });
    },

    onSearch() {
      this.pageIndex = 1;
      this.getMainList();
    },
    getMainList() {
      if (!this.search.deptwardId) {
        this.related();
      }
      if (this.search.patientTypeCode == this.patientModel.sign) {
        this.search.deptId = "";
        this.packageList = [];
        let pack = this.flupPlanqueryobj.relationDetail.filter(
          x => x.patientTypeCode == this.search.patientTypeCode
        );
        pack[0].relationTypeCodeList.forEach(i => {
          for (let j in this.packageArr) {
            if (i == this.packageArr[j].serialNo) {
              this.packageList.push(this.packageArr[j]);
            }
          }
        });
      } else {
        this.search.deptId = this.search.deptwardId;
        // this.deptlist = this.deptlistArr.filter(
        //   (element) => element.deptCode == this.flupPlanqueryobj.executiveDeptId
        // )
        ///原权限内科室换为所有随访科室
        // this.$apis
        //   .departmentquery({
        //     flupDepartment: 1,
        //     hospitalId: this.$global.hospital_id,
        //     pageNo: 1,
        //     pageSize: 1000
        //   })
        //   .then(res => {
        //     this.deptlist = res.list;
        //   });
        this.$apis.selectDeptByUserGroup({
          hospitalId: this.$global.hospital_id,
          userId: JSON.parse(sessionStorage.getItem('global')).userId || ''
        }).then(res => {
          this.deptlist = res;
        })
      }

      this.patientTypeList.forEach(rsp => {
        if (rsp.patientTypeCode == this.search.patientTypeCode) {
          this.patientTypeTc = rsp.patientTypeName;
        }
      });
      if (this.search.patientTypeCode == this.patientModel.sign) {
        this.searchKeyList.forEach(item => {
          if (item.value == "packageName") {
            this.$set(item, "disabled", false);
          }
        });
        this.timeKeyList.forEach(item => {
          if (item.value == "validityDatetime") {
            this.$set(item, "disabled", false);
          } else if (item.value == "signTime") {
            this.$set(item, "disabled", false);
          }
        });
      } else {
        this.searchKeyList.forEach(item => {
          if (item.value == "packageName") {
            this.$set(item, "disabled", true);
          }
        });
        this.timeKeyList.forEach(item => {
          if (item.value == "validityDatetime") {
            this.$set(item, "disabled", true);
          } else if (item.value == "signTime") {
            this.$set(item, "disabled", true);
          }
        });
      }
      this.getlists();
      let query = { ...this.search };
      query.searchTimeVal = query.searchTimeVal
        ? this.search.searchTimeVal.join(",")
        : "";
      return this.$apis
        .PatientgetPatientList({
          ...query,
          isGroup: this.isGroup,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
          isNormal: 1
        })
        .then(res => {
          this.mainList = [];
          let _this = this;
          setTimeout(function() {
            _this.mainList = res.list;
            _this.total = res.total;
          }, 300);
        });
    },
    refresh() {
      this.pageIndex = 1;
      this.getMainList();
    },

    formatPatientType(row, col, val) {
      let obj = this.patientTypeList.find(item => item.dict_code === val);
      return obj && obj.dict_name;
    },
    formatIdNo(row, col, val) {
      return this.$utils.shield(val, 3);
    },
    formatState(row, col, val) {
      let obj = this.stateList.find(item => item.value === val);
      return obj && obj.label;
    },
    async confirmChangeState() {
      await this.$apis.PatientupdateEmrPatientStatus({
        serialNo: this.currentRow.serial_no,
        status: this.currentRow.flup_state,
        hospitalId: this.$global.hospital_id
      });
      this.getMainList();
    }
  }
};
</script>

<style lang="scss">
.patient-list-new {
  .start-time {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 215px;
    }
  }
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
}
.xdzd {
  padding: 10px 30px 10px 30px;
  border: 1px solid #ccc;
  span,
  i {
    color: #32ae57;
  }
}
.checkxbox {
  .el-checkbox {
    padding: 5px 0px;
    min-width: 150px;
  }
}
.tlt {
  width: 100px;
  span {
    display: inline-block;
    width: 100px;
  }
}
</style>
