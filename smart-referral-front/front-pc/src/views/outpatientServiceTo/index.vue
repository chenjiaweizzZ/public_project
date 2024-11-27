<!-- 门诊转入 -->
<template>
  <div class="bein-hospital-leave">
    <div class="search-section">
      <div class="search-section-item">
        <span class="search-section-title">申请日期</span>
        <el-date-picker v-model="time" type="daterange" unlink-panels range-separator="~" start-placeholder="开始时间"
          end-placeholder="结束时间" :shortcuts="elConfig.shortcuts" size="large" @change="dateChange"
          value-format="YYYY-MM-DD" style="width:280px" />
      </div>
      <div class="search-section-item">
        <span class="search-section-title">转出医院</span>
        <el-select v-model="search.sourceHospitalId" @change="selectHosChange" placeholder="请选择" size="large" clearable filterable>
          <el-option v-for="item in options.hospitalList" :key="item.HospitalId" :label="item.allHosName"
            :value="item.HospitalId" />
        </el-select>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">转出科室</span>
        <el-select v-model="search.sourceDeptId" placeholder="请选择" size="large" @change="getSearch" clearable filterable>
          <el-option v-for="item in options.hospitalDeptList" :key="item.SectionId" :label="item.SectionName"
            :value="item.SectionId" />
        </el-select>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">转入科室</span>
        <el-select v-model="search.targetDeptId" placeholder="请选择" size="large" @change="getSearch" clearable filterable>
          <el-option v-for="item in options.myHosDeptList" :key="item.SectionId" :label="item.SectionName"
            :value="item.SectionId" />
        </el-select>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">患者姓名</span>
        <el-input v-model="search.patientName" class="w-50 m-2" size="large" placeholder="请输入"  maxlength="20" style="width:170px" clearable/>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">患者联系方式</span>
        <el-input v-model.number="search.patientPhone" class="w-50 m-2" size="large" placeholder="请输入" maxlength="11"
          style="width:170px" clearable @input="validateInput"/>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">流程状态</span>
        <el-select v-model="search.processStatus" placeholder="请选择" size="large" @change="getSearch" clearable>
          <el-option v-for="item in options.procesStatusList" :key="item.id" :label="item.statusName"
            :value="item.statusCode" />
        </el-select>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">业务状态</span>
        <el-select v-model="search.businessStatus" placeholder="请选择" size="large" @change="getSearch" clearable>
          <el-option v-for="item in options.businesStatusList" :key="item.id" :label="item.statusName"
            :value="item.statusCode" />
        </el-select>
      </div>
      <div class="search-section-item search-section-item-last">
        <span class="search-section-title">送转医生</span>
        <el-input v-model.number="search.applyUserName" class="w-50 m-2" size="large" placeholder="请输入"  style="width: 170px" clearable />
      </div>
      <div class="btn-group">
        <el-button size="large" class="btn-green-plain btn-height-34" @click="getTableList">搜索</el-button>
        <el-button size="large" class="btn-normal btn-height-34" @click="clearSearch">清空</el-button>
        <!-- <el-button size="large" class="btn-primary" @click="apply">住院转出申请</el-button> -->
      </div>
    </div>
    <div class="table-container">
      <el-table :data="state.tableData" border style="width: 100%" :show-overflow-tooltip="true">
        <el-table-column type="index" label="序号" width="73" />
        <el-table-column prop="applyTime" label="申请日期" width="175" />
        <el-table-column prop="targetDeptName" label="转入科室" />
        <el-table-column prop="patientName" label="病人姓名" width="105" />
        <el-table-column prop="patientPhone" label="联系方式" width="130" />
        <el-table-column prop="applyUserName" label="送转医生" width="105" />
        <el-table-column prop="sourceHospitalName" label="转出医院" />
        <el-table-column prop="sourceDeptName" label="转出科室" />
        <el-table-column prop="currentProcessStatus" label="流程状态" width="170">
          <template #default="scope">
            <el-tag round :class="getTagClass(scope.row.currentProcessStatus)">
            {{ getStatusName(scope.row.currentProcessStatus) }}
          </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currentBusinessStatus" label="业务状态" width="105">
        <template #default="scope">
            <span v-if="scope.row.currentBusinessStatus == 'EMPTY'">-</span>
            <el-tag v-else round :class="getTagClass(scope.row.currentBusinessStatus)">
            {{ getStatusName(scope.row.currentBusinessStatus) }}
          </el-tag>
          </template>
        </el-table-column>  
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button v-if="getAction(scope.row.actionCodes,'SKIM')" link type="primary" size="small" @click="handle(scope.row.recordId,true,'门诊转入查看',2)">查看</el-button>
            <el-button v-if="getAction(scope.row.actionCodes,'EXIT')" link type="primary" size="small" @click="handle(scope.row.recordId,false,'门诊转入编辑')">编辑</el-button>
            <el-button v-if="getAction(scope.row.actionCodes,'REVIEW')" link type="primary" size="small" @click="handle(scope.row.recordId,false,'门诊转入审核',4)">审核</el-button>
            <el-button v-if="getAction(scope.row.actionCodes,'CANCEL')" link type="primary" size="small" @click="setRecordStatus(scope.row.recordId,'CANCEL')">取消</el-button>
            <el-button v-if="getAction(scope.row.actionCodes,'RESERVATION')" link type="primary" size="small" @click="setRecordStatus(scope.row.recordId,'RESERVATION')">预约</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-page">
      <el-pagination :current-page.sync="search.pageNo" :page-size="search.pageSize" :page-sizes="[10, 20, 50]" background
        layout="total, sizes, prev, pager, next" :total="state.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" class="mt-4" />
    </div>
  </div>
