<template>
  <section class="margin-top20 margin-bottom40 inspect">
    <el-row type="flex" justify="space-between" align="middle">
      <div class="title">检验</div>
      <div>
        <el-button type="primary" plain :disabled="$route.name == 'rulesWarehouse'||sourceType==1" @click="onAdd">新 增</el-button>
        <el-button type="warning" plain :disabled="$route.name == 'rulesWarehouse'||sourceType==1" @click="copy">复 制</el-button>
      </div>
    </el-row>
    <el-table style="margin-top: 10px;" class="rules-table" :data="mainList" stripe border>
      <el-table-column width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip label="检验名称">
        <template slot-scope="scope">
          <el-select v-if="scope.$index==editIndex" v-model="editRow.examItem" filterable @change="switchItem">
            <el-option v-for="(item,index) in inspectionNameList" :key="index" :label="item.ylmc" :value="item.ylmc"></el-option>
          </el-select>
          <span v-else>{{scope.row.examItem}}</span>
        </template>
      </el-table-column>
      <el-table-column label="样本类型">
        <template slot-scope="scope">
          <el-select v-if="scope.$index==editIndex" v-model="editRow.examType" filterable @change="switchType">
            <el-option v-for="(item,index) in inspectionTypeList" :key="index" :label="item.sampledescribe" :value="item.sampledescribe"></el-option>
          </el-select>
          <div v-else>{{scope.row.examType}}</div>
        </template>
      </el-table-column>
      <el-table-column label="有效天数">
        <template slot="header" slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="有效天数为0时任务永久有效" placement="top">
            <div>
              有效天数
              <span class="tips">?</span>
            </div>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-input-number v-if="scope.$index==editIndex" v-model="editRow.validDate" :min="0" :max="999" controls-position="right"></el-input-number>
          <div v-else>{{scope.row.validDate}}</div>
        </template>
      </el-table-column>
      <el-table-column label="随访途径">
        <template slot-scope="scope">
          <el-select v-if="scope.$index==editIndex" v-model="editRow.followupPathway" @change="switchFollowupWay">
            <el-option v-for="item in followupWayList" :key="item.dict_name" :label="item.dict_name" :value="item.dict_name" :disabled="item.dict_name!=='微信'"></el-option>
          </el-select>
          <div v-else>{{scope.row.followupPathway}}</div>
          <!-- <div v-if="scope.$index==editIndex">
              <el-button @click="onCancel">取消</el-button>
              <el-button type="primary" @click="onConfirm(scope.$index)">确定</el-button>
          </div>-->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div v-if="scope.$index==editIndex && editSattus!=='none'">
            <el-button @click="onCancel" :disabled="$route.name == 'rulesWarehouse'||sourceType==1" type="text">撤销</el-button>
            <el-button type="text" :disabled="$route.name == 'rulesWarehouse'||sourceType==1" @click="onConfirm(scope.$index)">确定</el-button>
          </div>
          <div v-else>
            <el-button type="text" :disabled="$route.name == 'rulesWarehouse'||sourceType==1" @click="onEdit(scope.$index)">编辑</el-button>
            <el-button type="text" :disabled="$route.name == 'rulesWarehouse'||sourceType==1" @click="onDelete(scope.$index,scope.row)">删除</el-button>
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
      mainList: [],
      editRow: {
        examType: '',
        examItem: '',
        validDate: 2,
        followupPathway: '',
      },
      editIndex: -1,
      editSattus: 'none',
      inspectionNameList: [],
      inspectionTypeList: [],
      followupWayList: [],
    };
  },
  props: {
    data: Array,
    sourceType: Number,
  },
  computed: {
    type() {
      return this.$route.params.type === 'specialist' ? 1 : 0;
    },
  },
  watch: {
    data: {
      handler() {
        if (this.data) {
          this.data.forEach((element) => {
            let n = element.fuContent.split('|');
            element.examItem = n[0];
            element.examItemCode = n[1];
            element.examType = n[2];
            element.examTypeCode = n[3];
          });
        }
        this.mainList = this.data;
      },
      immediate: true,
    },
  },
  created() {
    if (this.$route.name == 'rulesWarehouse') {
      return;
    }
    this.getInspectionNameList();
    this.getInspectionTypeList();
    this.$apis
      .BaseDictGetEnableDictItems({
        parentId: '2019051518541847339f',
      })
      .then((res) => {
        this.followupWayList = res;
        this.followupWayList.forEach((item) => {
          this.$set(item, 'disabled', true);
        });
      });
  },
  methods: {
    getInspectionNameList(query) {
      this.$apis
        .ExaminegetExamineList({
          examineName: query || '',
        })
        .then((res) => {
          this.inspectionNameList = res && res.list;
        });
    },
    getInspectionTypeList(query) {
      this.$apis
        .ExaminegetSampleList({
          sampleName: query || '',
        })
        .then((res) => {
          this.inspectionTypeList = res && res.list;
        });
    },
    switchFollowupWay(val) {
      let itemobj = this.followupWayList.find((value, index, item) => {
        return value.dict_name == val;
      });
      this.editRow.followupPathwayId = itemobj.dict_code;
    },
    onEdit(index) {
      if (
        this.editSattus !== 'none' ||
        (this.$parent.$parent.$refs.cancel1 ? this.$parent.$parent.$refs.cancel1.editSattus !== 'none' : false) ||
        (this.$parent.$parent.$refs.cancel2 ? this.$parent.$parent.$refs.cancel2.editSattus !== 'none' : false) ||
        (this.$parent.$parent.$refs.cancel4 ? this.$parent.$parent.$refs.cancel4.isSave !==true : false)
      ) {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!',
        });
        return;
      }
      this.editSattus = 'edit';
      this.editIndex = index;
      this.editRow = { ...this.mainList[index] };
    },
    async onDelete(index, row) {
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
      })
        .then(() => {
          if (this.data.length <= 1) {
            this.$apis.flupPathdelFlupPath(row.serialNo).then(() => {
              this.$parent.$parent.getPathList();
            });
          } else {
            let objx = false;
            this.$apis
              .flupPathsaveFlupPath({
                ...this.$utils.regressList(objx, this.data, index),
              })
              .then(() => {
                this.$parent.$parent.getPathList();
                this.editSattus = 'none';
                this.$set(this.mainList, index, this.editRow);
                this.editIndex = -1;
              });
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    onAdd() {
      if (
        this.editSattus !== 'none' ||
        (this.$parent.$parent.$refs.cancel1 ? this.$parent.$parent.$refs.cancel1.editSattus !== 'none' : false) ||
        (this.$parent.$parent.$refs.cancel2 ? this.$parent.$parent.$refs.cancel2.editSattus !== 'none' : false) ||
        (this.$parent.$parent.$refs.cancel4 ? this.$parent.$parent.$refs.cancel4.isSave !==true : false)
      ) {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!',
        });
        return;
      }
      this.editRow = {
        examType: '',
        examItem: '',
        validDate: 2,
        followupPathway: '',
      };
      this.editSattus = 'add';
      this.mainList.push({});
      this.editIndex = this.mainList.length - 1;
    },
    switchType(val) {
      let typeID = this.inspectionTypeList.find((item) => {
        return item.sampledescribe == val;
      }).autoid;
      this.editRow.examTypeCode = typeID;
    },
    switchItem(val) {
      let itemID = this.inspectionNameList.find((item) => {
        return item.ylmc == val;
      }).autoid;
      this.editRow.examItemCode = itemID;
    },
    onCancel() {
      if (this.editSattus === 'add') {
        this.mainList.splice(this.mainList.length - 1, 1);
        this.editSattus = 'none';
      }
      this.editIndex = -1;
      this.editSattus = 'none';
    },
    onConfirm(index) {
      if (!this.editRow.examType) {
        this.$message({
          type: 'warning',
          message: '请选择样本类型',
        });
        return;
      } else if (!this.editRow.examItem) {
        this.$message({
          type: 'warning',
          message: '请输入检验名称',
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
      //  else if (!this.editRow.validDate) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请输入有效天数',
      //   });
      //   return;
      // }
      let element = this.editRow;
      let flup_content = `${element.examItem}|${element.examItemCode}|${element.examType}|${element.examTypeCode}`;
      this.editRow.fuContent = flup_content;
      const model1 = {
        fuInterval: 1,
        fuPeriod: 0,
        fuNumber: 1,
        //  "checkItems": null,
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
        fuContent: flup_content,
        fuType: '定期检验',
      };
      let objx = {
        ...model1,
        ...this.editRow,
        ...model2,
      };

      this.$apis
        .flupPathsaveFlupPath({
          ...this.$utils.regressList(objx, this.data, this.editIndex),
          patientTypeCode: obj.patientTypeCode,
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
      this.$emit('getList', 3);
      // this.$parent.$parent.copyFlag = 3;
      // this.$parent.$parent.copyDialog = true;
    },
  },
};
</script>