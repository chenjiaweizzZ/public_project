<template>
  <section class="routine-new">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>计划</p>
        <el-select class="width200" v-model="search.flupPlanId" placeholder="随访计划" @change="getpatientTypeList">
          <el-option v-for="item in planList" :key="item.serialNo" :value="item.serialNo" :label="item.planName"></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>类型</p>
        <el-select class="width200px" v-model="search.patientTypeCode" placeholder="患者类型" @change="changeType">
          <el-option v-for="item in patientTypeList" :key="item.patientTypeCode" :value="item.patientTypeCode" :label="item.patientTypeName"></el-option>
        </el-select>
      </div>
      <div v-if="search.patientTypeCode != patientModel.sign" class="queryConditions">
        <p>科室</p>
        <el-select class="width200px" v-model="search.deptId" placeholder="请选择" clearable @change="getMainList">
          <el-option v-for="item in deptList" :key="item.serialNo" :value="item.serialNo" :label="item.deptName"></el-option>
        </el-select>
      </div>
      <div v-else class="queryConditions">
        <p>签约服务内容</p>
        <el-select class="width200px" v-model="search.packageCode" placeholder="请选择" clearable @change="getMainList">
          <el-option v-for="item in packageList" :key="item.serialNo" :value="item.serialNo" :label="item.packageName"></el-option>
        </el-select>
      </div>
      <div v-if="hidden" class="queryConditions">
        <p>随访途径</p>
        <el-select v-model="search.smartFlupMethodId">
          <el-option v-for="item in methodList" :key="item.dictCode" :value="item.dictCode" :disabled="item.disabled" :label="item.dictName || '全部'"></el-option>
        </el-select>
      </div>
      <div v-if="hidden" class="queryConditions">
        <p>随访状态</p>
        <el-select v-model="search.flupStateId">
          <el-option v-for="item in stateList" :key="item.label" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </div>
      <div v-if="hidden" class="queryConditions">
        <p>随访类型</p>
        <el-select v-model="search.flupType">
          <el-option v-for="item in typList" :key="item.name" :value="item.name" :label="item.name || '全部'"></el-option>
        </el-select>
      </div>
      <div v-if="hidden" class="queryConditions">
        <div class="flex">
          <el-select class="margin-left10 width130px select-time-key" v-model="search.searchTimeKey">
            <el-option v-for="item in timeKeyList" :key="item.label" :value="item.value" :label="item.label" :disabled="item.disabled"></el-option>
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
      <div v-if="hidden" class="queryConditions">
        <el-input class="width250px limiting" v-model="search.searchVal" clearable maxlength="20" show-word-limit>
          <el-select class="width110px" v-model="search.searchKey" slot="prepend">
            <el-option v-for="item in searchKeyList" :key="item.label" :value="item.value" :label="item.label" :disabled="item.disabled"></el-option>
          </el-select>
        </el-input>
      </div>
      <div class="butBox">
        <el-button class="margin-left10" type="text" @click="showOrHide">{{ !hidden ? "高级筛选" : "收起" }}</el-button>
        <el-button class="margin-left10" @click="onSearch" plain>查询</el-button>
        <el-button type="primary" @click="addPatient" plain :disabled="planList.length==0">新增</el-button>
        <i style="margin-left: 10px; font-size: 20px; color: #409eff" class="el-icon-setting" @click="sz"></i>
      </div>
    </div>

    <el-table
      style="margin-bottom:60px"
      class="margin-top20"
      :data="mainList"
      :row-style="rowStyle"
      @sort-change="sortChange"
      border
      stripe
      :default-sort="{prop: 'createTime', order: 'descending'}"
    >
      <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
      <!-- :width="item.displayName.indexOf('时间') != -1?180:item.displayName.indexOf('手机号')!=-1?120:''" -->
      <el-table-column
        v-for="(item, index) in baseColumnsV2"
        :key="index"
        show-overflow-tooltip
        :prop="item.fieldName"
        :label="item.displayName"
        :sortable="item.displayName == '创建时间'"
        :width="item.displayName == '创建时间'?'200':''"
      >
        <template slot-scope="scope">
          <el-button v-if="item.displayName == '患者姓名'" @click="onView(scope.row)" type="text">{{ scope.row.patientName | hideInfo('name') }}</el-button>
          <p v-else>{{ scope.row[item.fieldName] | hideInfo(item.fieldName)}}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column
        :width="item.displayName.indexOf('时间') != -1?180:item.displayName.indexOf('手机号')!=-1?120:''"
        v-for="(item, index) in baseColumnsV2"
        :key="index"
        show-overflow-tooltip
        :prop="item.fieldName"
        :label="item.displayName"
      ></el-table-column>-->
      <el-table-column show-overflow-tooltip width="300" fixed="right" label="操作">
        <template slot-scope="scope">
          <div style="width: 300px !important">
            <el-row>
              <el-button @click="onView(scope.row)" type="text">查看</el-button>
              <el-button
                v-if="
                  scope.row.flupType == '调查问卷' ||
                  scope.row.flupType == '专科随访'
                "
                @click="linkToFollowup(scope.row)"
                type="text"
              >电话随访</el-button>
              <el-button
                v-if="
                  scope.row.senderState ==0 &&
                  scope.row.flupType != '专科随访' && 
                  scope.row.smartFlupMethod !== '电话'
                "
                @click="onImpelemnt(scope.row)"
                type="text"
              >发送</el-button>
              <el-button
                v-if="
                  (scope.row.flupType == '调查问卷'||scope.row.flupType == '健康宣教') &&
                  scope.row.smartFlupMethod !== '电话' && scope.row.senderState == 1"
                :disabled="resendDisabled(scope.row)||scope.row.flupState=='已完成'"
                type="text"
                @click="onReSend(scope.row)"
              >{{ `重发(已发${scope.row.sendTimes || 0})次` }}</el-button>
              <el-button @click="onDelete(scope.row)" type="text">删除</el-button>
            </el-row>
          </div>
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
    <importPatient v-if="dialogVisible" :plan="plan" :flupPlanId="search.flupPlanId" :show.sync="dialogVisible"></importPatient>
    <el-dialog title="提示" :visible.sync="confirmVisible" width="500px" :close-on-click-modal="false" :close-on-press-esc="false">
      <el-row>
        <span class="color-333">移除对象：</span>
        <span class="color-111">{{ deleteRow.patientName }}</span>
        <span class="margin-left20 color-333">移除的随访类型：</span>
        <span class="color-111">{{ deleteRow.flupType }}</span>
      </el-row>
      <el-row class="margin-top20" type="flex">
        <span style="display: inline-block;width: 111px;">移除方式：</span>
        <div>
          <el-radio v-model="confirmType" :label="1">仅移除当前任务</el-radio>
          <el-radio v-model="confirmType" :label="2">患者移除当前计划(不包含已完成)</el-radio>
          <el-radio v-model="confirmType" :label="3">患者移除当前计划(包含已完成)</el-radio>
        </div>
      </el-row>
      <span slot="footer">
        <el-button @click="confirmVisible = false">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="设置显示字段" :visible.sync="dialogField" width="90%" top="10vh" :close-on-click-modal="false" :close-on-press-esc="false">
      <!-- <div>
        患者类型
        <el-select v-model="patientTypeTc" placeholder="请选择患者类型" @change="getlists">
          <el-option
            v-for="item in patientTypeList"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
        <input style="display: none;border: 0;" type="text" v-model="userId" />
      </div>-->
      <input style="display: none; border: 0" type="text" v-model="userId" />
      <div style="padding: 20px" class="flex">
        <div class="checklistbox" style="flex: 4">
          <h4 style="color: #666">可选字段</h4>
          <div>
            <div v-for="(item, index) in modules" :key="index">
              <h3 style="padding: 10px 0px">{{ item.moduleName }}</h3>
              <div class="checkxbox">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox v-for="(item2, index) in item.columns" :key="index" :label="item2.id">{{ item2.displayName }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <div class="xdzd" style="flex: 1 0 1">
          <h4 style="color: #666; text-align: center">当前选定字段</h4>
          <el-tree :data="baseColumns" node-key="id" default-expand-all draggable @node-drag-start="dragTheStart" @node-drop="dragTheEnter" :expand-on-click-node="false">
            <span style="width: 100%; padding: 5px 0px" class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.displayName }}</span>
              <span style="margin-bottom: 3px">
                <el-button icon="el-icon-close" type="text" @click="() => remove(node, data)"></el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="
            dialogField = false;
            statusChange = true;
          ">取 消</el-button>
        <el-button type="primary" @click="bc">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import Pagination from '@/mixins/pagination';
