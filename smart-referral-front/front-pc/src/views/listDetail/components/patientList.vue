<template>
  <div class="patient-list">
    <!-- <el-dialog v-model="showListDialog" title="选择患者"> -->
    <div class="search-section">
      <el-form :model="form">
        <div class="form-row">
          <el-form-item label="患者类型" :label-width="formLabelWidth">
            <el-select v-model="form.type" placeholder="请选择" @change="search">
              <el-option v-for="item in patientTypeList" :key="item.patientTypeCode" :value="item.patientTypeCode" :label="item.patientTypeName" :disabled="item.enabled == 0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室" :label-width="formLabelWidth">
            <el-select v-model="form.dept" placeholder="请选择" @change="search" clearable filterable>
              <el-option v-for="item in deptList" :key="item.serialNo" :label="item.deptName" :value="item.serialNo"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="form-row">
          <el-form-item label="患者姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" maxlength="20" clearable />
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input
              v-model.number="form.phone"
              autocomplete="off"
              maxlength="11"
              clearable
              @input="
                form.phone = String(form.phone).replace(
                  /[^\d]/g,
                  ''
                )
              "
            />
          </el-form-item>
          <el-form-item label="身份证" :label-width="formLabelWidth">
            <el-input v-model="form.idCard" autocomplete="off" maxlength="18" clearable />
          </el-form-item>
          <el-button plain @click="clearInput" class="clear-btn">清 空</el-button>
          <el-button type="success" @click="search" class="sesrch-btn">查 询</el-button>
        </div>
      </el-form>
    </div>
    <div v-if="listData.gridData.length>0">
      <el-table :data="listData.gridData" @selection-change="handleSelectionChange" ref="multipleTableRef">
        <el-table-column type="selection" label="序号" width="50" />
        <el-table-column property="patientName" label="姓名" width="100" show-overflow-tooltip />
        <el-table-column property="sex" label="性别" width="60" />
        <el-table-column property="age" label="年龄" width="60" />
        <el-table-column property="phone" label="手机号" width="150" />
        <!-- <el-table-column property="type" label="病人类型" width="120" /> -->
        <el-table-column property="idNo" label="身份证" width="200" show-overflow-tooltip />
        <el-table-column property="medicalDate" label="就诊时间" width="120" show-overflow-tooltip>
          <template #default="scope">
            <div>{{ (scope.row.medicalDate?scope.row.medicalDate.slice(0,10):'')||scope.row.admissionDatetime||scope.row.dischargeDatetime }}</div>
          </template>
        </el-table-column>
        <el-table-column property="admissionDatetime" label="入院时间" width="120" show-overflow-tooltip />
        <el-table-column property="dischargeDatetime" label="出院时间" width="120" show-overflow-tooltip />
        <el-table-column property="deptBypatientType" label="科室" width="100" show-overflow-tooltip>
          <!-- <template #default="scope">
            <div>{{ deptBypatientTypescope.row.admissionWard||scope.row.admissionWard||scope.row.medicalDept }}</div>
          </template>-->
        </el-table-column>
        <el-table-column property="diagnosis" label="诊断" width="200" show-overflow-tooltip>
          <template #default="scope">
            <div>{{ scope.row.admittingDiagnosis||scope.row.clinicalDiagnosis||scope.row.dischargeDiagnosis }}</div>
          </template>
        </el-table-column>
        <el-table-column property="groupCondition" label="入组情况" width="200" show-overflow-tooltip />
        <el-table-column property="planDoctorCondition" label="随访/慢管医生" show-overflow-tooltip />
      </el-table>
      <div class="table-page">
        <el-pagination
          :current-page="listData.pageIndex"
          :page-size="listData.pageSize"
          :page-sizes="[5, 10]"
          background
          layout="total, sizes, prev, pager, next"
          :total="listData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="mt-4"
        />
      </div>
      <div class="btn-part">
        <el-button type="success" class="choose" @click="chooseOne" :disabled="multipleSelection.length!=1">确定</el-button>
        <el-button plain @click="close">取消</el-button>
      </div>
    </div>
    <div v-else class="none">
      <img :src="nodata" />
      <div class="text">暂无可选患者</div>
    </div>

    <!-- </el-dialog> -->
  </div>
