<template>
  <section class="routine-new">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>慢病计划</p>
        <el-select class="width200" v-model="search.flupPlanId" placeholder="慢病计划" @change="getpatientTypeList">
          <el-option v-for="item in planList" :key="item.serialNo" :value="item.serialNo" :label="item.planName"></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>患者类型</p>
        <el-select class="width200px" v-model="search.patientTypeCode" placeholder="患者类型" @change="getMainList">
          <el-option v-for="item in patientTypeList" :key="item.patientTypeCode" :value="item.patientTypeCode" :label="item.patientTypeName"></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
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
      <div class="queryConditions">
        <el-input class="margin-left10 width250px limiting" v-model="search.searchVal" maxlength="20" show-word-limit>
          <el-select class="width110px" v-model="search.searchKey" slot="prepend">
            <el-option v-for="item in searchKeyList" :key="item.label" :value="item.value" :label="item.label" :disabled="item.disabled"></el-option>
          </el-select>
        </el-input>
      </div>
      <div v-if="hidden" class="queryConditions">
        <p>随访途径</p>
        <el-select class="margin-left14" v-model="search.smartFlupMethodId">
          <el-option v-for="item in methodList" :key="item.dict_code" :value="item.dict_code" :disabled="item.disabled" :label="item.dict_name || '全部'"></el-option>
        </el-select>
      </div>
      <div v-if="hidden" class="queryConditions">
        <p>随访状态</p>
        <el-select class="margin-left14" v-model="search.flupStateId">
          <el-option v-for="item in stateList" :key="item.label" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </div>
      <!-- <div v-if="hidden" class="queryConditions">
        <p>随访类型</p>
        <el-select class="margin-left14" v-model="search.flupType">
          <el-option
            v-for="item in typList"
            :key="item.name"
            :value="item.name"
            :label="item.name || '全部'"
          ></el-option>
        </el-select>
      </div>-->
      <div class="butBox">
        <el-button class="margin-left20" type="text" @click="showOrHide">{{ !hidden ? "高级筛选" : "收起" }}</el-button>
        <el-button class="margin-left50" @click="onSearch" plain>查询</el-button>
        <el-button type="primary" @click="addPatient" plain>新增患者</el-button>
        <i style="margin-left: 30px; font-size: 20px; color: #999" class="el-icon-s-tools" @click="sz"></i>
      </div>
    </div>

    <el-table style="margin-bottom:60px" class="margin-top20;" :data="mainList" :row-style="rowStyle" @sort-change="sortChange" border stripe>
      <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
      <el-table-column v-for="(item, index) in baseColumnsV2" :key="index" show-overflow-tooltip :prop="item.fieldName" :label="item.displayName">
        <template slot-scope="scope">{{ scope.row[item.fieldName] | hideInfo(item.fieldName) }}</template>
      </el-table-column>
      <!-- <el-table-column
        show-overflow-tooltip
        :formatter="$utils.shieldName"
        width="90"
        sortable="custom"
        prop="patientName"
        label="姓名"
      ></el-table-column>
      <el-table-column show-overflow-tooltip width="60" prop="sex" label="性别"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        width="60"
        prop="dateOfBirth"
        label="年龄"
        :formatter="$utils.formatTableAge"
      ></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" label="手机号码">
        <template slot-scope="scope">
          <span>{{ $utils.shield(scope.row.contactPhone||scope.row.phone|| scope.row.mobile,2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="$utils.formatTableDate()"
        min-width="110"
        sortable="custom"
        prop="admissionDatetime"
        label="入院时间"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="$utils.formatTableDate()"
        min-width="110"
        sortable="custom"
        prop="dischargeDatetime"
        label="出院时间"
      ></el-table-column>
      <el-table-column show-overflow-tooltip min-width="110" prop="dischargeDept" label="科室"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="110" prop="dischargeDiagnosis" label="诊断"></el-table-column>
      <el-table-column show-overflow-tooltip prop="flupType" label="随访类型"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        width="90"
        prop="smartFlupMethod"
        min-width="110"
        label="途径"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="$utils.formatTableDate()"
        min-width="150"
        sortable="custom"
        prop="createTime"
        label="任务生成时间"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="$utils.formatTableDate()"
        min-width="150"
        sortable="custom"
        prop="flupStartTime"
        label="随访开始时间"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="$utils.formatTableDate()"
        min-width="110"
        prop
        label="手术时间"
      ></el-table-column>
      <el-table-column show-overflow-tooltip min-width="110" label="随访状态">
        <template slot-scope="scope">
          {{scope.row.flupState}}
          <el-popover
            v-if="scope.row.exceptionState==1"
            placement="right-end"
            width="200"
            trigger="hover"
            popper-class="popover"
            @show="getContent(scope.row.detail_serialNo)"
          >
            <i class="el-icon-info color-FF7B35" slot="reference"></i>
            <div>
              <el-row
                class="width100 margin-top20"
                v-for="(item,index) in questionList"
                :key="index"
              >
                <div>{{index + 1}}、{{item.label}}</div>
                <div
                  class="padding-left20"
                >{{item.value instanceof Array ? item.value.join('、') : item.value}}</div>
              </el-row>
            </div>
          </el-popover>
        </template>
      </el-table-column>-->
      <el-table-column show-overflow-tooltip :min-width="200" fixed="right" label="操作">
        <template slot-scope="scope">
          <!-- <el-row> -->
          <el-button @click="onView(scope.row)" type="text">健康档案</el-button>
          <el-button @click="openPlan(scope.row)" type="text">查看计划</el-button>
          <el-button @click="onDelete(scope.row)" type="text">移除</el-button>
          <!-- </el-row> -->
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
    <!-- <importPatient v-if="dialogVisible" :plan="plan" :show.sync="dialogVisible"></importPatient> -->
    <el-dialog title="设置显示字段" :visible.sync="dialogVisible" width="90%" top="10vh" :close-on-click-modal="false" :close-on-press-esc="false">
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
        <div>
          <p style="justify-content: center;display: flex;color: darkgray;">按住列名可拖动改变顺序</p>
          <div class="xdzd" style="flex: 1">
            <h4 style="color: #666; text-align: center">当前选定字段</h4>
            <el-tree :data="baseColumns" node-key="id" default-expand-all draggable @node-drag-start="dragTheStart" @node-drop="dragTheEnter" :expand-on-click-node="false">
              <span style="width: 100%; padding: 5px 0px" class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ data.displayName }}</span>
                <span style="float: right; margin-bottom: 3px">
                  <el-button icon="el-icon-close" type="text" @click="() => remove(node, data)"></el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="bc">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import Pagination from '@/mixins/pagination';
import importPatient from './components/import_patient';
export default {
  mixins: [Pagination],
  components: { importPatient },
  data() {
    return {
      userId: '',
      hospitalId: null,
      dialogVisible: false,
      questionList: [],
      hidden: false,
      checked: true,
      mainList: [],
      sort: { prop: 'dischargeDatetime', order: 'ascending' },
      timeKeyList: [
        // { label: '入院时间', value: 'admissionDatetime' },
        // { label: '出院时间', value: 'dischargeDatetime' },
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
        searchTimeKey: 'flupStartTime',
        searchTimeVal: null,
        smartFlupMethodId: '',
        flupStateId: 'All',
        flupType: '',
        patientTypeCode: '',
      },
      deleteRow: {},
      confirmType: 0,
      confirmVisible: false,
      alllist: [],
      baseColumns: [],
      baseColumnsV2: [],
      modules: [],
      zc: [],
      dialogField: false,
      checkList: [],
      patientTypeList: [],
    };
  },
  async created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id;
    await this.$apis
      .BaseDictGetDictItems({
        parentId: '20200408201204800f3a',
      })
      .then((res) => {
        if (res) {
          this.stateList = res.filter((item) => item.enabled === '1');
          this.stateList = this.stateList.map((item) => {
            return {
              label: item.dict_name,
              value: item.dict_code,
            };
          });
        }
      });
    // await this.$apis.getImplementConfig(res => {
    //   this.isImplement = res.data[0].enabled === '1'
    // })
    await this.$apis
      .flupPlanqueryCurrentUserFlupPlanList({
        pageNo: 1,
        pageSize: 200,
        enable: 1,
        planType: 1,
        hospitalId: this.hospitalId,
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
      });
    await this.$apis.BaseDictGetDictItems({ parentId: '2019051518541847339f' }).then((res) => {
      this.methodList = res;
      this.methodList.unshift({ dict_name: '', dict_code: '' });
    });
    await this.$apis
      .flupTypequeryFollowTypeList({
        keyWord: '',
        enable: 1,
        hospitalId: this.hospitalId,
      })
      .then((res) => {
        this.typList = res.list.filter((item) => {
          return item.enable != 0;
        });
        this.typList.unshift({ name: '' });
      });
    this.getpatientTypeList();
  },
  computed: {
    plan() {
      return this.planList.find((item) => item.serialNo === this.search.flupPlanId);
    },
    showButton() {
      let obj = this.planList.find((item) => {
        return this.search.flupPlanId == item.serialNo;
      });
      return obj && obj.fu_way === 1;
    },
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
  methods: {
    onDelete(row) {
      this.$confirm('此操作将患者移除当前计划(包含已完成), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          this.$apis
            .delPatientPlanExt({
              serialNo: row.serialNo,
              delType: 3,
            })
            .then((res) => {
              this.$message({
                type: 'success',
                message: '操作成功!',
              });
              this.onSearch();
            });
        })
        .catch(() => {});
    },
    remove(node, data) {
      for (let i in this.checkList) {
        if (this.checkList[i] == data.id) {
          this.checkList.splice(i, 1);
        }
      }
    },
    sz() {
      this.getlists();
      this.dialogVisible = true;
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
          page: '慢病随访',
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
            this.dialogVisible = false;
            this.getMainList();
          }
        });
      } else {
        this.$message({
          message: '至少配置一个显示字段',
          type: 'warning',
        });
      }
    },
    getlists() {
      this.$apis
        .columnqueryPageColumnConfigDisplay({
          page: '慢病随访',
          // type: this.patientTypeTc
        })
        .then((res) => {
          this.modules = res.modules;
          this.alllist = res.baseColumns;
        });
      this.$apis
        .columnqueryPageColumnDisplay({
          page: '慢病随访',
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

    getpatientTypeList() {
      this.$apis.queryJoinPlanPatientTypeById(this.search.flupPlanId).then((res) => {
        this.patientTypeList = res;
        if (res.length != 0) {
          this.search.patientTypeCode = res[0].patientTypeCode;
        }
        this.getMainList();
      });
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
      console.log(urlx + '/#/newpatients?flupPlanId=' + this.search.flupPlanId)
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url: urlx + '/#/newpatients?flupPlanId=' + this.search.flupPlanId,
          title: `新增患者`,
        }),
        '*'
      );
      // this.dialogVisible = true
    },
    onSearch() {
      this.pageIndex = 1;
      this.getMainList();
    },
    showOrHide() {
      this.hidden = !this.hidden;
      this.search.flupType = '';
      this.search.flupStateId = 'All';
      this.search.smartFlupMethodId = '';
      this.getMainList();
    },
    getMainList() {
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
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
          type: 1,
        })
        .then((res) => {
          this.mainList = res.list || [];
          this.total = res.total;
        });
    },
    onImpelemnt(item) {
      this.$apis
        .setImplement({
          serialNo: item.serialNo,
        })
        .then(() => {
          this.getMainList();
        });
    },
    linkToFollowup(item) {
      let qsParams = this.$qs.stringify({
        serialNo: item.serialNo,
      });
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url: decodeURIComponent(location.origin + '/pc/#/newphoneFollowUp?' + qsParams),
          title: '电话随访',
        }),
        '*'
      );
    },
    onView(row) {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      // this.patientTypeList.forEach((rsp) => {
      //   if (rsp.patientTypeCode == row.patientTypeCode) {
      //     this.patientTypeTc = rsp.patientTypeCode
      //   }
      // })
      this.patientTypeTc = this.search.patientTypeCode;
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/healtharchives?userId=${row.userId}&name=${row.patientName}&sex=${row.sex}&age=${this.$utils.getAge(row.dateOfBirth)}&phone=${
              row.phone
            }&dateTime=${this.$utils.formatDate(row.createTime)}&dischargeDate=${this.$utils.formatDate(row.dischargeDatetime)}&recordSerialNo=${
              row.recordSerialNo
            }&joinPlanPatientType=${this.patientTypeTc}&flupPlanId=${this.search.flupPlanId}&prop=${this.sort.prop}&order=${this.sort.order}&serialNo=${row.serialNo}`,
          title: '健康档案',
        }),
        '*'
      );
      // this.$router.push(
      //   `/healtharchives?userId=${row.userId}&name=${row.patientName}&sex=${row.sex}&age=${this.$utils.getAge(row.dateOfBirth)}&phone=${
      //     row.phone
      //   }&dateTime=${this.$utils.formatDate(row.createTime)}&dischargeDate=${this.$utils.formatDate(row.dischargeDatetime)}&recordSerialNo=${
      //     row.recordSerialNo
      //   }&joinPlanPatientType=${this.patientTypeTc}&flupPlanId=${this.search.flupPlanId}&prop=${this.sort.prop}&order=${this.sort.order}`
      // );
    },
    openPlan(row) {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + '/pc';
      }
      this.patientTypeTc = this.search.patientTypeCode;
      let rule = this.planList.find((item) => item.serialNo == this.search.flupPlanId);
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/icdmplan?userId=${row.userId}&name=${row.patientName}&sex=${row.sex}&age=${this.$utils.getAge(row.dateOfBirth)}&phone=${
              row.phone
            }&dateTime=${this.$utils.formatDate(row.createTime)}&dischargeDate=${this.$utils.formatDate(row.dischargeDatetime)}&recordSerialNo=${
              row.recordSerialNo
            }&joinPlanPatientType=${this.patientTypeTc}&flupPlanId=${this.search.flupPlanId}&prop=${this.sort.prop}&order=${this.sort.order}&flupPlan=${row.flupPlan}&fuRuleId=${
              rule.fuRuleId
            }&serialNo=${row.serialNo}`,
          title: '慢病计划',
        }),
        '*'
      );
      // this.$router.push(
      //   `/icdmplan?userId=${row.userId}&name=${row.patientName}&sex=${row.sex}&age=${this.$utils.getAge(row.dateOfBirth)}&phone=${row.phone}&dateTime=${this.$utils.formatDate(
      //     row.createTime
      //   )}&dischargeDate=${this.$utils.formatDate(row.dischargeDatetime)}&recordSerialNo=${row.recordSerialNo}&joinPlanPatientType=${this.patientTypeTc}&flupPlanId=${
      //     this.search.flupPlanId
      //   }&prop=${this.sort.prop}&order=${this.sort.order}&flupPlan=${row.flupPlan}&fuRuleId=${rule.fuRuleId}&serialNo=${row.serialNo}`
      // );
    },
    resendDisabled(row) {
      return row.sendTimes >= this.maxTimes;
    },
    onReSend(row) {
      this.$apis
        .reSendPlan({
          serialNo: row.serialNo,
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '重发成功',
          });
          // this.getMainList()
          row.sendTimes++;
        });
    },
    getContent(v) {
      this.questionList = [];
      this.$apis.getSaveContent({ serialNo: v, hospital_id: this.$global.hospital_id }).then((res) => {
        this.questionList = res.dataList.questionList;
        this.questionList = this.questionList.filter((item) => {
          return item.abnormal;
        });
      });
    },
    rowStyle(row) {
      return row.color
        ? {
            color: row.color,
          }
        : '';
    },
  },
};
</script>

<style lang="scss">
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

  .xdzd {
    padding: 10px 30px 10px 30px;
    border: 1px solid #ccc;
    span,
    i {
      color: #32ae57;
    }
  }
  .el-icon-caret-right:before {
    content: none;
  }
  .checkxbox {
    .el-checkbox {
      padding: 5px 0px;
      min-width: 150px;
    }
  }
}
</style>