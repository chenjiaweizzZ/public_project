<!-- 患者转诊转入转出统计 -->
<template>
  <div class="patient-transfer-statistics">
    <div class="search-section">
      <div class="search-section-item">
        <span class="search-section-title">选择日期</span>
        <el-date-picker v-model="time" type="daterange" unlink-panels range-separator="~" start-placeholder="开始时间"
          end-placeholder="结束时间" :shortcuts="elConfig.shortcuts" size="large" @change="dateChange"
          value-format="YYYY-MM-DD" style="width:280px" />
      </div>
      <div class="search-section-item">
        <span class="search-section-title">转出医院</span>
        <el-select v-model="search.sourceHospitalId" placeholder="请选择" @change="selectLeaveHosChange" size="large" clearable filterable>
          <el-option v-for="item in options.hospitalList" :key="item.HospitalId" :label="item.allHosName"
            :value="item.HospitalId" />
        </el-select>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">转出科室</span>
        <el-select v-model="search.sourceDeptId" placeholder="请选择" size="large" @change="getSearch" clearable filterable>
          <el-option v-for="item in options.deptLeaveList" :key="item.SectionId" :label="item.SectionName"
            :value="item.SectionId" />
        </el-select>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">转入医院</span>
        <el-select v-model="search.targetHospitalId" placeholder="请选择" @change="selectInHosChange" size="large" clearable filterable>
          <el-option v-for="item in options.hospitalList" :key="item.HospitalId" :label="item.allHosName"
            :value="item.HospitalId" />
        </el-select>
      </div>
      <div class="search-section-item  search-section-item-last">
        <span class="search-section-title">转入科室</span>
        <el-select v-model="search.targetDeptId" placeholder="请选择" size="large" @change="getSearch" clearable filterable>
          <el-option v-for="item in options.deptIntoList" :key="item.SectionId" :label="item.SectionName"
            :value="item.SectionId" />
        </el-select>
      </div>
      <div class="btn-group">
        <el-button size="large" class="btn-normal btn-height-34" @click="clearSearch">清空</el-button>
        <!-- <el-button size="large" class="btn-green-plain btn-height-34" @click="getSearch">搜索</el-button> -->
        <el-button size="large" class="btn-green-plain btn-height-34" @click="exportTableList">导出</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table :data="state.tableData" border style="width: 100%" show-overflow-tooltip="true">
        <el-table-column type="index" label="序号" width="73" />
        <el-table-column prop="sourceHospitalName" label="转出医院" />
        <el-table-column prop="sourceDeptName" label="转出科室" />
        <el-table-column prop="targetHospitalName" label="转入医院" />
        <el-table-column prop="targetDeptName" label="转入科室" />
        <el-table-column prop="requestsCount" label="转出数量" />
        <el-table-column prop="approvedRequests" label="转入数量" />
      </el-table>
    </div>
    <div class="table-page">
      <el-pagination :current-page="state.pageIndex" :page-size="state.pageSize" :page-sizes="[10, 20, 50]" background
        layout="total, sizes, prev, pager, next" :total="state.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" class="mt-4" />
    </div>
  </div>
