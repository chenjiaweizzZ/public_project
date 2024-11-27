<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
    :row-key="rowKey"
    :expand-row-keys="expands"
    @expand-change="expandSelect"
    @selection-change="handleSelectionChange"
    ref="multipleTable"
    max-height="415"
  >
    <el-table-column type="expand">
      <template #default="props">
        <slot v-if="type == 1" :data="queryClinicReportDetail"></slot>
        <slot v-else :data="props.row"></slot>
      </template>
    </el-table-column>
    <!-- select -->
    <el-table-column
      v-if="!isRollOut && isSee == 'false'"
      type="selection"
      width="55"
    />
    <!-- 门诊病历 -->
    <el-table-column v-if="type == '1'" label="就诊时间" prop="medicalDate" />
    <el-table-column v-if="type == '1'" label="就诊医生" prop="medicalDoctor" />
    <el-table-column
      v-if="type == '1'"
      label="临床诊断"
      prop="clinicalDiagnosis"
    />
    <!-- 检查记录 -->
    <el-table-column
      v-if="type == '2'"
      label="报告时间"
      prop="reportedDatetime"
      :formatter="_utils.formatTableDate()"
    />
    <el-table-column v-if="type == '2'" label="检查项目" prop="examClassName" />
    <el-table-column v-if="type == '2'" label="报告医生" prop="reporter" />
    <!-- 检验记录 -->
    <el-table-column
      v-if="type == '3'"
      label="报告时间"
      prop="reportingDatetime"
      :formatter="_utils.formatTableDate()"
    />
    <el-table-column v-if="type == '3'" label="检验名称" prop="testName" />
    <el-table-column
      v-if="type == '3'"
      label="报告医生"
      prop="reportingPhysician"
    />
    <!-- 入院记录 -->
    <el-table-column
      v-if="type == '4'"
      label="入院时间"
      prop="admissionDatetime"
      :formatter="_utils.formatTableDate()"
    />
    <el-table-column v-if="type == '4'" label="入院院区" prop="admissionWard" />
    <el-table-column
      v-if="type == '4'"
      label="入院诊断"
      prop="presentHistory"
    />
    <!-- 出院记录 -->
    <el-table-column v-if="type == '5'" label="入院病区" prop="admissionWard" />
    <el-table-column
      v-if="type == '5'"
      label="入院时间"
      prop="admissionDatetime"
      :formatter="_utils.formatTableDate()"
    />
    <el-table-column
      v-if="type == '5'"
      label="出院时间"
      prop="dischargeDatetime"
      :formatter="_utils.formatTableDate()"
    />
    <el-table-column v-if="type == '5'" label="住院天数" prop="admissionDays" />
    <el-table-column
      v-if="type == '5'"
      label="住院诊断"
      prop="admittingDiagnosis"
    />
    <el-table-column
      v-if="type == '5'"
      label="主诊医生"
      prop="chiefPhysician"
    />
  </el-table>
</template>

<script setup>
import { reactive, ref, inject, onMounted, nextTick, watch } from "vue";
const _utils = inject("utils");
const _http = inject("http");
const _apiUrl = inject("apiUrl");
const multipleTable = ref();
let queryClinicReportDetail = reactive({});

const props = defineProps({
  type: {
    type: String,
    default: "0", //1门诊病历、2检查记录、3检验记录、4入院记录、5出院记录
  },
  isRollOut: {
    type: Boolean,
    default: false, // true转出、false转入
  },
  tableData: {
    type: Array,
    default: [],
  },
  isSee: {
    type: String,
    default: "false",
  },
  selectList: {
    type: Array,
    default: [],
  },
});

watch(
  () => props.selectList,
  (newVal) => {
    // console.log(newVal);
    nextTick(() => {
      if (newVal && newVal.length > 0) {
        let list = [];
        props.tableData.forEach((item) => {
          newVal.forEach((items) => {
            if (item.serialNo == items.serialNo) {
              list.push(item);
            }
          });
        });
        list.forEach((row) => {
          // console.log(row, props.type, multipleTable.value);
          multipleTable.value.toggleRowSelection(row);
        });
      }
    });
  }
);
// nextTick(() => {
//   console.log(props.selectList);
//   if (props.selectList.length > 0) {
//     let list = [];
//     props.tableData.forEach((item) => {
//       props.selectList.forEach((items) => {
//         if (item.serialNo == items.serialNo) {
//           list.push(item);
//         }
//       });
//     });
//     list.forEach((row) => {
//       console.log(row);
//       multipleTable.value.toggleRowSelection(row);
//     });
//   }
// });

const rowKey = (row) => {
  return row.serialNo;
};
const emit = defineEmits(["selectList", "seeList"]);
let expands = ref([]);
const expandSelect = async (row, expandedRows) => {
  expands.value = [];
  if (expandedRows.length > 0) {
    row ? expands.value.push(row.serialNo) : "";
  }
  if (props.type == 1) {
    await _http
      .get(_apiUrl.queryClinicReportDetail, {
        params: {
          serialNo: row.serialNo,
        },
      })
      .then((res) => {
        let obj = res.retData;
        obj.prescribeShow = "";
        if (obj.prescribe && obj.prescribe.length) {
          for (let index = 0; index < obj.prescribe.length; index++) {
            obj.prescribeShow +=
              obj.prescribe[index].oderName.trim() +
              "," +
              obj.prescribe[index].jiliang.trim() +
              "," +
              obj.prescribe[index].interval.trim() +
              "；" +
              "\n";
          }
        }
        queryClinicReportDetail = obj;
        emit("seeList", queryClinicReportDetail);
      });
  }
};
const handleSelectionChange = (val) => {
  console.log(111, val);
  emit("selectList", {
    value: val,
    type: props.type,
  });
};
</script>