import importPatient from './components/import_patient';
import { patientModel } from '@/mixins/enum.js';
export default {
  mixins: [Pagination, patientModel],
  components: { importPatient },
  data() {
    return {
      userId: '',
      dialogVisibleV2: false,
      dialogVisible: false,
      questionList: [],
      hidden: false,
      checked: true,
      mainList: [],
      sort: { prop: 'dischargeDatetime', order: 'ascending' },
      timeKeyList: [
        { label: '入院时间', value: 'admissionDatetime' },
        { label: '出院时间', value: 'dischargeDatetime' },
        //{ label: '手术时间', value: 'unknown', disabled: true },
        { label: '任务开始时间', value: 'flupStartTime' },
        { label: '任务生成时间', value: 'createTime' },
      ],
      searchKeyList: [
        { label: '姓名', value: 'patientName' },
        //{ label: '电话', value: 'flupPhone' },
        { label: '病案号', value: 'patientId' },
        //{ label: '门诊号', value: 'unknown', disabled: true },
        //{ label: '身份证', value: 'idNo' },
        { label: '诊断', value: 'dischargeDiagnosis' },
      ],
      planList: [],
      typList: [],
      stateList: [
        { label: '', value: '' },
        { label: '已随访', value: 0 },
        { label: '执行中', value: 1 },
        { label: '待随访', value: 2 },
        { label: '待执行', value: 3 },
        //{ label: '异常', value: 4 },
      ],
      methodList: [],
      search: {
        flupPlanId: '',
        searchKey: 'patientName',
        searchVal: '',
        searchTimeKey: 'admissionDatetime',
        searchTimeVal: null,
        smartFlupMethodId: '',
        flupStateId: 'All',
        flupType: '',
        patientTypeCode: '',
        deptId: null,
        packageCode: null,
      },
      deleteRow: {},
      confirmType: 1,
      confirmVisible: false,
      alllist: [],
      baseColumns: [],
      baseColumnsV2: [],
      modules: [],
      zc: [],
      dialogField: false,
      checkList: [],
      patientTypeList: [],
      // patientTypeTc:
      statusChange: true, //改变table状态以刷新table
      packageCodes: '',
      deptList: [],
      deptArr: [],
      packageList: [],
      packageArr: [],
      maxTimes: -1,
    };
  },
  async created() {
    this.$apis
      .getFlupConfigList({
        hospitalId: this.$global.hospital_id,
        moduleCode: 'followUpSetting',
      })
      .then((res) => {
        if (res.find((x) => x.componentKey == 'resendWay').componentValue == '1') {
          let time = res.find((x) => x.componentKey == 'resendTimes').componentValue;
          this.maxTimes = parseInt(time);
        }
      });
    await this.$apis
      .queryDictByCode({
        grandParentDictCode: 'Flup',
        parentDictCode: 'SmartFlupStatus',
      })
      .then((res) => {
        // this.stateList = res.filter(item=>item.enabled==='1')
        this.stateList = res.map((item) => {
          return {
            label: item.dictName,
            value: item.dictCode,
          };
        });
      });
    // await this.$apis
    //   .selectParametersByParameterKey({
    //     parameterKey: 'ImmediateExecution',
    //   })
    //   .then((res) => {
    //     this.isImplement = res.enabled == '1'
    //   })
    // await this.$apis.getImplementConfig((res) => {
    //   this.isImplement = res.data[0].enabled === '1'
    // })
    await this.$apis
      .flupPlanqueryCurrentUserFlupPlanListNew({
        planType: 0,
        pageNo: 1,
        pageSize: 100,
        hospitalId: this.$global.hospital_id,
        enable: 1,
      })
      .then((res) => {
        this.planList = res.list || [];
        this.planList = this.planList.filter((element) => {
          return element.enable;
        });
        if (this.$route.query.planId) {
          if (JSON.stringify(this.planList).indexOf(this.$route.query.planId) == -1) {
            this.$message({
              message: '该计划数据无法获取',
              type: 'warning',
            });
          }
        }
        this.search.flupPlanId = this.$route.query.planId ? this.$route.query.planId : this.planList[0] ? this.planList[0].serialNo : '';
        for (let i in this.planList) {
          if (this.search.flupPlanId == this.planList[i].serialNo) {
            this.search.deptId = this.planList[i].executiveDeptId;
          }
        }
      });
    await this.$apis
      .queryDictByCode({
        grandParentDictCode: 'Flup',
        parentDictCode: 'SmartFlupMethod',
      })
      .then((res) => {
        this.methodList = res || [];
        this.methodList.unshift({ dictName: '', dictCode: '' });
      });
    await this.$apis
      .flupTypequeryFollowTypeList({
        pageNo: 1,
        pageSize: 100,
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.typList = res.list;
        this.typList.unshift({ name: '' });
        this.typList = this.typList.filter((x) => x.name != '慢病评估报告' && x.enable != 0);
      });
    await this.$apis.systemManagequeryCurrentUserDept().then((res) => {
      this.deptArr = res;
    });
    await this.$apis
      .getAllPackageList({
        pageStatus: false,
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.packageArr = res.list;
      });
    // await this.$apis.getFollowupTypeList({
    //   keyWord: '',
    //   enable: 1
    // }).then((res) => {
    //   this.typList = res.data
    //   this.typList.unshift({ name: '' })
    // })
    this.getpatientTypeList();
    this.onSearch();
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
    },
  },
  computed: {
    plan() {
      return this.planList.find((item) => item.serialNo === this.search.flupPlanId);
    },
    showButton() {
      let obj = this.planList.find((item) => {
        return this.search.flupPlanId == item.serialNo;
      });
      return obj && obj.fuWay === 1;
    },
  },
  methods: {
    changePlan() {
      this.getpatientTypeList();
    },
    changeType(val) {
      if (val == this.patientModel.sign) {
        this.getPackgeList();
      } else {
        this.getDeptList();
      }
    },
    getpatientTypeList() {
      this.mainList = [];
      this.planList.forEach((element) => {
        if (this.search.flupPlanId == element.serialNo) {
          this.search.deptId = element.executiveDeptId;
          this.packageCodes = element.baseServicePackageCodes;
        }
      });
      this.$apis.queryJoinPlanPatientTypeById(this.search.flupPlanId).then((res) => {
        this.patientTypeList = res;
        this.search.patientTypeCode = '';
        if (res.length != 0) {
          this.search.patientTypeCode = res[0].patientTypeCode;
        }
        this.changeType(this.search.patientTypeCode);
      });
    },
    getDeptList() {
      this.search.packageCode = '';
      this.deptList = [];
      // let plan = this.planList.filter((x) => x.serialNo == this.search.flupPlanId)[0];

      // this.deptList = this.deptArr.filter((element) => element.serialNo == plan.executiveDeptId);

      // if (this.deptList.length > 0) {
      //   this.search.deptId = this.deptList[0].serialNo;
      // }
      this.search.deptId = '';
      this.$apis
        .departmentquery({
          flupDepartment: 1,
          hospitalId: this.$global.hospital_id,
          pageNo: 1,
          pageSize: 1000,
        })
        .then((res) => {
          this.deptList = res.list;
        });
      this.getMainList();
    },
    getPackgeList() {
      this.search.deptId = '';
      this.packageList = [];
      let plan = this.planList.filter((x) => x.serialNo == this.search.flupPlanId)[0];
      let pack = plan.relationDetail.filter((x) => x.patientTypeCode == this.search.patientTypeCode);
      pack[0].relationTypeCodeList.forEach((i) => {
        for (let j in this.packageArr) {
          if (i == this.packageArr[j].serialNo) {
            this.packageList.push(this.packageArr[j]);
          }
        }
      });
      if (this.packageList.length > 0) {
        this.search.packageCode = this.packageList[0].serialNo;
      }

      this.getMainList();
    },
    setdialogVisibleV2() {
      this.dialogVisibleV2 = !this.dialogVisibleV2;
    },
    sortChange({ column, prop, order }) {
      this.sort = { prop, order };
      this.getMainList();
    },
    addPatient() {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            '/#/newpatients?flupPlanId=' +
            this.search.flupPlanId +
            '&deptId=' +
            this.search.deptId +
            '&packageCode=' +
            this.search.packageCode +
            '&patientTypeCode=' +
            this.search.patientTypeCode,
          title: `新增患者`,
        }),
        '*'
      );
      // this.dialogVisible = true
    },
    onSearch() {
      this.pageIndex = 1;
      this.getMainList1();
    },
    showOrHide() {
      this.hidden = !this.hidden;
      // this.search.flupType = ''
      // this.search.flupStateId = 'All'
      // this.search.smartFlupMethodId = ''
      // this.getMainList()
    },
    getMainList() {
      this.mainList = [];
      if (this.search.patientTypeCode == this.patientModel.discharge) {
        this.timeKeyList.forEach((element) => {
          // this.search.searchTimeKey = 'admissionDatetime'
          element.disabled = false;
        });
      } else if (this.search.patientTypeCode == this.patientModel.admission) {
        this.timeKeyList.forEach((element) => {
          if (element.label == '出院时间' || element.label == '手术时间') {
            this.search.searchTimeKey = 'admissionDatetime';
            element.disabled = true;
          } else {
            element.disabled = false;
          }
        });
      } else {
        this.timeKeyList.forEach((element) => {
          if (element.label == '入院时间' || element.label == '出院时间' || element.label == '手术时间') {
            element.disabled = true;
            this.search.searchTimeKey = 'flupStartTime';
          } else {
            element.disabled = false;
          }
        });
      }
      this.getlists();
      if (!this.search.flupPlanId) {
        return;
      }
      let query = { ...this.search };
      // if (this.checked && this.hidden) {
      //   query.flupStateId = 2
      // }
      query.searchTimeVal = query.searchTimeVal ? this.search.searchTimeVal.join(',') : '';
      return this.$apis
        .getFlupPlanPatientList({
          ...query,
          'sort.prop': this.sort.prop,
          'sort.order': this.sort.order,
          hospitalId: this.$global.hospital_id,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          type: 0,
        })
        .then((res) => {
          this.mainList = res.list || [];
          this.total = res.total;
        });
    },
    getMainList1() {
      this.getlists();
      if (!this.search.flupPlanId) {
        return;
      }
      let query = { ...this.search };
      // if (this.checked && this.hidden) {
      //   query.flupStateId = 2
      // }
      query.searchTimeVal = query.searchTimeVal ? this.search.searchTimeVal.join(',') : '';
      return this.$apis
        .getFlupPlanPatientList({
          ...query,
          'sort.prop': this.sort.prop,
          'sort.order': this.sort.order,
          hospitalId: this.$global.hospital_id,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          type: 0,
        })
        .then((res) => {
          this.mainList = res.list || [];
          this.total = res.total;
        });
    },
    onImpelemnt(item) {
      this.$apis
        .sendFlupPatientPlanManual({
          serialNo: item.serialNo,
        })
        .then(() => {
          this.getMainList();
        });
    },
    linkToFollowup(item) {
      let qsParams = this.$qs.stringify({
        serial_no: item.serialNo,
      });
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url: decodeURIComponent(location.origin + location.pathname + '#/newphoneFollowUp?' + qsParams),
          title: '电话随访',
        }),
        '*'
      );
    },
    // onView(row) {

    //   window.parent.postMessage(
    //     JSON.stringify({
    //       method: 'addTab',
    //       url:
    //         location.origin +
    //         location.pathname +
    //         `#/viewPatientPlanV2?user_id=${row.userId}&serialNo=${
    //           row.serialNo
    //         }&recordSerialNo=${row.recordSerialNo}&patient_name=${
    //           row.patientName
    //         }&discharge_datetime=${row.dischargeDatetime}&joinPlanPatientType=${
    //           this.search.joinPlanPatientType
    //         }&opener=${encodeURIComponent(location.href)}`,
    //       title: '患者随访计划',
    //     }),
    //     '*'
    //   )
    // },
    resendDisabled(row) {
      if (this.maxTimes > -1) {
        return row.sendTimes >= this.maxTimes;
      }
      return false;
    },
    onReSend(row) {
      this.$apis
        .reSendFlupPlanTask({
          serialNo: row.serialNo,
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '重发成功',
          });
          this.getMainList();
          row.sendTimes++;
        });
    },
    getContent(v) {
      this.questionList = [];
      this.$apis.getExceptionContent({ serialNo: v }).then((res) => {
        this.questionList = res;
        // this.questionList = this.questionList.filter(item => {
        //   return item.abnormal
        // })
      });
    },
    rowStyle(row) {
      return row.color
        ? {
            color: row.color,
          }
        : '';
    },
    onDelete(row) {
      this.confirmVisible = true;
      this.deleteRow = row;
      this.confirmType = 1;
    },
    onConfirm() {
      this.$apis
        .delPatientPlanExt({
          serialNo: this.deleteRow.serialNo,
          delType: this.confirmType,
        })
        .then(() => {
          this.confirmVisible = false;
          this.getMainList();
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
    sz() {
      this.getlists();
      this.dialogField = true;
      this.statusChange = false;
    },
    bc() {
      let arr = [];
      for (let i in this.baseColumns) {
        let a = {
          columnId: this.baseColumns[i].id,
          page: '常规随访',
          sortOrder: Number(i) + 1,
          // type: this.patientTypeTc,
          userId: this.userId,
        };
        arr.push(a);
      }
      if (arr.length != 0) {
        this.$apis.columnsavePageColumns(arr).then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.dialogField = false;
            this.getMainList();
          }
        });
        // this.$forceUpdate();
        // location.reload()
        this.statusChange = true;
      } else {
        this.$message({
          message: '至少配置一个显示字段',
          type: 'warning',
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
          page: '常规随访',
          // type: this.patientTypeTc
        })
        .then((res) => {
          this.modules = res.modules;
          this.alllist = res.baseColumns;
        });
      this.$apis
        .columnqueryPageColumnDisplay({
          page: '常规随访',
          // type: this.patientTypeTc
        })
        .then((res) => {
          this.checkList = [];
          this.baseColumns = res.baseColumns;
          this.baseColumnsV2 = res.baseColumns;
          this.baseColumns.forEach((element) => {
            this.checkList.push(element.id);
          });
        });
    },
    onView(row) {
      // console.log(this.search)
      // debugger
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/healtharchives?userId=${row.userId}&name=${row.patientName}&sex=${row.sex}&age=${this.$utils.getAge(row.dateOfBirth)}&phone=${
              row.phone
            }&dateTime=${this.$utils.formatDate(row.createDatetime)}&groupDatetime=${this.$utils.formatDate(row.recordDatetime)}&recordSerialNo=${
              row.recordSerialNo
            }&joinPlanPatientType=${this.search.patientType ? this.search.patientType : this.search.patientTypeCode}&flupPlanId=${row.flupPlanId}`,
          title: '健康档案',
        }),
        '*'
      );
    },
  },
};
</script>

<style lang="scss" scope>
.routine-new {
  padding: 0px 20px 20px 20px;
  font-size: 14px;
  color: #111;
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
  .el-table .el-table_1_column_2 {
    .cell.el-tooltip {
      min-width: 300px;
    }
  }
}
.xdzd {
  padding: 10px 20px 10px 20px;
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
</style>