</template>
<script setup>
import { ElTable, ElMessage } from 'element-plus';
import { reactive, ref, defineEmits, defineProps, inject, onMounted, watch } from 'vue';
import nodata from '@/assets/image/searchfailed.png';
const http = inject('http');
const apiUrl = inject('apiUrl');
// import { http } from '@/utils/http';
// import { apiUrl } from '@/utils/api';
// const dialogTableVisible = ref(true);
const formLabelWidth = '140px';
const multipleTableRef = ref();
const multipleSelection = ref([]);
const patientTypeList = ref([]);
const deptList = ref([]);
const form = reactive({
  type: patientTypeList.length > 0 ? patientTypeList.value[0].patientTypeCode : '',
  dept: '',
  name: '',
  phone: '',
  idCard: '',
});
const props = defineProps({
  showListDialog: {
    type: Boolean,
    default: false,
  },
  hospitalId: {
    type: String,
    default: '',
  },
});
watch(
  () => props.showListDialog,
  (newVal) => {
    if (newVal) {
      init();
    }
  }
);
const emit = defineEmits(['patientInfo', 'close']);
const listData = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 100,
  gridData: [
    {
      name: 'John Smith',
      sex: '男',
      age: '18',
      phone: '15858180384',
      type: '出院患者',
      idCard: '123456789789456123',
      medicalTime: '2016-05-02',
      inhospitalTime: '2016-05-02',
      outTime: '2016-05-02',
      dept: '心内科',
      zhenduan: '东方红时间过得富士康发',
      group: 'John Smith',
      doctor: 'xx医生',
    },
    {
      name: 'John Smith',
      sex: '男',
      age: '18',
      phone: '15858180384',
      type: '出院患者',
      idCard: '123456789789456123',
      medicalTime: '2016-05-02',
      inhospitalTime: '2016-05-02',
      outTime: '2016-05-02',
      dept: '心内科',
      zhenduan: '东方红时间过得富士康发',
      group: 'John Smith',
      doctor: 'xx医生',
    },
    {
      name: 'John Smith',
      sex: '男',
      age: '18',
      phone: '15858180384',
      type: '出院患者',
      idCard: '123456789789456123',
      medicalTime: '2016-05-02',
      inhospitalTime: '2016-05-02',
      outTime: '2016-05-02',
      dept: '心内科',
      zhenduan: '东方红时间过得富士康发',
      group: 'John Smith',
      doctor: 'xx医生',
    },
    {
      name: 'John Smith',
      sex: '男',
      age: '18',
      phone: '15858180384',
      type: '出院患者',
      idCard: '123456789789456123',
      medicalTime: '2016-05-02',
      inhospitalTime: '2016-05-02',
      outTime: '2016-05-02',
      dept: '心内科',
      zhenduan: '东方红时间过得富士康发',
      group: 'John Smith',
      doctor: 'xx医生',
    },
  ],
});
const handleCurrentChange = (index) => {
  listData.pageIndex = index;
  search();
};
const handleSizeChange = (size) => {
  listData.pageSize = size;
  search();
};
const handleSelectionChange = (val) => {
  if (val.length == 0) {
    multipleSelection.value = [];
  } else if (multipleSelection.value.length == 0 && val.length == 1) {
    multipleSelection.value = val;
  } else {
    ElMessage.error('单次只能选取一位患者');
    multipleSelection.value = [];
    toggleSelection();
  }
  // console.log(multipleSelection, 'jjjjjjjjjjjj');
};
const clearInput = () => {
  form.dept = '';
  form.phone = '';
  form.idCard = '';
  form.name = '';
  search();
};
const search = () => {
  patientList();
};
const clear = () => {
  // form.type = patientTypeList.length > 0 ? patientTypeList.value[0].patientTypeCode : '';
  form.dept = '';
  form.phone = '';
  form.idCard = '';
  form.name = '';
  toggleSelection();
};
const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value.toggleRowSelection(row, undefined);
    });
  } else {
    multipleTableRef.value.clearSelection();
  }
};
const close = () => {
  emit('close');
  multipleSelection.value = [];
  clear();
};

