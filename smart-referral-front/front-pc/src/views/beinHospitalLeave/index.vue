<!-- 住院转出 -->
<template>
  <div class="bein-hospital-leave">
    <div class="search-section">
      <div class="search-section-item">
        <span class="search-section-title">申请日期</span>
        <el-date-picker v-model="time" type="daterange" unlink-panels range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="elConfig.shortcuts" size="large" @change="dateChange" value-format="YYYY-MM-DD" style="width: 280px" />
      </div>
      <div class="search-section-item">
        <span class="search-section-title">转出科室</span>
        <el-select v-model="search.sourceDeptId" placeholder="请选择" size="large" @change="getSearch" clearable filterable>
          <el-option v-for="item in options.myHosDeptList" :key="item.SectionId" :label="item.SectionName" :value="item.SectionId" />
        </el-select>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">转入医院</span>
        <el-select v-model="search.targetHospitalId" @change="selectHosChange" placeholder="请选择" size="large" clearable filterable>
          <el-option v-for="item in options.hospitalList" :key="item.HospitalId" :label="item.allHosName" :value="item.HospitalId" />
        </el-select>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">转入科室</span>
        <el-select v-model="search.targetDeptId" placeholder="请选择" size="large" @change="getSearch" clearable filterable>
          <el-option v-for="item in options.hospitalDeptList" :key="item.SectionId" :label="item.SectionName" :value="item.SectionId" />
        </el-select>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">患者姓名</span>
        <el-input v-model="search.patientName" class="w-50 m-2" size="large" placeholder="请输入" style="width: 170px" maxlength="20" clearable />
      </div>
      <div class="search-section-item">
        <span class="search-section-title">患者联系方式</span>
        <el-input v-model.number="search.patientPhone" class="w-50 m-2" size="large" placeholder="请输入" maxlength="11" style="width: 170px" @input="validateInput" clearable />
      </div>
      <div class="search-section-item">
        <span class="search-section-title">流程状态</span>
        <el-select v-model="search.processStatus" placeholder="请选择" size="large" @change="getSearch" clearable>
          <el-option v-for="item in options.procesStatusList" :key="item.id" :label="item.statusName" :value="item.statusCode" />
        </el-select>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">业务状态</span>
        <el-select v-model="search.businessStatus" placeholder="请选择" size="large" @change="getSearch" clearable>
          <el-option v-for="item in options.businesStatusList" :key="item.id" :label="item.statusName" :value="item.statusCode" />
        </el-select>
      </div>
      <div class="search-section-item">
        <span class="search-section-title">入院日期</span>
        <el-date-picker v-model="time2" type="daterange" unlink-panels range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="elConfig.shortcuts" size="large" @change="date2Change" value-format="YYYY-MM-DD" style="width: 280px" />
      </div>
      <div class="search-section-item search-section-item-last">
        <span class="search-section-title">送转医生</span>
        <el-input v-model.number="search.applyUserName" class="w-50 m-2" size="large" placeholder="请输入"  style="width: 170px" clearable />
      </div>
      <div class="btn-group">
        <el-button size="large" class="btn-green-plain btn-height-34" @click="getSearch">搜索</el-button>
        <el-button size="large" class="btn-normal btn-height-34" @click="clearSearch">清空</el-button>
        <el-button size="large" class="btn-green-plain btn-height-34" @click="handle('', false, '住院转出申请', 1)">住院转出申请</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table :data="state.tableData" border style="width: 100%" :show-overflow-tooltip="true">
        <el-table-column type="index" label="序号" width="73" />
        <el-table-column prop="applyTime" label="申请日期" width="175" />
        <el-table-column prop="sourceDeptName" label="转出科室" />
        <el-table-column prop="patientName" label="病人姓名" width="105" />
        <el-table-column prop="patientPhone" label="联系方式" width="130" />
        <el-table-column prop="applyUserName" label="送转医生" width="105" />
        <el-table-column prop="targetHospitalName" label="转入医院" />
        <el-table-column prop="targetDeptName" label="转入科室" />
        <el-table-column prop="hisReturnData" label="入院日期" width="120">
          <template #default="scope">
            <span>{{ getInHospitalDate(scope.row.hisReturnData) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="referralPurpose" label="转诊目的" width="120" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.referralPurpose }}</span>
          </template>
        </el-table-column>
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
            <el-button v-if="getAction(scope.row.actionCodes, 'SKIM')" link type="primary" size="small" @click="handle(scope.row.recordId, true, '住院转出查看', 2)">查看</el-button>
            <el-button v-if="getAction(scope.row.actionCodes, 'EXIT')" link type="primary" size="small" @click="handle(scope.row.recordId, false, '住院转出编辑', 3)">编辑</el-button>
            <el-button v-if="getAction(scope.row.actionCodes, 'REVIEW')" link type="primary" size="small" @click="handle(scope.row.recordId, false, '住院转出审核')">审核</el-button>
            <el-button v-if="getAction(scope.row.actionCodes, 'CANCEL')" link type="primary" size="small" @click="setRecordStatus(scope.row.recordId, 'CANCEL')">取消</el-button>
            <el-button v-if="getAction(scope.row.actionCodes,'REFILLING')" link type="primary" size="small" @click="handle(scope.row.recordId,false,'重新填写',5)">重新填写</el-button>
            <el-button v-if="getAction(scope.row.actionCodes, 'RESERVATION')" link type="primary" size="small" @click="setRecordStatus(scope.row.recordId, 'RESERVATION')">预约</el-button>
            <el-button v-if="
                scope.row.currentBusinessStatus === 'YYY' ||
                scope.row.currentBusinessStatus === 'YAP' ||
                scope.row.currentBusinessStatus === 'YZY' ||
                scope.row.currentBusinessStatus === 'TY'
              " link type="primary" size="small" @click="Print(scope.row.recordId)">打印住院证</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-page">
      <el-pagination :current-page.sync="search.pageNo" :page-size="search.pageSize" :page-sizes="[10, 20, 50]" background layout="total, sizes, prev, pager, next" :total="state.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="mt-4" />
    </div>
    <iframe ref="printFrame" style="display: none"></iframe>
  </div>
