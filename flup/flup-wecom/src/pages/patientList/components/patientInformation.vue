<template>
  <div class="patientInfo">
    <div class="backBtn" @click="back">返回列表</div>
    <div class="patient">
      <img v-if="patientInfo.sex == '男'" src="@/assets/img/touxiang.png" alt />
      <img v-else src="@/assets/img/female.png" alt />
      <p class="patientName">
        <span style="font-weight: 700">{{ patientInfo.patientName }}</span>
        <span class="moreInfo" @click="openDia('1')"
          >{{ patientInfo.sex }}/{{ patientInfo.age }}</span
        >
      </p>
    </div>
    <div class="healthManage">
      <div class="blockBtn" @click="openDia('3')" v-show="hospitalList.length"
        >新增计划</div
      >
      <div class="blockTitle">健康管理</div>
      <div class="planType">
        <div
          class="planTOne"
          :class="{ planTChoosed: taskStatus == '今日任务' }"
          @click="changeTs('今日任务')">
          <span>{{ followUpPlan.todayTaskCount }}</span>
          <p>今日计划</p>
        </div>
        <div
          class="planTOne"
          :class="{ planTChoosed: taskStatus == '待执行' }"
          @click="changeTs('待执行')">
          <span>{{ followUpPlan.todoTaskCount }}</span>
          <p>待执行计划</p>
        </div>
        <div
          class="planTOne"
          :class="{ planTChoosed: taskStatus == '已执行' }"
          @click="changeTs('已执行')">
          <span>{{ followUpPlan.doneTaskCount }}</span>
          <p>已执行计划</p>
        </div>
      </div>
      <div
        class="planTags"
        :style="{ height: isTagsOpen ? 'inherit' : '32px' }">
        <div
          class="hideBtn"
          :class="{ openBtn: isTagsOpen }"
          @click="isTagsOpen = !isTagsOpen"
          ><u></u
        ></div>
        <span @click="tagChoosed('')" :class="{ tagChoosed: tagIndex === '' }"
          >全部</span
        >
        <span
          v-for="(item, index) in flupGroup"
          :key="index"
          @click="tagChoosed(index, item)"
          :class="{ tagChoosed: tagIndex === index }"
          >{{ item.planName }}</span
        >
      </div>
      <div class="planList">
        <div
          class="planOne"
          v-for="(item, index) in followUpPlan.plans"
          :key="index"
          :class="{ planChoosed: flupTypeList.indexOf(item.flupType) >= 0 }"
          @click.stop="taskDetail(item)">
          <u></u>
          <div class="planContent">
            <p class="planTitle">{{ item.flupContent }}</p>
            <p class="planTime">{{ item.flupStartTime.slice(0, 10) }}</p>
            <div class="planBtn" @click.stop="sendMsg(item)">发送</div>
            <p
              class="planStatus"
              v-show="
                flupTypeList.indexOf(item.flupType) >= 0 &&
                item.status == '已完成'
              "
              >已完成</p
            >
            <p
              class="planStatus"
              v-show="
                flupTypeList.indexOf(item.flupType) >= 0 &&
                item.status == '已作废'
              "
              style="color: #db524b"
              >已作废</p
            >
          </div>
        </div>
      </div>
    </div>
    <div class="dialog" v-show="dialogShow">
      <div class="dialogBox">
        <u @click="dialogShow = false"></u>
        <div class="dialogTitle" v-show="dialogType == '1'">患者信息</div>
        <div class="dialogTitle" v-show="dialogType == '3'"
          >新增临时随访任务</div
        >
        <div class="dialogContent">
          <div class="patientInfoList" v-show="dialogType == '1'">
            <div class="pilLi">
              <label>姓名</label>
              <p>{{ patientInfo.patientName || '无' }}</p>
            </div>
            <div class="pilLi">
              <label>性别</label>
              <p>{{ patientInfo.sex || '无' }}</p>
            </div>
            <div class="pilLi">
              <label>年龄</label>
              <p>{{ patientInfo.age || '无' }}</p>
            </div>
            <div class="pilLi">
              <label>手机号</label>
              <p>{{ patientInfo.phone || '无' }}</p>
            </div>
            <div class="pilLi">
              <label>身份证号</label>
              <p>{{ patientInfo.idNo || '无' }}</p>
            </div>
            <div class="pilLi">
              <label>过敏史</label>
              <p>{{ patientInfo.allergyHistory || '无' }}</p>
            </div>
            <div class="pilLi">
              <label>家族病史</label>
              <p>{{ patientInfo.familyHistory || '无' }}</p>
            </div>
            <div class="pilLi">
              <label>慢性病</label>
              <p>{{ patientInfo.chronicDisease || '无' }}</p>
            </div>
            <div class="pilLi">
              <label>健管师</label>
              <p>{{ patientInfo.teacher || '无' }}</p>
            </div>
          </div>
          <!-- <div class="tagsListBox">
            <div class="searchBox">
              <input type="text" />
              <u></u>
            </div>
            <div class="tagsList">
              <span>aaaaa</span>
            </div>
          </div> -->
          <div class="followList" v-show="dialogType == '3'">
            <div class="followOne">
              <label>
                <span style="color: #db524b">*</span>
                所属医院
              </label>
              <el-select
                style="width: 100%"
                v-model="form.hospitalId"
                @change="changeHosp"
                placeholder="选择所属医院">
                <el-option
                  v-for="(item, i) in hospitalList"
                  :key="i"
                  :label="item.hospitalName"
                  :value="item.hospitalId"></el-option>
              </el-select>
            </div>
            <div class="followOne">
              <label>
                <span style="color: #db524b">*</span>
                随访计划
              </label>
              <el-select
                style="width: 100%"
                v-model="form.flupPlanId"
                placeholder="选择随访计划">
                <el-option
                  v-for="(item, i) in flupPlanList"
                  :key="i"
                  :label="item.flupPlan"
                  :value="item.flupPlanId"></el-option>
              </el-select>
            </div>
            <div class="followOne">
              <label>
                <span style="color: #db524b">*</span>
                随访日期
              </label>
              <el-date-picker
                style="width: 100%"
                v-model="form.flupStartTime"
                :disabled-date="disabledDate"
                type="date"
                placeholder="选择日期"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"></el-date-picker>
            </div>
            <div class="followOne">
              <label>
                <span style="color: #db524b">*</span>
                随访类型
              </label>
              <el-select
                style="width: 100%"
                v-model="form.flupType"
                @change="switchFollowupType"
                placeholder="请选择">
                <el-option
                  v-for="(item, i) in followupTypeList"
                  :key="i"
                  :label="item.name"
                  :value="item.name"></el-option>
              </el-select>
            </div>
            <div class="followOne" v-if="form.flupType == '调查问卷'">
              <label>
                <span style="color: #db524b">*</span>
                问卷内容
              </label>
              <el-select
                style="width: 100%"
                v-model="form.flupContent"
                filterable
                @change="switchFollowupContent"
                placeholder="请选择">
                <el-option
                  v-for="(item, i) in followupContentList"
                  :key="i"
                  :label="item.questionnaireName"
                  :value="item.questionnaireName"></el-option>
              </el-select>
            </div>
            <div class="followOne" v-if="form.flupType == '健康宣教'">
              <label>
                <span style="color: #db524b">*</span>
                宣教内容
              </label>
              <el-select
                style="width: 100%"
                v-model="form.flupContent"
                @change="switchFollowupContent"
                filterable
                placeholder="请选择">
                <el-option
                  v-for="(item, i) in followupContentList"
                  :key="i"
                  :label="item.questionnaireName"
                  :value="item.questionnaireName"></el-option>
              </el-select>
            </div>
            <div class="followOne" v-if="form.flupType == '专科随访'">
              <label>
                <span style="color: #db524b">*</span>
                随访模板
              </label>
              <el-select
                style="width: 100%"
                v-model="form.flupContent"
                filterable
                @change="switchFollowupContent"
                placeholder="请选择">
                <el-option
                  v-for="(item, i) in followupContentList"
                  :key="i"
                  :label="item.questionnaireName"
                  :value="item.questionnaireName"></el-option>
              </el-select>
            </div>
            <div class="followOne" v-if="form.flupType == '定期复诊'">
              <label>
                <span style="color: #db524b">*</span>
                科室
              </label>
              <el-select
                style="width: 100%"
                v-model="flupContent"
                @change="srflupContent"
                filterable
                placeholder="请选择">
                <el-option
                  v-for="(item, i) in newDeptOptions"
                  :key="i"
                  :label="item.deptName"
                  :value="item.deptName"></el-option>
              </el-select>
              <el-input
                type="textarea"
                style="margin-top: 2px"
                :rows="3"
                placeholder="请输入内容"
                v-model="textarea"
                @input="srflupContent"></el-input>
            </div>
            <div v-if="form.flupType == '定期检查'">
              <el-table
                v-if="form.flupType == '定期检查'"
                :data="dqjcjyList"
                border
                style="width: calc(100% - 20px); margin-bottom: 10px">
                <el-table-column label="检查内容">
                  <template #default="scope">
                    <el-select
                      v-if="scope.row.type"
                      style="width: 100%"
                      v-model="scope.row.examTypeName"
                      @change="getCheckPartsList(scope)"
                      filterable
                      placeholder="请选择">
                      <el-option
                        v-for="(item, i) in checkTypeListOrg"
                        :key="i"
                        :label="item.examTypeName"
                        :value="item.examTypeName"></el-option>
                    </el-select>
                    <p v-else>{{ scope.row.examTypeName }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="检查部位">
                  <template #default="scope">
                    <el-select
                      v-if="scope.row.type"
                      style="width: 100%"
                      v-model="scope.row.examBodyName"
                      @focus="focusBody(scope)"
                      @change="getgetCheckItemList(scope)"
                      filterable
                      placeholder="请选择">
                      <el-option
                        v-for="(item, i) in checkPartsList"
                        :key="i"
                        :label="item.examBodyName"
                        :value="item.examBodyName"></el-option>
                    </el-select>
                    <p v-else>{{ scope.row.examBodyName }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="检查项目">
                  <template #default="scope">
                    <el-select
                      v-if="scope.row.type"
                      style="width: 100%"
                      v-model="scope.row.examItemName"
                      @focus="focusItem(scope)"
                      @change="getflupContent(scope)"
                      filterable
                      placeholder="请选择">
                      <el-option
                        v-for="(item, i) in checkItemList"
                        :key="i"
                        :label="item.examItemName"
                        :value="item.examItemName"></el-option>
                    </el-select>
                    <p v-else>{{ scope.row.examItemName }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="scope">
                    <el-button
                      v-if="scope.row.type"
                      type="text"
                      @click="revocation(scope)"
                      >撤销</el-button
                    >
                    <el-button
                      v-if="!scope.row.type"
                      type="text"
                      @click="redactAddfile(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      v-if="scope.row.type"
                      type="text"
                      @click="affirmAddfile(scope.row)"
                      >确定</el-button
                    >
                    <el-button
                      v-if="!scope.row.type"
                      type="text"
                      @click="erase(scope)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="addBtn" @click="addfile">添加</div>
            </div>
            <div v-if="form.flupType == '定期检验'">
              <el-table
                v-if="form.flupType == '定期检验'"
                :data="dqjcjyList"
                border
                style="width: calc(100% - 20px); margin-bottom: 10px">
                <el-table-column label="检验名称">
                  <template #default="scope">
                    <el-select
                      v-if="scope.row.type"
                      style="width: 100%"
                      v-model="scope.row.ylmc"
                      @change="getflupContentjy(scope)"
                      filterable
                      placeholder="请选择">
                      <el-option
                        v-for="(item, i) in examineList"
                        :key="i"
                        :label="item.ylmc"
                        :value="item.ylmc"></el-option>
                    </el-select>
                    <p v-else>{{ scope.row.ylmc }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="样本类型">
                  <template #default="scope">
                    <el-select
                      v-if="scope.row.type"
                      style="width: 100%"
                      v-model="scope.row.sampledescribe"
                      @change="getflupContentjy(scope)"
                      filterable
                      placeholder="请选择">
                      <el-option
                        v-for="(item, i) in sampleList"
                        :key="i"
                        :label="item.sampledescribe"
                        :value="item.sampledescribe"></el-option>
                    </el-select>
                    <p v-else>{{ scope.row.sampledescribe }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" width="100">
                  <template #default="scope">
                    <el-button
                      v-if="scope.row.type"
                      type="text"
                      @click="revocation(scope)"
                      >撤销</el-button
                    >
                    <el-button
                      v-if="!scope.row.type"
                      type="text"
                      @click="redactAddfile(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      v-if="scope.row.type"
                      type="text"
                      @click="affirmAddfile(scope.row)"
                      >确定</el-button
                    >
                    <el-button
                      v-if="!scope.row.type"
                      type="text"
                      @click="erase(scope)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="addBtn" @click="addfile">添加</div>
            </div>
            <div class="followOne" v-if="form.flupType == '消息提醒'">
              <label>
                <span style="color: #db524b">*</span>
                消息内容
              </label>
              <el-input
                style="width: 100%"
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                :maxlength="50"
                v-model="form.flupContent"
                clearable></el-input>
            </div>
            <div
              class="followOne"
              v-if="form.flupType == '慢病评估报告' && reportList.length">
              <label>
                <span style="color: #db524b">*</span>
                风险评估报告
              </label>
              <el-select
                v-model="diseaseReportId"
                @change="changeDiseaseReport"
                filterable
                placeholder="请选择">
                <el-option
                  v-for="item in reportList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </div>
            <div class="followOne">
              <label>
                <span style="color: #db524b">*</span>
                有效天数
              </label>
              <el-input-number
                class="width170px"
                :min="0"
                :max="9999"
                :step="1"
                step-strictly
                v-model="form.validDate"></el-input-number>
            </div>
            <p class="followOneTip">有效天数为0时，任务永久有效</p>
            <div class="followOne">
              <label>
                <span style="color: #db524b">*</span>
                随访途径
              </label>
              <el-radio-group v-model="form.smartFlupMethod">
                <el-radio
                  v-for="(item, i) in followupWayList"
                  :disabled="item.disabled"
                  :key="i"
                  :label="item.dict_name"
                  >{{ item.dict_name }}</el-radio
                >
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="dialogBtns">
          <div
            class="dialogBtn"
            v-show="dialogType == '1'"
            @click="dialogShow = false"
            >确定</div
          >
          <div
            class="dialogBtn dialogBtnCancel"
            style="margin-right: 10px"
            v-show="dialogType == '3'"
            @click="dialogShow = false"
            >取消</div
          >
          <div
            class="dialogBtn"
            v-show="dialogType == '3'"
            @click="onConfirmNewTask"
            >确定</div
          >
        </div>
      </div>
    </div>
    <DrawerDetail
      :planDetailContent="planDetailContent"
      v-if="drawer"
      @close="closeDrawer"></DrawerDetail>
  </div>
</template>
<script setup>
import { onMounted, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { storage } from '../../../storage';
import { ElMessage, ElMessageBox } from 'element-plus';
import FollowupContent from '../../taskList/components/followup_content.vue';
import DrawerDetail from '../../taskList/components/drawerDetail.vue';
const router = useRouter();
const _http = inject('http');
const _apiUrl = inject('apiUrl');
const _storage = inject('storage');
const patientInfo = ref({
  patientName: '',
  sex: '',
  age: '',
  phone: '',
  idNo: '',
  allergyHistory: '',
  familyHistory: '',
  chronicDisease: '',
  teacher: '',
});
const dictItems = ref([]);
const followupTypeList = ref([]);
const followupWayList = ref([
  {
    dict_name: '电话',
    disabled: true,
  },
  {
    dict_name: '短信',
    disabled: true,
  },
  {
    dict_name: '微信',
    disabled: true,
  },
]);
const followUpPlan = ref({});
const form = ref({
  hospitalId: '',
  flupPlanId: '',
  planNameId: '',
  fuRuleId: '',
  flupStartTime: '',
  validDate: 0,
});
const flupGroup = ref([]);
const hospitalList = ref([]);
const flupPlanList = ref([]);
const dqjcjyList = ref([]);
const flupContent = ref(null);
const textarea = ref(null);
const backups = ref(null);
const diseaseReport = ref('');
const reportList = ref([]);
const newDeptOptions = ref([]);
const checkTypeListOrg = ref([]);
const sampleList = ref([]);
const checkPartsList = ref([]);
const checkItemList = ref([]);
const examineList = ref([]);
const followupContentList = ref([]);
const dialogShow = ref(false);
const isTagsOpen = ref(false);
const dialogType = ref('0');
const tagIndex = ref('');
const diseaseReportId = ref('');
const taskStatus = ref('今日任务');
const groupId = ref('');
const userId = ref('');
const docId = ref('');
const disabledDate = time => {
  return time.getTime() < Date.now() - 8.64e7;
};
const drawer = ref(false);
const drawerTitle = ref('');
const planDetailContent = ref({});
const editItem = ref({});
const checkTypeList = ref([]);
const inspectionNameList = ref([]);
const inspectionTypeList = ref([]);
const tableList = ref([]);
const constructionReport = ref('0'); //检查检验是否需要审核系统配置(0不审核，1审核)
const constructionPaper = ref('0'); //慢病报告是否需要审核系统配置(0不审核，1审核)
const questionnaireRecordtrfa = ref(true);
const questionnaireRecord = ref({});
const flupTypeList = ref([
  '健康宣教',
  '定期复诊',
  '定期检查',
  '定期检验',
  '调查问卷',
  '专科随访',
  '消息提醒',
  '慢病评估报告',
]);
const getFollowUpPlan = () => {
  _http
    .get(_apiUrl.getFollowUpPlan, {
      params: {
        userId: userId.value,
        taskStatus: taskStatus.value,
        flupPlanId: groupId.value,
      },
    })
    .then(res => {
      followUpPlan.value = res;
    });
};
const getFlupGroupByUserId = () => {
  _http
    .get(_apiUrl.currentByAuth, {
      params: {
        patientId: userId.value,
      },
    })
    .then(res => {
      flupGroup.value = res;
    });
};
const getPatientInfo = () => {
  _http
    .post(_apiUrl.getPatientInfo + '?userId=' + userId.value, {})
    .then(res => {
      patientInfo.value = res;
    });
};
const getFlupPlanBelongHospital = () => {
  _http
    .post(_apiUrl.getFlupPlanBelongHospital + '?userId=' + userId.value, {})
    .then(res => {
      hospitalList.value = res;
    });
};
const getFlupPlanByPatientByTeacher = () => {
  _http
    .post(
      _apiUrl.getFlupPlanByPatientByTeacher +
        '?userId=' +
        userId.value +
        '&hospitalId=' +
        form.value.hospitalId,
      {}
    )
    .then(res => {
      flupPlanList.value = res;
    });
};
const getDictItems = () => {
  _http
    .get(_apiUrl.getDictItems, {
      params: {
        parentId: userId.value,
      },
    })
    .then(res => {
      dictItems.value = res;
    });
};
const getData = () => {
  _http
    .get(_apiUrl.getFollowupTypeList, {
      params: {
        hospitalId: form.value.hospitalId,
        keyWord: '',
        enable: 1 || 0,
      },
    })
    .then(res => {
      followupTypeList.value = res.list.filter(item => {
        if (
          item.name &&
          item.name != '处方提醒' &&
          item.enable != 0 &&
          item.name != '慢病评估报告'
        ) {
          return item;
        }
      });
    });
  _http
    .get(_apiUrl.BaseDictGetDictItems, {
      params: {
        parentId: '2019051518541847339f',
      },
    })
    .then(res => {
      followupWayList.value = res;
      followupWayList.value.map(item => {
        return {
          ...item,
          disabled: true,
        };
      });
    });
  _http
    .get(_apiUrl.queryCurrentUserDept, {
      params: {},
    })
    .then(res => {
      newDeptOptions.value = res;
    });
  _http
    .get(_apiUrl.getCheckTypeList + '?hospitalId=' + form.value.hospitalId, {
      params: {},
    })
    .then(res => {
      checkTypeListOrg.value = res.examTypeList;
    });
  _http
    .get(
      _apiUrl.ExaminegetExamineList + '?hospitalId=' + form.value.hospitalId,
      {
        params: {},
      }
    )
    .then(res => {
      examineList.value = res.list;
    });
  _http.get(_apiUrl.ExaminegetSampleList).then(res => {
    sampleList.value = res.list;
  });
};
function back() {
  router.push('/layout/patientList/index');
}
function changeTs(type) {
  taskStatus.value = type;
  getFollowUpPlan();
}
function changeHosp() {
  form.value.flupPlanId = '';
  getFlupPlanByPatientByTeacher();
  getData();
}
function openDia(type) {
  dialogShow.value = true;
  dialogType.value = type;
  if (type == '3') {
    form.value = {
      hospitalId: '',
      flupPlanId: '',
      planNameId: '',
      fuRuleId: '',
      flupStartTime: '',
      validDate: 0,
    };
    followupWayList.value = [
      {
        dict_name: '电话',
        disabled: true,
      },
      {
        dict_name: '短信',
        disabled: true,
      },
      {
        dict_name: '微信',
        disabled: true,
      },
    ];
  }
}
function tagChoosed(index, item) {
  tagIndex.value = index;
  groupId.value = item ? item.serialNo : '';
  getFollowUpPlan();
}
function switchFollowupContent(val) {
  diseaseReportId.value = '';
  diseaseReport.value = '';
  reportList.value = '';
  if (val == '定期复诊') {
    let itemobj = deptList.value.find((value, index, item) => {
      return value.Text == val;
    });
    form.value.flupContentId = itemobj.Value;
  } else {
    let itemobj = followupContentList.value.find((value, index, item) => {
      return value.questionnaireName == val;
    });
    form.value.flupContentId = itemobj.serialNo;
    if (form.value.flupType == '慢病评估报告') {
      var item = JSON.parse(itemobj.content).modules[2];
      if (item.status && item.fields.length > 0) {
        reportList.value = item.fields;
        diseaseReportId.value = diseaseReportId.value
          ? diseaseReportId.value
          : reportList.value[0].id;
        diseaseReport.value = reportList.value[0].questionnaireName;
      }
    }
  }
}
function switchFollowupType(val) {
  dqjcjyList.value = [];
  flupContent.value = null;
  form.value.flupContent = null;
  textarea.value = null;
  form.value.smartFlupMethod = null;
  _http
    .get(_apiUrl.queryFollowUpContent, {
      params: {
        name: val,
        hospitalId: form.value.hospitalId,
      },
    })
    .then(res => {
      followupContentList.value = res;
    });
  getWayDisable();
  form.value.fuContent = '';
  form.value.fuContentId = '';
  diseaseReportId.value = '';
  diseaseReport.value = '';
  reportList.value = '';
}
function getWayDisable() {
  if (form.value.flupType == '专科随访') {
    followupWayList.value.forEach(element => {
      if (element.dict_name == '微信') {
        element.disabled = true;
      } else if (element.dict_name == '电话') {
        element.disabled = false;
      } else if (element.dict_name == '短信') {
        element.disabled = true;
      }
    });
  } else if (form.value.flupType == '调查问卷') {
    followupWayList.value.forEach(element => {
      if (element.dict_name == '电话') {
        element.disabled = false;
      } else if (element.dict_name == '微信') {
        element.disabled = false;
      } else if (element.dict_name == '短信') {
        element.disabled = true;
      }
    });
  } else if (
    form.value.flupType == '健康宣教' ||
    form.value.flupType == '消息提醒' ||
    form.value.flupType == '定期复诊'
  ) {
    followupWayList.value.forEach(element => {
      if (element.dict_name == '电话') {
        element.disabled = true;
      } else if (element.dict_name == '微信') {
        element.disabled = false;
      } else if (element.dict_name == '短信') {
        element.disabled = false;
      }
    });
  } else if (
    form.value.flupType == '定期检查' ||
    form.value.flupType == '定期检验'
  ) {
    followupWayList.value.forEach(element => {
      if (element.dict_name == '电话') {
        element.disabled = true;
      } else if (element.dict_name == '微信') {
        element.disabled = false;
      } else if (element.dict_name == '短信') {
        element.disabled = true;
      }
    });
  } else {
    followupWayList.value.forEach(element => {
      if (element.dict_name == '电话') {
        element.disabled = true;
      } else if (element.dict_name == '微信') {
        element.disabled = true;
      } else if (element.dict_name == '短信') {
        element.disabled = true;
      }
    });
  }
}
function srflupContent() {
  if (flupContent.value && textarea.value) {
    form.value.flupContent = flupContent.value + '|' + textarea.value;
  } else {
    form.value.flupContent = null;
  }
}
function addfile() {
  if (JSON.stringify(dqjcjyList.value).indexOf('true') != -1) {
    ElMessage({
      message: '请保存后再添加!',
      type: 'warning',
    });
    return;
  }
  backups.value = JSON.parse(JSON.stringify(dqjcjyList.value));
  if (form.value.flupType == '定期检查') {
    dqjcjyList.value.push({
      examTypeId: null,
      examTypeName: null,
      examBodyId: null,
      examBodyName: null,
      examItemId: null,
      examItemName: null,
      type: true,
    });
  } else if (form.value.flupType == '定期检验') {
    dqjcjyList.value.push({
      ylmc: null,
      autoid1: null,
      autoid2: null,
      sampledescribe: null,
      type: true,
    });
  }
}
function revocation(scope) {
  dqjcjyList.value = JSON.parse(JSON.stringify(backups.value));
  checkPartsList.value = [];
  checkItemList.value = [];
}
function redactAddfile(row) {
  if (JSON.stringify(dqjcjyList.value).indexOf('true') != -1) {
    ElMessage({
      message: '请保存后再编辑!',
      type: 'warning',
    });
    return;
  }
  checkPartsList.value = [];
  checkItemList.value = [];
  backups.value = JSON.parse(JSON.stringify(dqjcjyList.value));
  row.type = true;
}
function affirmAddfile(row) {
  if (
    (form.value.flupType == '定期检查' &&
      row.examTypeId &&
      row.examBodyId &&
      row.examItemId) ||
    (form.value.flupType == '定期检验' && row.ylmc && row.sampledescribe)
  ) {
    row.type = false;
  } else {
    ElMessage({
      message: '请全部选择后再点击!',
      type: 'warning',
    });
  }
}
function erase(scope) {
  dqjcjyList.value.splice(scope.$index, 1);
}
function getflupContentjy(scope) {
  if (scope.row.ylmc) {
    for (let i in examineList.value) {
      if (examineList.value[i].ylmc == scope.row.ylmc) {
        scope.row.autoid1 = examineList.value[i].autoid;
      }
    }
  }
  if (scope.row.sampledescribe) {
    for (let i in sampleList.value) {
      if (sampleList.value[i].sampledescribe == scope.row.sampledescribe) {
        scope.row.autoid2 = sampleList.value[i].autoid;
      }
    }
  }
}
function getflupContent(scope) {
  for (let i in checkItemList.value) {
    if (checkItemList.value[i].examItemName == scope.row.examItemName) {
      scope.row.examItemId = checkItemList.value[i].examItemId;
    }
  }
}
function getCheckPartsList(scope) {
  scope.row.examBodyId = null;
  scope.row.examBodyName = null;
  scope.row.examItemId = null;
  scope.row.examItemName = null;
  for (let i in checkTypeListOrg.value) {
    if (checkTypeListOrg.value[i].examTypeName == scope.row.examTypeName) {
      scope.row.examTypeId = checkTypeListOrg.value[i].examTypeId;
    }
  }
  // _http
  //   .get(
  //     _apiUrl.ExaminegetCheckPartsList + '?hospitalId=' + form.value.hospitalId,
  //     {
  //       params: {
  //         examTypeId: scope.row.examTypeId,
  //       },
  //     }
  //   )
  //   .then(res => {
  //     checkPartsList.value = res.examBodyInfoList;
  //   });
}
function focusBody(scope) {
  let examTypeId = '';
  for (let i in checkTypeListOrg.value) {
    if (
      checkTypeListOrg.value[i].examTypeName ==
      dqjcjyList.value[scope.$index].examTypeName
    ) {
      examTypeId = checkTypeListOrg.value[i].examTypeId;
    }
  }
  _http
    .get(
      _apiUrl.ExaminegetCheckPartsList + '?hospitalId=' + form.value.hospitalId,
      {
        params: {
          examTypeId: examTypeId,
        },
      }
    )
    .then(res => {
      checkPartsList.value = res.examBodyInfoList;
    });
}
function getgetCheckItemList(scope) {
  scope.row.examItemId = null;
  scope.row.examItemName = null;
  for (let i in checkPartsList.value) {
    if (checkPartsList.value[i].examBodyName == scope.row.examBodyName) {
      scope.row.examBodyId = checkPartsList.value[i].examBodyId;
    }
  }
  // _http
  //   .get(
  //     _apiUrl.ExaminegetCheckItemList + '?hospitalId=' + form.value.hospitalId,
  //     {
  //       params: {
  //         examBodyId: scope.row.examBodyId,
  //       },
  //     }
  //   )
  //   .then(res => {
  //     checkItemList.value = res.examItemInfos;
  //   });
}
function focusItem(scope) {
  let examBodyId = '';
  for (let i in checkPartsList.value) {
    if (
      checkPartsList.value[i].examBodyName ==
      dqjcjyList.value[scope.$index].examBodyName
    ) {
      examBodyId = checkPartsList.value[i].examBodyId;
    }
  }
  _http
    .get(
      _apiUrl.ExaminegetCheckItemList + '?hospitalId=' + form.value.hospitalId,
      {
        params: {
          examBodyId: examBodyId,
        },
      }
    )
    .then(res => {
      checkItemList.value = res.examItemInfos;
    });
}
function changeDiseaseReport() {
  let itemobj = reportList.value.find((value, index, item) => {
    return value.id == diseaseReportId.value;
  });
  diseaseReport.value = itemobj.name;
}
async function onConfirmNewTask(v) {
  let data = form.value;
  flupPlanList.value.forEach(item => {
    if (item.flupPlanId == form.value.flupPlanId) {
      data.flupPlan = item.flupPlan;
      data.flupRuleId = item.flupRuleId;
      data.oldTaskSerialNo = item.serialNo;
    }
  });
  data.followupPathWayId =
    form.value.smartFlupMethod == '电话'
      ? 'PHONE'
      : form.value.smartFlupMethod == '短信'
      ? 'SMS'
      : form.value.smartFlupMethod == '微信'
      ? 'Wechat'
      : '';
  if (
    (data.flupType == '定期检查' || data.flupType == '定期检验') &&
    (!dqjcjyList.value.length ||
      JSON.stringify(dqjcjyList.value).indexOf('true') != -1)
  ) {
    ElMessage({
      message: '请选择' + data.flupType + '内容',
      type: 'warning',
    });
    return;
  }
  if (data) {
    //拼接风险评估报告
    if (data.flupType == '慢病评估报告' && diseaseReportId.value) {
      data.fuContent = data.fuContent + '|' + diseaseReport.value;
      data.fuContentId = data.fuContentId + '|' + diseaseReportId.value;
      data.flupContent = data.fuContent + '|' + diseaseReport.value;
      data.flupContentId = data.fuContentId + '|' + diseaseReportId.value;
    }
    if (data.flupType == '定期检查') {
      let list = [];
      for (let i in dqjcjyList.value) {
        let flupContent =
          dqjcjyList.value[i].examTypeName +
          '|' +
          dqjcjyList.value[i].examTypeId +
          '|' +
          dqjcjyList.value[i].examBodyName +
          '|' +
          dqjcjyList.value[i].examBodyId +
          '|' +
          dqjcjyList.value[i].examItemName +
          '|' +
          dqjcjyList.value[i].examItemId;
        list.push(flupContent);
      }
      data.flupContent = list.join(',');
    }
    if (data.flupType == '定期检验') {
      let list = [];
      for (let i in dqjcjyList.value) {
        let flupContent =
          dqjcjyList.value[i].ylmc +
          '|' +
          dqjcjyList.value[i].autoid1 +
          '|' +
          dqjcjyList.value[i].sampledescribe +
          '|' +
          dqjcjyList.value[i].autoid2;
        list.push(flupContent);
      }
      data.flupContent = list.join(',');
    }
    let patientInfo = {};
    _http
      .get(_apiUrl.queryJoinPlanPatientTypeById, {
        params: {
          serialNo: form.value.flupPlanId,
        },
      })
      .then(res => {
        _http
          .get(_apiUrl.getPatientInfoBySerialNo, {
            params: {
              serialNo: form.value.flupPlanId,
              patientTypeCode: res[0].patientTypeCode,
            },
          })
          .then(item => {
            if (item) {
              patientInfo.deptName = item.deptName;
              patientInfo.deptCode = item.deptCode;
              patientInfo.dateOfBirth = item.dateOfBirth;
              patientInfo.idNo = item.idNo;
              patientInfo.packageCode = item.packageCode;
            }
          });
      });
    _http
      .post(_apiUrl.addTemporaryFollowUpTask, {
        params: {
          ...data,
          ...patientInfo,
          followupPathWay: data.smartFlupMethod,
          hospitalId: form.value.hospitalId,
          userId: userId.value,
          checkItems: null,
        },
      })
      .then(res => {
        if (res) {
          ElMessage({
            message: '创建成功',
            type: 'success',
          });
        } else {
          ElMessage({
            message: '创建失败',
            type: 'error',
          });
        }
        dialogShow.value = false;
        getFollowUpPlan();
      });
  }
}
function taskDetail(task) {
  if (flupTypeList.value.indexOf(task.flupType) < 0) {
    return;
  }
  drawerTitle.value = task.flupType;
  planDetailContent.value = { ...task };
  if (
    planDetailContent.value.flupType === '定期检查' ||
    planDetailContent.value.flupType === '定期检验'
  ) {
    if (planDetailContent.value.flupType === '定期检查') {
      getCheckTypeList();
      editItem.value = {
        checkType: '',
        checkPart: '',
        checkItem: '',
        isEdit: true,
      };
    } else {
      getInspectionNameList();
      getInspectionTypeList();
      editItem.value = {
        examType: '',
        examItem: '',
        isEdit: true,
      };
    }
    getItemList(planDetailContent.value);
  }
  drawer.value = true;
}
function sendMsg(item) {
  wx.invoke(
    'sendChatMessage',
    {
      msgtype: 'news', //消息类型，必填
      enterChat: true, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段
      news: {
        link:
          item.flupAddress + `&userId=${_storage.getLocalStorage('userId')}`, //H5消息页面url 必填
        title: item.flupType, //H5消息标题
        desc: item.flupContent, //H5消息摘要
        imgUrl:
          'https://premisd.zwjk.com/flup/api/file/image/202307100910320080ky', //H5消息封面图片URL
      },
    },
    function (res) {
      if (res.err_msg == 'sendChatMessage:ok') {
        //发送成功
        console.log('发送成功');
      }
    }
  );
}
function getCheckTypeList() {
  _http
    .get(_apiUrl.ExaminegetCheckTypeList, {
      params: {
        hospitalId: '1118033010334208499', //医院id写死了要改
      },
    })
    .then(res => {
      checkTypeList.value = res.examTypeList;
    });
}
function getInspectionNameList() {
  _http
    .get(_apiUrl.ExaminegetExamineList, {
      params: {
        hospitalId: '1118033010334208499', //医院id写死了要改
      },
    })
    .then(res => {
      inspectionNameList.value = res.list;
    });
}
function getInspectionTypeList() {
  _http
    .get(_apiUrl.ExaminegetSampleList, {
      params: {
        hospitalId: '1118033010334208499', //医院id写死了要改
      },
    })
    .then(res => {
      inspectionTypeList.value = res.list;
    });
}
function getItemList(res) {
  tableList.value = res.flupContent
    ? res.flupContent.split(',').map(item => {
        if (planDetailContent.value.flupType === '定期检查') {
          return {
            checkType: item.split('|')[0],
            checkTypeCode: item.split('|')[1],
            checkPart: item.split('|')[2],
            checkPartCode: item.split('|')[3],
            checkItem: item.split('|')[4],
            checkItemCode: item.split('|')[5],
          };
        } else {
          return {
            examItem: item.split('|')[0],
            examItemCode: item.split('|')[1],
            examType: item.split('|')[2],
            examTypeCode: item.split('|')[3],
          };
        }
      })
    : [];
  tableList.value.forEach(item => {
    item.isEdit = false;
  });
}
function closeDrawer(obj) {
  if (obj.refresh) {
    getFollowUpPlan();
  }
  if (obj.close) {
    drawer.value = false;
    planDetailContent.value = {};
  }
}
onMounted(() => {
  userId.value = router.currentRoute.value.query.userId;
  docId.value = storage.getLocalStorage('userInfo').UserId;
  getFollowUpPlan();
  getFlupGroupByUserId();
  getPatientInfo();
  getFlupPlanBelongHospital();
});
</script>
<style lang="scss" scoped>
.patientInfo {
  position: relative;
  height: 100%;
  overflow-y: auto;
  .addBtn {
    margin: 5px;
    margin-left: 15px;
    padding-left: 22px;
    left: 16px;
    font-size: 12px;
    color: #2d81ed;
    background: url('../../../assets/img/addBtnBg.png') no-repeat;
    background-size: 16px;
  }
  .backBtn {
    z-index: 9;
    position: absolute;
    right: 0;
    top: 14px;
    line-height: 20px;
    padding: 0 8px;
    font-size: 12px;
    color: #ffffff;
    border-radius: 20px 0 0 20px;
    background: linear-gradient(90deg, #1a85ff 0%, #4dc9ff 100%);
    cursor: pointer;
  }
  .patient {
    position: relative;
    border-bottom: 9px solid #f6f6f6;
    background: #fff;
    img {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translate(0, -50%);
      width: 40px;
      height: 40px;
      border-radius: 40px;
      object-fit: cover;
    }
    .patientName {
      padding: 25px 64px;
      line-height: 18px;
      font-size: 14px;
      color: #111111;
      .moreInfo {
        cursor: pointer;
        margin-left: 8px;
        padding-right: 20px;
        color: #666666;
        background: url('../../../assets/img/patientNameBg.png') no-repeat right;
        background-size: 12px;
      }
    }
    .patientTags {
      padding-left: 64px;
      min-height: 20px;
      span {
        margin-right: 4px;
        margin-bottom: 4px;
        padding: 0 10px;
        border-radius: 10px;
        background: #eef6ff;
        font-size: 12px;
        font-weight: normal;
        letter-spacing: 0px;
        line-height: 20px;
        color: #305680;
        cursor: pointer;
      }
      u {
        display: inline-block;
        vertical-align: middle;
        margin-left: 4px;
        margin-bottom: 4px;
        width: 16px;
        height: 16px;
        background: url('../../../assets/img/addBtnBg.png') no-repeat center;
        background-size: 16px;
        cursor: pointer;
      }
    }
  }
  .healthManage {
    position: relative;
    .blockBtn {
      z-index: 9;
      position: absolute;
      right: 10px;
      top: 10px;
      padding: 0 8px;
      border-radius: 10px;
      background: #ffffff;
      box-sizing: border-box;
      border: 1px solid #2d81ed;
      line-height: 20px;
      font-size: 12px;
      color: #2d81ed;
      cursor: pointer;
    }
    .blockTitle {
      position: relative;
      padding: 10px 20px;
      font-size: 16px;
      letter-spacing: 0em;
      color: #111111;
      &::before {
        content: '';
        display: block;
        width: 4px;
        height: 17px;
        position: absolute;
        top: 12px;
        left: 10px;
        background: #2d81ed;
      }
    }
    .planType {
      display: flex;
      justify-content: space-between;
      padding: 4px 10px;
      .planTOne {
        position: relative;
        width: 30%;
        padding: 8px 0;
        border-radius: 4px;
        text-align: center;
        font-size: 16px;
        line-height: 21px;
        color: #2d81ed;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        span {
          font-weight: 700;
        }
        p {
          margin-top: 2px;
          font-size: 12px;
          line-height: 16px;
          color: #666666;
        }
      }
      .planTChoosed {
        color: #fff;
        background: linear-gradient(236deg, #42b4ff 4%, #217aed 99%);
        p {
          color: #fff;
        }
        &::after {
          content: '';
          z-index: -1;
          display: block;
          width: 10px;
          height: 10px;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: rotate(-45deg) translate(-50%, 0);
          background: linear-gradient(234deg, #42b4ff 4%, #217aed 98%);
        }
      }
    }
    .planTags {
      position: relative;
      height: 22px;
      margin-top: 16px;
      padding-left: 10px;
      overflow: hidden;
      .hideBtn {
        position: absolute;
        right: 0;
        top: 0;
        width: 49px;
        height: 20px;
        background: url('../../../assets/img/hideBtnShadow.png') no-repeat;
        background-size: cover;
        cursor: pointer;
        u {
          position: absolute;
          right: 10px;
          top: 2px;
          width: 15px;
          height: 15px;
          background: url('../../../assets/img/hideBtn.png') no-repeat;
          background-size: contain;
        }
      }
      .openBtn {
        u {
          background: url('../../../assets/img/openBtn.png') no-repeat;
          background-size: contain;
        }
      }
      span {
        display: inline-block;
        margin-right: 8px;
        margin-bottom: 10px;
        padding: 0 10px;
        line-height: 20px;
        border-radius: 100px;
        background: #f7f7f7;
        font-size: 12px;
        color: #333333;
        cursor: pointer;
      }
      .tagChoosed {
        font-weight: 700;
        color: #ffffff;
        background: linear-gradient(245deg, #42b4ff 5%, #217aed 99%);
      }
    }
    .planList {
      margin-top: 10px;
      .planOne {
        position: relative;
        padding-bottom: 14px;
        overflow: hidden;
        cursor: pointer;
        &::before {
          content: '';
          display: block;
          width: 1px;
          height: 1000px;
          position: absolute;
          top: 0;
          left: 16.5px;
          background: #c6c9ce;
        }
        u {
          display: block;
          width: 14px;
          height: 14px;
          border-radius: 14px;
          background: transparent;
          position: absolute;
          left: 10px;
          top: 15px;
          &::before {
            content: '';
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 8px;
            position: absolute;
            top: 3px;
            left: 3px;
            background: #c6c9ce;
          }
        }
        .planContent {
          position: relative;
          margin-left: 34px;
          margin-right: 10px;
          padding: 10px;
          border-radius: 4px;
          background: linear-gradient(90deg, #ffffff 0%, #fff4e8 100%);
          box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          &::before {
            content: '';
            display: block;
            width: 4px;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: #ff8000;
          }
          .planTitle {
            margin-bottom: 6px;
            line-height: 18px;
            font-size: 14px;
            color: #111111;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .planTime {
            font-size: 14px;
            line-height: 17px;
            color: #999999;
          }
          .planBtn {
            margin-top: 10px;
            display: inline-block;
            line-height: 18px;
            border-radius: 10px;
            font-size: 12px;
            padding: 0 8px;
            color: #2d81ed;
            border: 1px solid #2d81ed;
          }
          .planStatus {
            position: absolute;
            right: 10px;
            bottom: 10px;
            font-size: 12px;
            line-height: 16px;
            color: #00982d;
          }
        }
        &:first-child {
          &::before {
            top: 19px;
          }
        }
        &:last-child {
          &::before {
            top: inherit;
            bottom: 100%;
            transform: translate(0, 19px);
          }
        }
      }
      .planChoosed {
        u {
          display: block;
          width: 14px;
          height: 14px;
          border-radius: 14px;
          background: rgba(#2d81fe, 0.2);
          position: absolute;
          left: 10.5px;
          top: 15px;
          &::before {
            content: '';
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 8px;
            position: absolute;
            top: 3px;
            left: 3px;
            background: #2d81fe;
          }
        }
        .planContent {
          background: linear-gradient(90deg, #ffffff 0%, #e8f2ff 100%);
          &::before {
            background: #2d81fe;
          }
        }
      }
    }
  }
  .dialog {
    z-index: 9;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    .el-table {
      margin: 0 10px;
    }
    .dialogBox {
      position: absolute;
      top: 10%;
      left: 0;
      width: 100%;
      height: 90%;
      background: #ffffff;
      border-radius: 8px 8px 0 0;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
      u {
        position: absolute;
        right: 10px;
        top: 18px;
        display: block;
        width: 14px;
        height: 14px;
        background: url('../../../assets/img/closeIcon.png') no-repeat;
        background-size: contain;
        cursor: pointer;
      }
      .dialogTitle {
        position: relative;
        margin: 14px 20px;
        font-size: 16px;
        color: #111111;
        &::before {
          content: '';
          display: block;
          width: 4px;
          height: 17px;
          position: absolute;
          left: -10px;
          top: 2px;
          background: #2d81ed;
        }
      }
      .dialogContent {
        position: absolute;
        left: 0;
        right: 0;
        top: 49px;
        bottom: 53px;
        overflow: auto;
        .patientInfoList {
          padding: 4px 0;
          .pilLi {
            position: relative;
            margin-bottom: 10px;
            min-height: 18px;
            line-height: 18px;
            font-size: 14px;
            color: #3b5370;
            label {
              position: absolute;
              left: 0;
              top: 0;
              display: block;
              width: 22%;
              text-align: right;
            }
            p {
              color: #111;
              padding-left: 26%;
              padding-right: 10px;
            }
          }
        }
        // .tagsListBox {
        //   padding: 2px 0;
        //   .searchBox {
        //     border: 1px solid #c4cbd4;
        //   }
        // }
        .followList {
          padding: 6px 0;
          .followOne {
            position: relative;
            margin-bottom: 14px;
            padding-left: 88px;
            padding-right: 12px;
            min-height: 28px;
            line-height: 28px;
            font-size: 14px;
            color: #3b5370;
            > label {
              position: absolute;
              left: 0;
              top: 0;
              display: block;
              width: 74px;
              text-align: right;
            }
            input {
              box-sizing: border-box;
              border: 1px solid #d7dae0;
              line-height: 26px;
              border-radius: 4px;
              width: 100%;
            }
          }
          .followOneTip {
            margin-bottom: 10px;
            padding-left: 88px;
            font-size: 12px;
            font-weight: normal;
            letter-spacing: 0em;
            color: #db524b;
          }
        }
      }
    }
    .dialogBtns {
      box-sizing: border-box;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 0 12px;
      text-align: right;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
      .dialogBtn {
        display: inline-block;
        margin: 12px 0;
        padding: 0 15px;
        border-radius: 4px;
        line-height: 26px;
        font-size: 14px;
        color: #f4f5f6;
        background: #2d81ed;
        border: 1px solid #2d81ed;
        cursor: pointer;
      }
      .dialogBtnCancel {
        border: 1px solid #cccccc;
        background: #fff;
        color: #666666;
      }
    }
  }
  .el-overlay {
    .el-drawer__header {
      margin-bottom: 0px;
    }
    .drawer-header {
      font-family: MicrosoftYaHei;
      font-size: 16px;
      font-weight: normal;
      letter-spacing: 0em;
      color: #111111;
      display: flex;
      align-items: center;
      .short {
        width: 4px;
        height: 17px;
        opacity: 1;
        background: #2d81ed;
        margin-right: 6px;
      }
    }
    .el-drawer__body {
      .base {
        border-bottom: 1px solid #c4cbd4;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        font-weight: normal;
        text-align: right;
        letter-spacing: 0em;
        color: #3b5370;
        padding-bottom: 12px;
        .base-centent {
          display: flex;
          margin-top: 10px;
          .label {
            width: 35%;
            text-align: right;
            min-width: 84px;
          }
          .text {
            color: #111111;
            margin-left: 14px;
            width: 100%;
            text-align: left;
            .el-input {
              width: 100% !important;
            }
          }
        }
      }
      .content {
        padding: 12px 0 0 0;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        font-weight: normal;
        letter-spacing: 0em;
        color: #111111;
        .detail {
          background: #fafafa;
          padding: 10px;
          margin-top: 10px;
          .question {
            .el-form-item__label {
              justify-content: flex-start !important;
            }
          }
        }
      }
    }
    .el-drawer__footer {
      .destory {
        border: 1px solid #db524b;
        color: #db524b;
        background: #ffffff;
      }
      .tips {
        color: #666;
        text-align: center;
        font-size: 12px;
        padding: 10px 0;
      }
    }
  }
}
</style>
