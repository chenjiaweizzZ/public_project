<template>
  <section class="margin-top20 check">
    <el-row type="flex" justify="space-between" align="middle">
      <div class="title">检查</div>
      <div>
        <el-button type="primary" plain :disabled="$route.name == 'rulesWarehouse'||sourceType==1" @click="onAdd">新 增</el-button>
        <el-button type="warning" plain :disabled="$route.name == 'rulesWarehouse'||sourceType==1" @click="copy">复 制</el-button>
      </div>
    </el-row>
    <el-table style="margin-top: 10px;" class="rules-table" :data="mainList" stripe border>
      <el-table-column width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip label="检查内容">
        <template slot-scope="scope">
          <el-select v-if="scope.$index==editIndex" v-model="editRow.checkType" filterable @change="switchType">
            <el-option v-for="item in checkTypeList" :key="item.examTypeName" :label="item.examTypeName" :value="item.examTypeName"></el-option>
          </el-select>
          <div v-else>{{scope.row.checkType}}</div>
        </template>
      </el-table-column>
      <el-table-column label="检查部位">
        <template slot-scope="scope">
          <el-select v-if="scope.$index==editIndex" v-model="editRow.checkPart" filterable @change="switchPart">
            <el-option v-for="item in checkPartList" :key="item.examBodyName" :label="item.examBodyName" :value="item.examBodyName"></el-option>
          </el-select>
          <div v-else>{{scope.row.checkPart}}</div>
        </template>
      </el-table-column>
      <el-table-column label="检查项目">
        <template slot-scope="scope">
          <el-select v-if="scope.$index==editIndex" v-model="editRow.checkItem" filterable @change="switchItem">
            <el-option v-for="item in checkItemList" :key="item.examItemName" :label="item.examItemName" :value="item.examItemName"></el-option>
          </el-select>
          <div v-else>{{scope.row.checkItem}}</div>
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
            <el-button :disabled="$route.name == 'rulesWarehouse'||sourceType==1" @click="onCancel" type="text">撤销</el-button>
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
        checkType: '',
        checkItem: '',
        checkPart: '',
        validDate: 2,
        followupPathway: '',
      },
      editIndex: -1,
      editSattus: 'none',
      checkTypeList: [],
      checkItemList: [],
      checkPartList: [],
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
            element.checkType = n[0];
            element.checkTypeCode = n[1];
            element.checkPart = n[2];
            element.checkPartCode = n[3];
            element.checkItem = n[4];
            element.checkItemCode = n[5];
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
    this.$apis.ExaminegetCheckTypeList().then((res) => {
      this.checkTypeList = res.examTypeList;
    });
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
        (this.$parent.$parent.$refs.cancel3 ? this.$parent.$parent.$refs.cancel3.editSattus !== 'none' : false) ||
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
      this.$apis
        .ExaminegetCheckPartsList({
          examTypeId: this.editRow.checkTypeCode,
        })
        .then((res) => {
          this.checkPartList = res.examBodyInfoList;
        });
      this.$apis
        .ExaminegetCheckItemList({
          examItemLike: '',
          examBodyId: this.editRow.checkPartCode,
        })
        .then((res) => {
          this.checkItemList = res.examItemInfos;
        });
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
        (this.$parent.$parent.$refs.cancel3 ? this.$parent.$parent.$refs.cancel3.editSattus !== 'none' : false) ||
        (this.$parent.$parent.$refs.cancel4 ? this.$parent.$parent.$refs.cancel4.isSave !==true : false)
      ) {
        this.$message({
          type: 'warning',
          message: '请保存后再编辑!',
        });
        return;
      }
      this.editRow = {
        checkType: '',
        checkItem: '',
        checkPart: '',
        validDate: 2,
        followupPathway: '',
      };
      this.editSattus = 'add';
      this.mainList.push({});
      this.editIndex = this.mainList.length - 1;
    },
    switchType(val) {
      this.editRow.checkItem = '';
      this.editRow.checkPart = '';
      this.editRow.checkItemCode = '';
      this.editRow.checkPartCode = '';
      console.log(this.checkTypeList);
      let typeID = this.checkTypeList.find((item) => {
        return item.examTypeName == val;
      }).examTypeId;
      this.editRow.checkTypeCode = typeID;
      this.$apis
        .ExaminegetCheckPartsList({
          examTypeId: typeID,
        })
        .then((res) => {
          this.checkPartList = res.examBodyInfoList;
        });
    },
    switchPart(val) {
      this.editRow.checkItem = '';
      this.editRow.checkItemCode = '';
      let bodyID = this.checkPartList.find((item) => {
        return item.examBodyName == val;
      }).examBodyId;
      this.editRow.checkPartCode = bodyID;
      this.$apis
        .ExaminegetCheckItemList({
          examItemLike: '',
          examBodyId: bodyID,
        })
        .then((res) => {
          this.checkItemList = res.examItemInfos;
        });
    },
    switchItem(val) {
      let itemID = this.checkItemList.find((item) => {
        return item.examItemName == val;
      }).examItemId;
      this.editRow.checkItemCode = itemID;
    },
    onCancel() {
      if (this.editSattus === 'add') {
        this.mainList.splice(this.mainList.length - 1, 1);
        this.editSattus = 'none';
      }
      console.log(this.mainList);
      this.editIndex = -1;
      this.editSattus = 'none';
    },
    onConfirm(index) {
      if (!this.editRow.checkType) {
        this.$message({
          type: 'warning',
          message: '请选择检查内容',
        });
        return;
      } else if (!this.editRow.checkPart) {
        this.$message({
          type: 'warning',
          message: '请选择检查部位',
        });
        return;
      } else if (!this.editRow.followupPathway) {
        this.$message({
          type: 'warning',
          message: '请选择随访路径',
        });
        return;
      } else if (!this.editRow.checkItem) {
        this.$message({
          type: 'warning',
          message: '请输入检查项目',
        });
        return;
      } else if (!this.editRow.validDate && this.editRow.validDate != 0) {
        this.$message({
          type: 'warning',
          message: '请输入有效天数',
        });
        return;
      }
      let element = this.editRow;
      let flup_content = `${element.checkType}|${element.checkTypeCode}|${element.checkPart}|${element.checkPartCode}|${element.checkItem}|${element.checkItemCode}`;
      this.editRow.fuContent = flup_content;

      const model1 = {
        fuInterval: 1,
        fuPeriod: 0,
        fuNumber: 1,
        // "checkItems": null,
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
        fuType: '定期检查',
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
      this.$emit('getList', 2);
      // this.$parent.$parent.copyFlag = 2;
      // this.$parent.$parent.copyDialog = true;
    },
  },
};
</script>