</template>
<script setup name="outpatientServiceLeave">
import { ref, reactive, onMounted, watch } from "vue";
import { exportFile, getReferralStatisticsList, getTransferStatus, getHospitalList, getDeptByHospitalId, getCurrentUserDept, selectAllDeptByHospital } from "@/services/transfer";
import utils from "@/utils/utils"
onMounted(() => {
  initTime()
  getTableList()
  getHosList()
  // getMyHosDeptList()
})
let time = ref([])
let search = reactive({
  applyStartDate: '',  //开始时间
  applyEndDate: '', //结束时间
  sourceDeptId: '',  //转出科室
  sourceHospitalId: '', //转出医院
  targetDeptId: '',  //转入科室
  targetHospitalId: '',  //转入医院
})
watch(time, (newTime) => {
  newTime ? search.applyStartDate = newTime[0] ? newTime[0] : "" : search.applyStartDate = '';
  newTime ? search.applyEndDate = newTime[1] ? newTime[1] : "" : search.applyEndDate = '';
});
const options = reactive({
  hospitalList: [],
  TransferStatusList: [],
  deptLeaveList: [],
  deptIntoList: []
})
const state = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0,
  tableData: []
})
const elConfig = reactive({
  shortcuts: [
    {
      text: '最近一周',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      },
    },
    {
      text: '最近一个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 31)
        return [start, end]
      },
    },
    {
      text: '最近三个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        return [start, end]
      },
    },
  ]
})
const exportTableList = () => {
  search.pageNo = state.pageIndex
  search.pageSize = state.pageSize
  exportFile(search).then((res) => {
    utils.download(res, getFileName(`转诊统计`), "application/ms-excel")
  })
  console.log(getFileName(`转诊统计`))
}
const getFileName = (fileName) => {
  let now = new Date();  
  let year = now.getFullYear();  
  let month = String(now.getMonth() + 1).padStart(2, '0');  
  let day = String(now.getDate()).padStart(2, '0');  
  let hours = String(now.getHours()).padStart(2, '0');  
  let minutes = String(now.getMinutes()).padStart(2, '0');  
  let seconds = String(now.getSeconds()).padStart(2, '0');  
  let timestamp = now.getTime();  
  return `${fileName}${year}\\${month}\\${day} ${hours}:${minutes}:${seconds} ${timestamp}.xlsx`; 
}
const clearSearch = () => {
  if (clearable(search)) {
    Object.assign(search, {
      applyStartDate: '',  //开始时间
      applyEndDate: '', //结束时间
      sourceDeptId: '',  //转出科室
      sourceHospitalId: '', //转出医院
      targetDeptId: '',  //转入科室
      targetHospitalId: '',  //转入医院
    });
    time.value = []
    options.deptLeaveList = []
    options.deptIntoList = []
    getTableList()
  }
}
const clearable = (obj) => {
  delete obj.pageNo
  delete obj.pageSize
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return true;
    }
  }
  return false
}
const selectLeaveHosChange = (hospitalId) => {
  state.pageIndex = 1;
  if(hospitalId) {
    selectAllDeptByHospital({ hospitalId }).then(res => {
    utils.isArray(res) ? options.deptLeaveList = res : ''
    })
  }else {
    options.deptLeaveList = []
  }
  search.sourceDeptId = ''
  getTableList()
}
const selectInHosChange = (hospitalId) => {
  state.pageIndex = 1;
  if(hospitalId) {
    selectAllDeptByHospital({ hospitalId }).then(res => {
      utils.isArray(res) ? options.deptIntoList = res : ''
    })
  }else {
    options.deptIntoList = []
  }
  search.targetDeptId = ''
  getTableList()
}
const getMyHosDeptList = () => {
  getCurrentUserDept().then(res => {
    utils.isArray(res) ? options.deptLeaveList = res : ''
  })
}
const getTableList = () => {
  search.pageNo = state.pageIndex
  search.pageSize = state.pageSize
  getReferralStatisticsList(search).then((res) => {
    state.tableData = res.list
    state.total = res.total
  })
}
const getHosList = () => {
  state.pageIndex = 1;
  getHospitalList().then(res => {
    utils.isArray(res) ? options.hospitalList = res : ''
  })
  getTableList();
}
const getSearch = () => {
  state.pageIndex = 1;
  getTableList();
}
const initTime = () => {
  time.value = utils.getAMonth()
}
const dateChange = (date) => {
  getTableList()
}
const handleCurrentChange = (index) => {
  state.pageIndex = index
  getTableList()
}
const handleSizeChange = (size) => {
  state.pageSize = size
  getTableList()
}
</script>
<style lang="scss" scoped>
.patient-transfer-statistics {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0 24px 20px;
  overflow: scroll;

  .search-section {
    position: relative;
    margin: 0 auto 14px;
    line-height: 40px;
    display: flex;
    flex-wrap: wrap;
    background: #FBFBFB;
    padding-bottom: 4px;

    .search-section-title {
      line-height: 50px;
      margin: auto 14px auto 30px;
      white-space: nowrap;
      color: #333333;
    }

    .search-section-item-last {
      margin-right: 250px;
    }

    .search-container {
      width: 170px;
    }

    .btn-group {
      position: absolute;
      right: 24px;
      bottom: 10px;
    }
  }
  .table-container {
    margin-bottom: 56px
  }

  .table-page {
    position: fixed;
    bottom: 0px;
    padding-bottom: 30px;
    left: 24px;
    right: 24px;
    background-color: #fff;
    z-index: 3;
  }
}
</style>
  