</template>
<script setup name="outpatientServiceLeave">
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTransferStatus, getDeptByHospitalId, getHospitalList, selectRecordList, reviewRecord, getCurrentUserDept, selectAllDeptByHospital  } from "@/services/transfer";
import utils from "@/utils/utils"
import { searchStore } from "@/stores/search";
const store = searchStore()
onMounted(() => {
  initSearch()
  getTransferStatusList()
  initTime()
  getHosList()
  getMyHosDeptList()
})
const route = useRoute()
const router = useRouter()
// let search = reactive({
//   applyStartDate: '', //申请开始时间
//   applyEndDate: '',  //申请结束时间
//   patientName: '',  //患者姓名
//   patientPhone: '',  //患者联系方式
//   processStatus: '',  //流程状态
//   businessStatus: '', //业务状态
//   sourceDeptId: '', //转出科室
//   targetDeptId: '', //转入科室
//   sourceHospitalId: '', //转出医院
//   targetHospitalId: '' //转入医院
// })
let search = store.outpatientServiceToSearch
const options = reactive({
  procesStatusList: [], //流程状态列表
  businesStatusList: [],  //业务状态列表
  myHosDeptList: [], //我的医院的科室列表
  hospitalList: [],  //其他医院列表
  hospitalDeptList: [], //其他医院科室列表
  sourceHospitalId: '' //我的医院的id
})
const state = reactive({
  total: 0,
  tableData: [
  ],
})
let time = ref([])
// watch(time, (newTime) => {
//   newTime ? search.applyStartDate = newTime[0] ? newTime[0] : "" : search.applyStartDate = '';
//   newTime ? search.applyEndDate = newTime[1] ? newTime[1] : "" : search.applyEndDate = '';
// });
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
const validateInput = () => {
  const value = search.patientPhone
  if (!value || isNaN(Number(value))) {  
    search.patientPhone = ''; 
  } 
};
const clearSearch = () => {
  if (clearable(search)) {
    Object.assign(search, {
      applyStartDate: '', //申请开始时间
      applyEndDate: '',  //申请结束时间
      patientName: '',  //患者姓名
      patientPhone: '',  //患者联系方式
      processStatus: '',  //流程状态
      businessStatus: '', //业务状态
      sourceDeptId: '', //转出科室
      targetDeptId: '', //转入科室
      sourceHospitalId: '', //转出医院
      targetHospitalId: '', //转入医院
      applyUserName: "",
      pageNo: 1,
      pageSize: 10
    });
    time.value = []
    options.hospitalDeptList = []
    getTableList()
  }
}
const initSearch = () => {
  route.query?.isBack ? '' : clearSearch()
}
const clearable = (obj) => {
  for (let key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      obj[key] !== undefined &&
      obj[key] !== null &&
      obj[key] !== "" &&
      key !== 'pageNo' &&
      key !== 'pageSize' &&
      key !== 'enterPageType'
    ) {
      return true;
    }
  }
  return false
}
const getMyHosDeptList = () => {
  getCurrentUserDept().then(res => {
    utils.isArray(res) ? options.myHosDeptList = res : ''
  })
}
const getHosDeptList = (hospitalId) => {
  selectAllDeptByHospital({ hospitalId, sectionClass: "801" }).then(res => {
    utils.isArray(res) ? options.hospitalDeptList = res : ''
  })
}
const getHosList = () => {
  getHospitalList({ isFilterOneself: 1 }).then(res => {
    utils.isArray(res) ? options.hospitalList = res : ''
  })
  if(search.sourceHospitalId) {
    selectHosChange(search.sourceHospitalId,false)
  }
}
const getTransferStatusList = () => {
  getTransferStatus().then(res => {
    if (utils.isArray(res)) {
      options.procesStatusList = res.filter(i => i.statusType == '1' && i.transferType == 'MZ')   //门诊流程状态
      options.businesStatusList = res.filter(i => i.statusType == '2' && i.transferType == 'MZ')   //门诊业务状态
      getTableList()
    }
  })
}
const getTableList = () => {
  search.enterPageType = 3
  selectRecordList(search).then(res => {
    state.tableData = res.list
    state.total = res.total
  })
}
const initTime = () => {
  if(search.applyStartDate && search.applyEndDate) {
    time.value[0] = search.applyStartDate
    time.value[1] = search.applyEndDate
  }else {
    time.value = utils.getAMonth();
    search.applyStartDate = time.value[0]
    search.applyEndDate = time.value[1]
  }
};
const dateChange = (newTime) => {
  newTime ? search.applyStartDate = newTime[0] ? newTime[0] : "" : search.applyStartDate = '';
  newTime ? search.applyEndDate = newTime[1] ? newTime[1] : "" : search.applyEndDate = '';
  search.pageNo = 1;
  getTableList();
};
const getTagClass = (status) => {
  if(status) {
    return `tag${ options.procesStatusList.concat(options.businesStatusList).find((item) => item.statusCode == status)?.statusColor || "" }`
  }else {
    return ''
  };
}
const getStatusName = (status) => {
  return options.procesStatusList.concat(options.businesStatusList).find(item => item.statusCode == status)?.statusName||''
}
const getAction = (actionCodes, code) => {
  if(actionCodes) {
    return actionCodes.includes(code)
  }else return false
}
const selectHosChange = (hospitalId,init=true) => {
  init ? search.pageNo = 1 : '';
  init ? search.sourceDeptId = '' : '';
  hospitalId ? getHosDeptList(hospitalId) : options.hospitalDeptList = []
  getTableList()
}
const getSearch = () => {
  search.pageNo = 1;
  getTableList();
}
const handle = (recordId = '', isSee = false, title, operateType = 1) => {
  // let query = {
  //   type: 2,
  //   transferType: 'MZ',
  //   isSee,
  //   operateType
  // }
  // recordId ? query.recordId = recordId : ''
  // router.push({
  //   name: 'listDetail',
  //   query
  // })
  var urlx;
  if (location.pathname) {
    urlx = location.origin + location.pathname;
  } else {
    urlx = location.origin + "/pc";
  }
  window.parent.postMessage(
        JSON.stringify({
          method: "addTab",
          url: `${urlx}#/listDetail?type=2&transferType=MZ&recordId=${recordId}&isSee=${isSee}&operateType=${operateType}`,
          title
        }),
    "*"
  );
}
const setRecordStatus = (recordId,action) => {
  let message = action == `RESERVATION` ? `是否已完成预约?` : `确定取消该患者的门诊转出申请吗?`
  ElMessageBox.confirm(
    message,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  )
    .then(() => {
      reviewRecord({recordId,action}).then(res => {
        getSearch()
      })
    })
    .catch(() => {
      return
    })
}
const handleCurrentChange = (index) => {
  search.pageNo = index
  getTableList()
}
const handleSizeChange = (size) => {
  search.pageSize = size
  getTableList()
}
</script>
<style lang="scss" scoped>
.bein-hospital-leave {
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
      margin-right: 280px;
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

