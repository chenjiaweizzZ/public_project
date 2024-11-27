<template>
  <section class="routine-new">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>随访/慢病计划</p>
        <el-select class="width200" v-model="flupPlanId" clearable>
          <el-option v-for="item in allFlupPlanList" :key="item.serialNo" :value="item.serialNo" :label="item.planName"></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>随访科室/病区</p>
        <el-select class="width200px" v-model="deptId" clearable>
          <el-option v-for="item in deptList" :key="item.serialNo" :value="item.serialNo" :label="item.deptName"></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <div class="flex">
          <el-select class="margin-left10 width110px select-time-key" v-model="searchTimeKey">
            <el-option v-for="item in timeKeyList" :key="item.label" :value="item.value" :label="item.label" :disabled="item.disabled"></el-option>
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
          ></el-date-picker>
        </div>
      </div>
      <div class="queryConditions">
        <el-input class="margin-left10 width250px limiting" v-model="searchValue" maxlength="20" show-word-limit>
          <el-select class="width110px" v-model="searchKey" slot="prepend">
            <el-option v-for="item in searchKeyList" :key="item.label" :value="item.value" :label="item.label" :disabled="item.disabled"></el-option>
          </el-select>
        </el-input>
      </div>
      <div v-if="!hidden" class="queryConditions">
        <p>随访类型</p>
        <el-select v-model="flupType" clearable multiple collapse-tags>
          <el-option v-for="(item ,index) in followupTypeList" :key="index" :value="item.name" :label="item.name"></el-option>
        </el-select>
      </div>
      <div v-if="!hidden" class="queryConditions">
        <p>随访/慢病组</p>
        <el-select v-model="flupGroup" clearable @change="getmemberList">
          <el-option v-for="item in groupList" :key="item.serialNo" :value="item.serialNo" :label="item.groupName"></el-option>
        </el-select>
      </div>
      <div v-if="!hidden" class="queryConditions">
        <p>随访/慢病组成员</p>
        <el-select v-model="groupMember" clearable>
          <el-option v-for="item in memberList" :key="item.userId" :value="item.userId" :label="item.realName"></el-option>
        </el-select>
      </div>
      <div v-if="!hidden" class="queryConditions">
        <p>随访任务状态</p>
        <el-select v-model="flupState" clearable>
          <el-option v-for="item in stateList" :key="item.label" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </div>
      <div v-if="!hidden" class="queryConditions">
        <p>发送结果</p>
        <el-select class="width200px" v-model="senderState" clearable>
          <el-option value="0" label="未发送"></el-option>
          <el-option value="1" label="已发送"></el-option>
          <!-- <el-option value="2" label="发送失败"></el-option> -->
        </el-select>
      </div>
      <div class="butBox">
        <el-button class="margin-left20" type="text" @click="showOrHide">{{hidden?'高级筛选':'收起'}}</el-button>
        <el-button class="margin-left50" @click="onSearch" plain type="primary">查询</el-button>
        <el-button class="margin-left50" @click="exportFile" type="primary">导出</el-button>
        <el-button class="margin-left50" @click="setSpotCheck" type="info">随机抽查</el-button>
      </div>
    </div>

    <el-table :data="planRecordList" border style="width: 100%;margin-bottom: 60px;">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="patientName" label="姓名" width="90"></el-table-column>
      <el-table-column prop="sex" label="性别" width="50"></el-table-column>
      <el-table-column prop="age" label="年龄" width="50"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="deptName" label="随访科室/病区"></el-table-column>
      <el-table-column prop="flupPlan" label="随访/慢病计划"></el-table-column>
      <el-table-column prop="flupType" label="随访类型"></el-table-column>
      <el-table-column prop="flupContent" label="随访内容"></el-table-column>
      <el-table-column prop="fuGroup" label="随访/慢病组"></el-table-column>
      <el-table-column prop="doctorName" label="随访/慢病人员"></el-table-column>
      <el-table-column prop="recordDatetime" label="记录时间"></el-table-column>
      <el-table-column prop="flupDatetime" label="任务开始日期"></el-table-column>
      <el-table-column prop="flupState" label="任务状态">
        <template slot-scope="scope">
          <span v-if="scope.row.flupType == '定期检查' ||scope.row.flupType == '定期检验'||scope.row.flupType == '慢病评估报告'">
            <span v-if="scope.row.authState ==30">已作废</span>
            <span v-else>{{scope.row.flupState}}</span>
          </span>
          <span v-else>{{scope.row.flupState}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送结果" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.senderState ==0 || scope.row.flupType=='专科随访'">未发送</span>
          <span v-else-if="scope.row.senderState ==1">已发送</span>
          <!-- 暂无发送失败状态 -->
          <!-- <span style="color:red" v-else-if="scope.row.senderState ==2">发送失败</span> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="push(scope.row)">查看</el-button>
          <!-- <el-button
            v-if="scope.row.flupType=='健康宣教'||scope.row.flupType=='调查问卷'"
            :disabled="scope.row.flupStateId =='Finished' || scope.row.flupStateId =='SentButNoReply'"
            type="text"
            @click="onReSend(scope.row)"
          >重发（{{scope.row.sendTimes }}）次</el-button>-->
        </template>
      </el-table-column>
      <el-table-column prop="appointmentTime" label="预约时间"></el-table-column>
      <el-table-column prop="remark2" label="备注"></el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 30, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page.sync="pageNo"
      :page-size="pageSize"
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>
    <el-dialog title="配置随访比例" :visible.sync="spotCheck" width="450px" :close-on-click-modal="false" :close-on-press-esc="false">
      <div class="spotCheckBox">
        <br />
        <div>
          <el-radio v-model="spotCheckType" :label="0" @change="spotCheckNumber = 10">全部随访</el-radio>
        </div>
        <br />
        <div>
          <el-radio v-model="spotCheckType" :label="1" @change="spotCheckNumber = 10">按人数随机抽查</el-radio>
          <el-input v-show="spotCheckType == 1" style="width: 210px;margin-right: 0" placeholder="请输入抽查人数比例" v-model="spotCheckNumber" v-numberSign @input="setSpotCheckNumber">
            <template slot="append">%</template>
          </el-input>
        </div>
        <br />
        <div>
          <el-radio v-model="spotCheckType" :label="2" @change="spotCheckNumber = 10">按比例随机抽查</el-radio>
          <el-input v-show="spotCheckType == 2" style="width: 210px;margin-right: 0" placeholder="请输入随访比例" v-model="spotCheckNumber" v-numberSign @input="setSpotCheckNumber">
            <template slot="append">%</template>
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="spotCheck = false">取 消</el-button>
        <el-button type="primary" @click="getSpotCheckList">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="抽查列表" :visible.sync="showSpotCheckList" width="80%" :close-on-click-modal="false" :close-on-press-esc="false">
      <div>
        <el-table :data="spotCheckList" border style="width: 100%" max-height="500">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="patientName" label="姓名" width="90"></el-table-column>
          <el-table-column prop="sex" label="性别" width="50"></el-table-column>
          <el-table-column prop="age" label="年龄" width="50"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
          <el-table-column prop="deptName" label="随访科室/病区"></el-table-column>
          <el-table-column prop="flupPlan" label="随访/慢病计划"></el-table-column>
          <el-table-column prop="flupType" label="随访类型"></el-table-column>
          <el-table-column prop="fuGroup" label="随访/慢病组"></el-table-column>
          <el-table-column prop="doctorName" label="随访/慢管医生"></el-table-column>
          <el-table-column prop="recordDatetime" label="记录时间"></el-table-column>
          <el-table-column prop="flupDatetime" label="任务开始日期"></el-table-column>
          <el-table-column prop="flupState" label="任务状态"></el-table-column>
          <el-table-column label="发送结果" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.senderState ==0 || scope.row.flupType=='专科随访'">未发送</span>
              <span v-else-if="scope.row.senderState ==1">已发送</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="showSpotCheckList = false">取 消</el-button>
        <el-button type="primary" @click="showSpotCheckList = false">确 定</el-button>
      </span>-->
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    return {
      allFlupPlanList: [],
      timeKeyList: [
        { label: '任务开始日期', value: 'flupDatetime' },
        { label: '记录时间', value: 'recordDatetime' },
      ],
      searchKeyList: [
        { label: '姓名', value: 'patientName' },
        { label: '电话', value: 'phone' },
        { label: '随访/慢管医生', value: 'doctorName' },
      ],
      stateList: [],
      list: [],
      deptList: [],
      groupList: [],
      followupTypeList: [],
      memberList: [],
      planRecordList: [],
      groupId: null,
      value: null,
      hidden: true,
      currentPage4: 4,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      flupPlanId: null,
      deptId: null,
      searchTimeKey: 'flupDatetime',
      searchTimeValue: null,
      searchKey: 'patientName',
      searchValue: null,
      flupType: null,
      flupGroup: null,
      groupMember: null,
      flupState: null,
      senderState: null,
      spotCheck: false,
      spotCheckType: 1,
      spotCheckNumber: 10,
      showSpotCheckList: false,
      spotCheckList: null,
    };
  },
  created() {
    this.$apis
      .getAllFlupPlan({
        isAll: 1,
      })
      .then((res) => {
        this.allFlupPlanList = res;
      });

    this.$apis
      .systemManagequeryCurrentUserDept({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.deptList = res;
      });
    this.$apis
      .groupgetFlupGroupList({
        hospitalId: this.$global.hospital_id,
        pageNo: 0,
      })
      .then((res) => {
        this.groupList = res.list;
      });
    this.$apis
      .getFollowupTypeList({
        hospitalId: this.$global.hospital_id,
        pageNo: 0,
      })
      .then((res) => {
        this.followupTypeList = res.list.filter((item) => {
          return item.enable != 0;
        });
      });
    this.$apis
      .queryDictByCode({
        grandParentDictCode: 'Flup',
        parentDictCode: 'SmartFlupStatus',
      })
      .then((res) => {
        this.stateList = res.map((item) => {
          return {
            label: item.dictName,
            value: item.dictCode,
          };
        });
      });
    this.getgetPatientPlanRecord();
  },
  computed: {},
  watch: {},
  methods: {
    setSpotCheckNumber() {
      if (this.spotCheckNumber != '') {
        if (this.spotCheckNumber > 100) {
          this.spotCheckNumber = 100;
        } else if (this.spotCheckNumber < 1) {
          this.spotCheckNumber = 1;
        }
      }
    },
    getSpotCheckList() {
      this.spotCheck = false;
      this.$apis
        .spotCheckPatientPlanRecord({
          hospitalId: this.$global.hospital_id,
          deptId: this.deptId,
          flupGroupId: null,
          flupTaskType: null,
          flupPlanId: this.flupPlanId,
          searchTimeKey: this.searchTimeKey,
          searchTimeValue: this.searchTimeValue,
          spotCheckType: this.spotCheckType,
          spotCheckNumber: this.spotCheckNumber,
        })
        .then((res) => {
          this.spotCheckList = res;
          this.showSpotCheckList = true;
        });
    },
    setSpotCheck() {
      this.$alert('随访抽查对象主要是对已完成随访的任务做抽查回访!', '温馨提示', {
        confirmButtonText: '我知道了',
        callback: (action) => {
          if (action == 'confirm') {
            this.spotCheck = true;
          }
        },
      });
    },
    onReSend(row) {
      this.$apis
        .reSendFlupPlanTask({
          serialNo: row.serialNo,
        })
        .then((res) => {
          row.sendTimes++;
          if (res) {
            this.$message({
              type: 'success',
              message: '重发成功',
            });
            this.getgetPatientPlanRecord();
          }
        });
    },
    getmemberList() {
      this.groupMember = null;
      this.memberList = [];
      this.$apis
        .groupgetFlupGroupMembersByGroupId({
          groupId: this.flupGroup,
          hospitalId: this.$global.hospital_id,
          pageNo: 0,
        })
        .then((res) => {
          this.memberList = res.list;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getgetPatientPlanRecord();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getgetPatientPlanRecord();
    },
    onSearch() {
      this.pageNo = 1;
      this.getgetPatientPlanRecord();
    },
    showOrHide() {
      this.hidden = !this.hidden;
    },
    getgetPatientPlanRecord() {
      // console.log(this.flupType.join(','));
      let searchTimeValue = null;
      if (this.searchTimeValue) {
        searchTimeValue = this.searchTimeValue.join(',');
      }
      this.$apis
        .getPatientPlanRecord({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          flupPlanId: this.flupPlanId,
          deptId: this.deptId,
          searchTimeKey: this.searchTimeKey,
          searchTimeValue: searchTimeValue,
          searchKey: this.searchKey,
          searchValue: this.searchValue,
          flupType: this.flupType ? this.flupType.join(',') : '',
          flupGroup: this.flupGroup,
          groupMember: this.groupMember,
          flupState: this.flupState,
          senderState: this.senderState,
        })
        .then((res) => {
          this.planRecordList = res.list;
          this.total = res.total;
        });
    },
    push(row) {
      // console.log(row)
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
            }&dateTime=${this.$utils.formatDate(row.createDatetime)}
             &recordSerialNo=${row.recordSerialNo}
            &joinPlanPatientType=${row.patientTypeCode}&flupPlanId=${row.flupPlan}&conceal=${row.planType == 0 ? true : false}&anchorPoint=${row.serialNo}&flupType=${
              row.flupType
            }&token=${this.$route.query.token}`,
          title: '健康档案',
        }),
        '*'
      );
      // console.log(
      //   urlx +
      //     `#/healtharchives?userId=${row.userId}&name=${row.patientName}&sex=${
      //       row.sex
      //     }&age=${this.$utils.getAge(row.dateOfBirth)}&phone=${
      //       row.phone
      //     }&dateTime=${this.$utils.formatDate(row.createDatetime)}
      //        &recordSerialNo=${row.recordSerialNo}
      //       &joinPlanPatientType=${
      //         this.patientType ? this.patientType : this.joinPlanPatientType
      //       }&flupPlanId=${row.flupPlan}&conceal=${
      //       row.planType == 0 ? true : false
      //     }&anchorPoint=${row.serialNo}&flupType=${row.flupType}&token=${
      //       this.$route.query.token
      //     }`
      // )
    },
    exportFile() {
      let searchTimeValue = null;
      if (this.searchTimeValue) {
        searchTimeValue = this.searchTimeValue.join(',');
      }
      let query = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        flupPlanId: this.flupPlanId,
        deptId: this.deptId,
        searchTimeKey: this.searchTimeKey,
        searchTimeValue: searchTimeValue,
        searchKey: this.searchKey,
        searchValue: this.searchValue,
        flupType: this.flupType ? this.flupType.join(',') : '',
        flupGroup: this.flupGroup,
        groupMember: this.groupMember,
        flupState: this.flupState,
        senderState: this.senderState,
        hospitalId: this.$global.hospital_id,
      };
      location.href =
        this.$baseURL.ICDMApiUrl +
        '/b/flupPatientPlan/exportPatientPlanRecordReport?' +
        this.$qs.stringify({
          ...query,
        });
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
  .spotCheckBox {
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>