<template>
  <section class="margin-top20">
    <el-row type="flex" justify="space-between" align="middle">
      <div class="title">处方路径</div>
      <div>
        <el-button type="primary" @click="onAdd">新 增</el-button>
        <el-button type="warning" @click="copy">复 制</el-button>
      </div>
    </el-row>
    <el-table style="margin-top: 10px;" class="rules-table" :data="mainList" stripe border>
      <el-table-column width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip label="随访类型">
        <template slot-scope="scope">
          <div v-if="scope.$index == editIndex">{{editRow.fuType}}</div>
          <div v-else>{{scope.row.fuType}}</div>
        </template>
      </el-table-column>
      <el-table-column label="随访内容">
        <template slot-scope="scope">
          <el-select v-if="scope.$index == editIndex" v-model="editRow.fuContent" @change="switchFollowupContent($event, true)">
            <el-option v-for="(item, i) in contentList" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
          <div v-else>{{ scope.row.fuContent }}</div>
        </template>
      </el-table-column>
      <el-table-column label="有效天数">
        <template slot-scope="scope">
          <el-input-number v-if="scope.$index == editIndex" v-model="editRow.validDate" :min="0" :max="999" controls-position="right"></el-input-number>
          <div v-else>{{ scope.row.validDate }}</div>
        </template>
      </el-table-column>
      <el-table-column label="随访路径">
        <template slot-scope="scope">
          <el-select v-if="scope.$index == editIndex" v-model="editRow.followupPathway" @change="switchFollowupWay">
            <el-option v-for="item in followupWayList" :key="item.dict_name" :label="item.dict_name" :value="item.dict_name" :disabled="item.disabled"></el-option>
          </el-select>
          <div v-else>{{ scope.row.followupPathway }}</div>
          <!-- <div v-if="scope.$index==editIndex">
              <el-button @click="onCancel">取消</el-button>
              <el-button type="primary" @click="onConfirm(scope.$index)">确定</el-button>
          </div>-->
        </template>
      </el-table-column>
      <!-- <el-table-column label="周期性随访">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.$index == editIndex"
            v-model="editRow.fuPeriod"
            :active-value="1"
            :inactive-value="0"
            :key="scope.row.serialNo"
          ></el-switch>
          <el-switch
            v-else
            v-model="scope.row.fuPeriod"
            :disabled="true"
            :active-value="1"
            :inactive-value="0"
            :key="scope.row.serialNo"
          ></el-switch>
          <div v-if="editRow.fuPeriod == '1' && scope.$index == editIndex">
            <span>随访间隔(天)：</span>
            <br />
            <el-input-number v-model="editRow.fuInterval" :min="0" size="small" label="随访间隔(天)"></el-input-number>
            <br />
            <span>循环次数：</span>
            <br />
            <el-input-number v-model="editRow.fuNumber" :min="1" size="small" label="循环次数："></el-input-number>
          </div>
        </template>
      </el-table-column>-->
      <el-table-column prop="createTime" label="操作">
        <template slot-scope="scope">
          <div v-if="scope.$index == editIndex && editSattus !== 'none'">
            <el-button @click="onCancel" type="text">撤销</el-button>
            <el-button type="text" @click="onConfirm(scope.$index)">确定</el-button>
          </div>
          <div v-else>
            <el-button type="text" @click="onEdit(scope.$index)">编辑</el-button>
            <el-button type="text" @click="onDelete(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      contentList: [
        { name: '提醒模板1', value: 'content1' },
        { name: '提醒模板2', value: 'content1' },
      ],
      mainList: [],
      followupTypeList: [],
      followupContentList: [],
      editRow: {
        fuType: '处方提醒',
        fuContent: '',
        fuContentId: '',
        validDate: 2,
        followupPathway: '',
        fuPeriod: 0,
        fuInterval: 0,
        fuNumber: 1,
      },
      followupWayList: [],
      editIndex: -1,
      editSattus: 'none',
      show: false,
      deptList: [],
      hospitalId: null,
      reportList: [],
      diseaseReportId: '',
      diseaseReport: '',
      isPeriod: false,
    };
  },
  props: {
    data: Array,
  },
  computed: {
    type() {
      if (this.$route.params.type === 'specialist') {
        return 1;
      } else if (this.$route.params.type === 'whole') {
        return 0;
      } else if (this.$route.params.type === 'icdm') {
        return 2;
      }
    },
  },
  watch: {
    data: {
      handler() {
        this.mainList = this.data ? this.data : [];
      },
      immediate: true,
    },
  },
  created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id;
    if (this.$route.name == 'rulesWarehouse') {
      return;
    }
    this.$apis
      .flupTypequeryFollowTypeList({
        keyWord: '',
        enable: this.type,
        hospitalId: this.hospitalId,
      })
      .then((res) => {
        this.followupTypeList = res.list.filter((item) => {
          if (this.$route.params.type == 'whole' || this.$route.params.type == 'specialist') {
            return item.name !== '定期检查' && item.name !== '定期检验' && item.name !== '慢病评估报告';
          } else {
            return item.name !== '定期检查' && item.name !== '定期检验';
          }
        });
      });
    this.$apis
      .BaseDictGetDictItems({
        parentId: '2019051518541847339f',
      })
      .then((res) => {
        this.followupWayList = res;
        this.followupWayList.forEach((item) => {
          this.$set(item, 'disabled', true);
        });
      });
    this.$apis.systemManagequeryCurrentUserDept().then((res) => {
      this.deptList = res;
    });
  },
  methods: {
    onEdit(index) {
      var singal =
        this.$route.params.type == 'whole'
          ? this.editSattus !== 'none' || this.$parent.$parent.$refs.cancel1.editSattus !== 'none'
          : this.editSattus !== 'none' ||
            (this.$parent.$parent.$refs.cancel1 ? this.$parent.$parent.$refs.cancel1.editSattus !== 'none' : false) ||
            (this.$parent.$parent.$refs.cancel2 ? this.$parent.$parent.$refs.cancel2.editSattus !== 'none' : false) ||
            (this.$parent.$parent.$refs.cancel3 ? this.$parent.$parent.$refs.cancel3.editSattus !== 'none' : false);
      if (singal) {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!',
        });
        return;
      }
      this.editSattus = 'edit';
      this.editIndex = index;
      this.editRow = { ...this.mainList[index] };
      this.$apis
        .flupPathqueryFollowUpContent({
          name: this.editRow.fuType,
          hospitalId: this.hospitalId,
        })
        .then((res) => {
          this.followupContentList = res;
          if (this.editRow.fuType == '慢病评估报告') {
            //慢病报告与风险评估报告存在一个字段
            //故编辑时在此做分割
            var ids = this.editRow.fuContentId.split('|');
            if (ids.length > 0) {
              var names = this.editRow.fuContent.split('|');
              this.editRow.fuContentId = ids[0];
              this.editRow.fuContent = names[0];
              this.diseaseReportId = ids[1];
              this.diseaseReport = names[1];
              this.switchFollowupContent(this.editRow.fuContent, false);
            }
          } else if (this.editRow.fuType == '定期复诊') {
            // 科室与内容存在相同字段
            var contents = this.editRow.fuContent.split('|');
            if (contents.length > 0) {
              this.editRow.fuContent = contents[1];
            }
          }
        });
      this.getWayDisable();
    },
    async onDelete(row) {
      if (this.editSattus !== 'none') {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!',
        });
        return;
      }
      await this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      this.$apis.flupPathdelFlupPath(row.serialNo).then(() => {
        this.$parent.$parent.getPathList();
      });
    },
    onAdd() {
      var singal =
        this.$route.params.type == 'whole'
          ? this.editSattus !== 'none' || this.$parent.$parent.$refs.cancel1.editSattus !== 'none'
          : this.editSattus !== 'none' ||
            (this.$parent.$parent.$refs.cancel1 ? this.$parent.$parent.$refs.cancel1.editSattus !== 'none' : false) ||
            (this.$parent.$parent.$refs.cancel2 ? this.$parent.$parent.$refs.cancel2.editSattus !== 'none' : false) ||
            (this.$parent.$parent.$refs.cancel3 ? this.$parent.$parent.$refs.cancel3.editSattus !== 'none' : false);
      if (singal) {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!',
        });
        return;
      }
      this.editRow = {
        fuType: '处方提醒',
        fuContent: '',
        fuContentId: '',
        validDate: 2,
        followupPathway: '',
        fuPeriod: 0,
        fuInterval: 0,
        fuNumber: 1,
      };
      this.editSattus = 'add';
      this.mainList.push({});
      this.editIndex = this.mainList.length - 1;
      this.getWayDisable();
    },
    switchFollowupType(val) {
      this.editRow.fuContent = '';
      this.editRow.fuContentId = '';
      this.editRow.followupPathway = '';
      this.diseaseReportId = '';
      this.diseaseReport = '';
      this.reportList = '';
      this.$apis
        .flupPathqueryFollowUpContent({
          name: val,
          hospitalId: this.hospitalId,
        })
        .then((res) => {
          this.followupContentList = res;
        });
      this.getWayDisable();
    },
    getWayDisable() {
      this.followupWayList.forEach((element) => {
        if (element.dict_name == '电话') {
          element.disabled = true;
        } else if (element.dict_name == '微信') {
          element.disabled = false;
        }
      });
    },
    switchFollowupContent(val, isClean) {
      if (this.editRow.fuType == '定期复诊') {
        // let itemobj = this.deptList.find((value, index, item) => {
        //   return value.Text == val;
        // });
        // this.editRow.fuContentId = itemobj.Value;
      } else {
        let itemobj = this.followupContentList.find((value, index, item) => {
          return value.questionnaireName == val;
        });
        this.editRow.fuContentId = itemobj.serialNo;

        //加载风险评估报告数据源
        if (this.editRow.fuType == '慢病评估报告') {
          if (isClean) {
            this.diseaseReportId = '';
            this.diseaseReport = '';
            this.reportList = '';
          }
          var item = JSON.parse(itemobj.content).modules[2];
          if (item.status && item.fields.length > 0) {
            this.reportList = item.fields;
            this.diseaseReportId = this.diseaseReportId ? this.diseaseReportId : this.reportList[0].id;
            this.diseaseReport = this.diseaseReport ? this.diseaseReport : this.reportList[0].name;
          }
        }
      }
    },
    switchFollowupWay(val) {
      let itemobj = this.followupWayList.find((value, index, item) => {
        return value.dict_name == val;
      });
      this.editRow.followupPathwayId = itemobj.dict_code;
    },
    onCancel() {
      if (this.editSattus === 'add') {
        this.mainList.splice(this.mainList.length - 1, 1);
      }
      this.editSattus = 'none';
      this.editIndex = -1;
    },
    onConfirm(index) {
      if (!this.editRow.fuType) {
        this.$message({
          type: 'warning',
          message: '请选择随访类型',
        });
        return;
      } else if (!this.editRow.fuContent) {
        this.$message({
          type: 'warning',
          message: '请选择随访内容',
        });
        return;
      } else if (!this.editRow.validDate && this.editRow.validDate != 0) {
        this.$message({
          type: 'warning',
          message: '请输入有效天数',
        });
        return;
      } else if (!this.editRow.followupPathway) {
        this.$message({
          type: 'warning',
          message: '请选择随访途径',
        });
        return;
      }
      const model1 = {
        flupInterval: 1,
        fuPeriod: 0,
        fuNumber: 1,
        checkItems: null,
      };
      let obj = this.$parent.$parent.tabs.find((item) => {
        return this.$parent.$parent.active == item.id;
      });
      const model2 = {
        flupRuleId: obj.flupRuleId,
        interventionBenchmark: obj.interventionBenchmark,
        interventionDay: obj.interventionDay,
        executeUnit: obj.executeUnit,
        flupTimeconfigId: obj.id,
      };
      this.$apis
        .flupPathsaveFlupPath({
          ...model1,
          ...this.editRow,
          ...model2,
          hospitalId: this.hospitalId,
        })
        .then(() => {
          this.$parent.$parent.getPathList();
          this.editSattus = 'none';
          this.$set(this.mainList, index, this.editRow);
          this.editIndex = -1;
        });
    },
    copy() {
      if (this.editSattus !== 'none') {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!',
        });
        return;
      }
      this.$emit('getList', 4);
      // this.$parent.$parent.copyFlag = 4
      // this.$parent.$parent.copyDialog = true
    },
    changeDiseaseReport() {
      let itemobj = this.reportList.find((value, index, item) => {
        return value.id == this.diseaseReportId;
      });
      this.diseaseReport = itemobj.name;
    },
  },
};
</script>