</template>
<script setup name="outpatientServiceLeave">
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import {
  getTransferStatus,
  getDeptByHospitalId,
  getHospitalList,
  selectRecordList,
  reviewRecord,
  getCurrentUserDept,
  selectAllDeptByHospital,
  selectReferralApply,
} from "@/services/transfer";
import utils from "@/utils/utils";
import { searchStore } from "@/stores/search";
const store = searchStore();
let printFrame = ref();
onMounted(() => {
  initSearch();
  getTransferStatusList();
  initTime();
  getHosList();
  getMyHosDeptList();
});
// 医保类型列表
const mitList = [
  {
    value: "1",
    label: "长沙市医保",
  },
  {
    value: "2",
    label: "长沙居民医保",
  },
  {
    value: "3",
    label: "省直医保",
  },
  {
    value: "4",
    label: "铁路医保",
  },
  {
    value: "5",
    label: "长沙县医保",
  },
  {
    value: "6",
    label: "新农合",
  },
  {
    value: "7",
    label: "异地联网",
  },
  {
    value: "8",
    label: "外省医保",
  },
  {
    value: "9",
    label: "无医保",
  },
];
// 证件类型
const documentList = [
  {
    value: "01",
    label: "身份证",
  },
  {
    value: "03",
    label: "护照",
  },
  {
    value: "06",
    label: "港澳居民内地通行证",
  },
  {
    value: "07",
    label: "台湾居民内地通行证",
  },
];
const route = useRoute();
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
let search = store.beinHospitalLeaveSearch;
// const state = store.state
const options = reactive({
  procesStatusList: [], //流程状态列表
  businesStatusList: [], //业务状态列表
  myHosDeptList: [], //我的医院的科室列表
  hospitalList: [], //其他医院列表
  hospitalDeptList: [], //其他医院科室列表
  sourceHospitalId: "", //我的医院的id
});
const state = reactive({
  total: 0,
  tableData: [],
});
// const state = store.state
let time = ref([]);
let time2 = ref([]);
// watch(time, (newTime) => {
//   newTime ? search.applyStartDate = newTime[0] ? newTime[0] : "" : search.applyStartDate = '';
//   newTime ? search.applyEndDate = newTime[1] ? newTime[1] : "" : search.applyEndDate = '';
// });
const elConfig = reactive({
  shortcuts: [
    {
      text: "最近一周",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      },
    },
    {
      text: "最近一个月",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
        return [start, end];
      },
    },
    {
      text: "最近三个月",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      },
    },
  ],
});
const validateInput = () => {
  const value = search.patientPhone;
  if (!value || isNaN(Number(value))) {
    search.patientPhone = "";
  }
};
const clearSearch = () => {
  if (clearable(search)) {
    Object.assign(search, {
      applyStartDate: "", //申请开始时间
      applyEndDate: "", //申请结束时间
      patientName: "", //患者姓名
      patientPhone: "", //患者联系方式
      processStatus: "", //流程状态
      businessStatus: "", //业务状态
      sourceDeptId: "", //转出科室
      targetDeptId: "", //转入科室
      sourceHospitalId: "", //转出医院
      targetHospitalId: "", //转入医院
      lastNotingStartDate: "",
      lastNotingEndDate: "",
      applyUserName: "",
      pageNo: 1,
      pageSize: 10,
    });
    time.value = [];
    time2.value = []
    options.hospitalDeptList = [];
    getTableList();
  }
};
const initSearch = () => {
  route.query?.isBack ? "" : clearSearch();
};
const clearable = (obj) => {
  for (let key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      obj[key] !== undefined &&
      obj[key] !== null &&
      obj[key] !== "" &&
      key !== "pageNo" &&
      key !== "pageSize" &&
      key !== "enterPageType"
    ) {
      return true;
    }
  }
  return false;
};
const getMyHosDeptList = () => {
  getCurrentUserDept().then((res) => {
    utils.isArray(res) ? (options.myHosDeptList = res) : "";
  });
};
const getHosDeptList = (hospitalId) => {
  selectAllDeptByHospital({ hospitalId, sectionClass: "802" }).then((res) => {
    utils.isArray(res) ? (options.hospitalDeptList = res) : "";
  });
};
const getHosList = () => {
  getHospitalList({ isFilterOneself: 1 }).then((res) => {
    utils.isArray(res) ? (options.hospitalList = res) : "";
  });
  if (search.targetHospitalId) {
    selectHosChange(search.targetHospitalId, false);
  }
};
const getTransferStatusList = () => {
  getTransferStatus().then((res) => {
    if (utils.isArray(res)) {
      options.procesStatusList = res.filter(
        (i) => i.statusType == "1" && i.transferType == "ZY"
      ); //住院流程状态
      options.businesStatusList = res.filter(
        (i) => i.statusType == "2" && i.transferType == "ZY"
      ); //住院业务状态
    }
    getTableList();
  });
};
const getTableList = () => {
  search.enterPageType = 2;
  selectRecordList(search).then((res) => {
    state.tableData = res.list;
    state.total = res.total;
  });
};
const initTime = () => {
  if (search.applyStartDate && search.applyEndDate) {
    time.value[0] = search.applyStartDate;
    time.value[1] = search.applyEndDate;
  } else {
    time.value = utils.getAMonth();
    search.applyStartDate = time.value[0];
    search.applyEndDate = time.value[1];
  }
  if (search.lastNotingStartDate && search.lastNotingEndDate) {
    time2.value[0] = search.lastNotingStartDate;
    time2.value[1] = search.lastNotingEndDate;
  } 
};
const dateChange = (newTime) => {
  newTime
    ? (search.applyStartDate = newTime[0] ? newTime[0] : "")
    : (search.applyStartDate = "");
  newTime
    ? (search.applyEndDate = newTime[1] ? newTime[1] : "")
    : (search.applyEndDate = "");
  search.pageNo = 1;
  getTableList();
};
const date2Change = (newTime) => {
  newTime
    ? (search.lastNotingStartDate = newTime[0] ? newTime[0] : "")
    : (search.lastNotingStartDate = "");
  newTime
    ? (search.lastNotingEndDate = newTime[1] ? newTime[1] : "")
    : (search.lastNotingEndDate = "");
  search.pageNo = 1;
  getTableList();
};
const getTagClass = (status) => {
  if (status) {
    return `tag${
      options.procesStatusList
        .concat(options.businesStatusList)
        .find((item) => item.statusCode == status)?.statusColor || ""
    }`;
  } else {
    return "";
  }
};
const getStatusName = (status) => {
  return (
    options.procesStatusList
      .concat(options.businesStatusList)
      .find((item) => item.statusCode == status)?.statusName || ""
  );
};
const getInHospitalDate = (str) => {
  if (str) {
    let newStr = JSON.parse(str);
    let dateStr = newStr?.lastNotingDate || "";
    if (dateStr.length > 10) {
      return dateStr.slice(0, 10);
    } else {
      return "";
    }
  } else {
    return "";
  }
};
const getAction = (actionCodes, code) => {
  if (actionCodes) {
    return actionCodes.includes(code);
  } else return false;
};
const selectHosChange = (hospitalId, init = true) => {
  init ? (search.pageNo = 1) : "";
  init ? (search.targetDeptId = "") : "";
  hospitalId ? getHosDeptList(hospitalId) : (options.hospitalDeptList = []);
  getTableList();
};
const getSearch = () => {
  search.pageNo = 1;
  getTableList();
};
const handle = (recordId = "", isSee = false, title, operateType = 1) => {
  // let query = {
  //   type: 1,
  //   transferType: 'ZY',
  // }
  // recordId ? query.recordId = recordId : ''
  // action ? query.isSee = true : ''
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
      url: `${urlx}#/beInHospital?type=1&recordId=${recordId}&isSee=${isSee}&operateType=${operateType}`,
      title,
    }),
    "*"
  );
};
const setRecordStatus = (recordId, action) => {
  let message =
    action == `RESERVATION`
      ? `是否已完成预约?`
      : `确定取消该患者的住院转出申请吗?`;
  ElMessageBox.confirm(message, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(() => {
      reviewRecord({ recordId, action }).then((res) => {
        getSearch();
      });
    })
    .catch(() => {
      return;
    });
};
const handleCurrentChange = (index) => {
  search.pageNo = index;
  getTableList();
};
const handleSizeChange = (size) => {
  search.pageSize = size;
  getTableList();
};
const Print = (id) => {
  // 获取详情
  selectReferralApply({
    recordId: id,
  }).then((res) => {
    // 医保类型
    let mitName = res.referralRecordVo.clinicCardType
      ? mitList.filter((item) => {
          return item.value == res.referralRecordVo.clinicCardType;
        })[0].label
      : "";
    // 证件类型
    let documentName = res.referralRecordVo.idCardType
      ? documentList.filter((item) => {
          return item.value == res.referralRecordVo.idCardType;
        })[0].label
      : "";
    // 病区
    let index = res.referralRecordVo.targetDeptName.indexOf("(");
    let wardName =
      index != -1 ? res.referralRecordVo.targetDeptName.slice(0, index) : "";
    // 获取 iframe 的文档对象
    const printFrames = printFrame.value.contentWindow;

    // 在 iframe 中写入需要打印的内容
    printFrames.document.open();
    printFrames.document.write(`
  <html>
  <head>
    <title>全病程分级诊疗管理平台软件</title>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      h1 {
        text-align: center;
      }
      table {
        border-collapse: collapse;
        border-spacing: 0;
        border: 1px solid black;
      }
      th,
      td {
        border: 1px solid black;
        height: 60px;
        width: 25%;
        padding: 5px;
        text-align: center;
        word-wrap:break-word;
        word-break:break-all;
        white-space:normal;
      }
      .main_diagnosis {
        text-align: left;
      }
    </style>
  </head>
  <body>
    <div class="title">
      <h1>中南大学湘雅医院全病程分级诊疗管理平台</h1>
      <h1>转诊住院登记证</h1>
    </div>
    <table border="1px" width="100%">
      <tr>
        <td>申请平台</td>
        <td>全病程管理平台</td>
        <td>处理状态</td>
        <td>同意收案</td>
      </tr>
      <tr>
        <td>患者姓名</td>
        <td>${res.referralRecordVo.patientName}</td>
        <td>性别</td>
        <td>${res.referralRecordVo.sexCode == 1 ? "男" : "女"}</td>
      </tr>
      <tr>
        <td>年龄</td>
        <td>${res.referralRecordVo.patientAge}</td>
        <td>医保类型</td>
        <td>${mitName}</td>
      </tr>
      <tr>
        <td>证件类型</td>
        <td>${documentName}</td>
        <td>证件号码</td>
        <td>${res.referralRecordVo.idNo}</td>
      </tr>
      <tr>
        <td>会诊科室</td>
        <td>${res.referralRecordVo.targetDeptName}</td>
        <td>会诊医生</td>
        <td>${res.admissionForm.doctorName}</td>
      </tr>
      <tr>
        <td>主诊断</td>
        <td colspan="3" class="main_diagnosis">
          ${res.referralRecordVo.mainDiagnosis}
        </td>
      </tr>
      <tr>
        <td>住院科室</td>
        <td>${res.referralRecordVo.targetDeptName}</td>
        <td>住院病区</td>
        <td>${wardName}</td>
      </tr>
      <tr>
        <td>入院病情</td>
        <td>${
          res.admissionForm.diseaseCondition == 1
            ? "危"
            : res.admissionForm.diseaseCondition == 2
            ? "急"
            : res.admissionForm.diseaseCondition == 3
            ? "一般"
            : ""
        }</td>
        <td>预交款</td>
        <td>${res.admissionForm.prepayment}</td>
      </tr>
      <tr>
        <td>注意事项</td>
        <td colspan="3" class="main_diagnosis"></td>
      </tr>
      <tr>
        <td>申请人</td>
        <td>${res.referralRecordVo.applyUserName}</td>
        <td>患者电话</td>
        <td>${res.referralRecordVo.patientPhone}</td>
      </tr>
      <tr>
        <td>申请日期</td>
        <td>${res.referralRecordVo.applyTime.slice(0, 10)}</td>
        <td colspan="2"></td>
      </tr>
    </table>
  </body>
</html>
      `);
    printFrames.document.close();
    // 调用 iframe 的打印方法
    printFrames.print();
  });
};

const showTime = (v) => {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  let dateString = "";
  // 构建日期字符串和时间字符串
  if (v) {
    dateString = year + "/" + month + "/" + day;
  } else {
    dateString =
      year + "/" + month + "/" + day + " " + " " + hours + ":" + minutes;
  }
  return dateString;
};
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
    background: #fbfbfb;
    line-height: 40px;
    display: flex;
    flex-wrap: wrap;
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
    margin-bottom: 56px;
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