const chooseOne = (item) => {
  emit('patientInfo', multipleSelection.value[0]);
  multipleSelection.value = [];
  clear();
};
onMounted(() => {
  init();
});
function init() {
  getPatientType();
  getDeptList();
}
function getPatientType() {
  const params = {
    hospitalId: props.hospitalId,
  };
  http.get(apiUrl.patientTypeList, { params }).then((res) => {
    if (res) {
      patientTypeList.value = res.retData.filter((x) => x.enabled);
      if (patientTypeList.length == 0) {
        form.type = '';
      } else {
        form.type = patientTypeList.value[0].patientTypeCode;
      }
      patientList();
    } else {
      ElMessage.error('当前系统错误');
    }
  });
}
function getDeptList() {
  const params = {
    hospitalId: props.hospitalId,
    // flupDepartment: 1,
    // pageNo: 1,
    // pageSize: 1000,
  };
  http.get(apiUrl.deptList, { params }).then((res) => {
    if (res) {
      deptList.value = res.retData;
    } else {
      ElMessage.error('当前系统错误1111');
    }
  });
}
function patientList() {
  const params = {
    pageNo: listData.pageIndex,
    pageSize: listData.pageSize,
    hospitalId: props.hospitalId,
    patientTypeCode: form.type,
    searchKeys: 'patientName,idNo,flupPhone',
    searchVals: form.name + ',' + form.idCard + ',' + form.phone,
    searchTimeKey: 'admissionDatetime',
    packageCode: '',
    searchTimeVal: '',
    deptId: form.dept,
    wardId: '',
    idNo: form.idCard,
    flupPhone: form.phone,
  };
  http.get(apiUrl.patientList, { params }).then((res) => {
    listData.gridData = [];
    if (res) {
      listData.gridData = res.retData.list;
      listData.total = res.retData.total;
      if (res.retData.list.length == 0 && res.retData.total != 0 && listData.pageIndex != 1) {
        listData.pageIndex = 1;
        patientList();
      }
    } else {
      // ElMessage.error('当前系统错误');
    }
  });
}
</script>
<style lang="scss" scoped>
.patient-list {
  position: relative;
  .el-button--text {
    margin-right: 15px;
  }
  .el-select {
    width: 350px;
  }
  .el-input {
    width: 200px;
  }
  .search-section {
    position: relative;
    margin: 14px auto;
    line-height: 40px;

    padding-top: 18px;
    background: #fbfbfb;
    .el-form {
      // display: contents;
    }
    .form-row {
      display: flex;
      flex-wrap: wrap;
    }
    .sesrch-btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
    .clear-btn {
      position: absolute;
      bottom: 20px;
      right: 100px;
    }
  }
  .table-page {
    margin: 20px 0;
  }
  .btn-part {
    display: flex;
    flex-direction: row-reverse;
    .choose {
      margin-left: 20px;
    }
  }
  .none {
    display: flex;
    justify-content: center;
    padding: 60px 0 30px 0;
    flex-direction: column;
    align-items: center;
    img {
      width: 180px;
    }
    .text {
      font-family: Microsoft YaHei;
      font-size: 18px;
      font-weight: normal;
      line-height: 22px;
      text-align: center;
      letter-spacing: 0px;
      color: #111111;
      margin-top: 20px;
    }
  }
}
</style>
