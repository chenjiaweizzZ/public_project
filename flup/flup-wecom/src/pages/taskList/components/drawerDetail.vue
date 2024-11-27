<template>
  <section class="drawer-detail">
    <el-drawer direction="btt" size="80%" :close-on-click-modal="false" v-model="contentDrawer" @close="cancelClick">
      <template #header>
        <div class="drawer-header">
          <div class="short"></div>
          {{ planDetailContent.flupType }}
          <span v-if="planDetailContent.authState == 30" class="result">(已作废)</span>
        </div>
      </template>
      <template #default>
        <div class="base">
          <div class="base-centent">
            <div class="label">计划类型</div>
            <div class="text">{{ planDetailContent.flupType }}</div>
          </div>
          <div class="base-centent">
            <div class="label">计划发送时间</div>
            <div class="text">
              {{
              planDetailContent.flupStartTime.slice(0, 10)
              }}
            </div>
          </div>
          <div
            class="base-centent"
            v-if="
              (constructionReport == '0' &&
                (planDetailContent.flupType == '定期检查' ||
                  planDetailContent.flupType == '定期检验')) ||
              planDetailContent.flupType == '定期复诊'
            "
          >
            <div class="label">预约时间</div>
            <div class="text">
              <el-date-picker
                v-model="planDetailContent.appointmentTime"
                type="datetime"
                placeholder="请选择日期和时间"
                :default-time="defaultTime"
                :disabled-date="disabledDate"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :disabled="planDetailContent.flupTimeReal"
              />
            </div>
          </div>
          <div
            class="base-centent"
            v-if="
              (constructionReport == '0' &&
                (planDetailContent.flupType == '定期检查' ||
                  planDetailContent.flupType == '定期检验')) ||
              planDetailContent.flupType == '定期复诊'
            "
          >
            <div class="label">备注信息</div>
            <div class="text">
              <el-input v-model="planDetailContent.remark2" placeholder="请输入备注" maxlength="200" show-word-limit type="textarea" :disabled="planDetailContent.flupTimeReal" />
            </div>
          </div>
        </div>
        <div class="content">
          <div style="padding-left: 10px">内容</div>
          <div class="detail">
            <FollowupContent
              v-if="
                questionnaireRecordtrfa &&
                planDetailContent.flupType != '定期检验' &&
                planDetailContent.flupType != '定期检查'
              "
              ref="followupContentRef"
              :planDetailContent="planDetailContent"
              :form="{
                appointmentTime: planDetailContent.appointmentTime,
                remark2: planDetailContent.remark2,
              }"
              :questionnaireRecord="questionnaireRecord"
              @refresh="refresh"
              @changeItem="changeItem"
              class="followup_content"
            ></FollowupContent>
            <el-table
              class="margin-top20"
              :data="tableList"
              highlight-current-row
              stripe
              border
              v-if="
                planDetailContent.flupType == '定期检验' ||
                planDetailContent.flupType == '定期检查'
              "
            >
              <el-table-column type="index" label="序号" :width="50"></el-table-column>
              <template v-if="planDetailContent.flupType == '定期检查'">
                <el-table-column show-overflow-tooltip label="检查内容">
                  <template #default="scope">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.checkType" @change="switchType(scope.row)" value-key="id" placeholder="请选择检查内容">
                      <el-option v-for="(item, index) in checkTypeList" :key="index" :label="item.examTypeName" :value="item.examTypeName" />
                    </el-select>
                    <div v-else>{{ scope.row.checkType }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="检查部位">
                  <template #default="scope">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.checkPart" @change="switchPart(scope.row)" value-key="id" placeholder="请选择检查部位">
                      <el-option v-for="(item, index) in checkPartList" :key="index" :label="item.examBodyName" :value="item.examBodyName" />
                    </el-select>
                    <div v-else>{{ scope.row.checkPart }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="检查项目">
                  <template #default="scope">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.checkItem" @change="switchItem(scope.row)" placeholder="请选择检查项目">
                      <el-option v-for="(item, index) in checkItemList" :key="index" :label="item.examItemName" :value="item.examItemName"></el-option>
                    </el-select>
                    <div v-else>{{ scope.row.checkItem }}</div>
                  </template>
                </el-table-column>
              </template>
              <template v-else>
                <el-table-column show-overflow-tooltip label="检验名称">
                  <template #default="scope">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.examItem" placeholder="请选择检验名称">
                      <el-option v-for="(item, inedx) in inspectionNameList" :key="inedx" :label="item.ylmc" :value="item.ylmc"></el-option>
                    </el-select>
                    <span v-else>{{ scope.row.examItem }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="样本类型">
                  <template #default="scope">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.examType" placeholder="请选择样本类型">
                      <el-option v-for="(item, index) in inspectionTypeList" :key="index" :label="item.sampledescribe" :value="item.sampledescribe"></el-option>
                    </el-select>
                    <div v-else>{{ scope.row.examType }}</div>
                  </template>
                </el-table-column>
              </template>
              <el-table-column v-if="
                  planDetailContent.authState == 10 && constructionReport != '1'
                " label="操作" width="120">
                <template #default="scope">
                  <div v-if="scope.row.isEdit">
                    <span class="primary" text @click="onConfirmEdit(scope.row)">确定</span>
                    <span class="primary cancel" text @click="onCancel">撤销</span>
                  </div>
                  <div v-else>
                    <span @click="onDelete(scope.row)" class="primary" text>删除</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div
              class="add"
              v-if="
                !planDetailContent.flupTimeReal &&
                constructionReport == '0' &&
                (planDetailContent.flupType == '定期检查' ||
                  planDetailContent.flupType == '定期检验')
              "
              @click="onAdd"
            >
              <img src="@/assets/img/addBtnBg.png" width="16" height="16" />
              <span class="margin-left4 inline-middle">新增</span>
            </div>
            <!-- <el-button type="primary" :icon="Search">Search</el-button> -->
          </div>
        </div>
      </template>
      <template #footer v-if="!planDetailContent.flupTimeReal">
        <!--已执行无操作按钮  -->
        <div style="flex: auto">
          <el-button
            @click="cancelClick"
            v-if="
              (constructionReport != '1' && constructionPaper != '1') ||
              (planDetailContent.flupType != '定期检查' &&
                planDetailContent.flupType != '定期检验' &&
                planDetailContent.flupType != '慢病评估报告')
            "
          >取消</el-button>
          <el-button
            type="primary"
            class="destory"
            @click="onAudit(30)"
            v-if="
              (constructionReport == '0' &&
                (planDetailContent.flupType == '定期检查' ||
                  planDetailContent.flupType == '定期检验')) ||
              (constructionPaper == '0' &&
                planDetailContent.flupType == '慢病评估报告')
            "
          >作废</el-button>
          <el-button
            type="primary"
            @click="onSubmit"
            v-if="
              (constructionReport == '0' &&
                (planDetailContent.flupType == '定期检查' ||
                  planDetailContent.flupType == '定期检验')) ||
              (constructionPaper == '0' &&
                planDetailContent.flupType == '慢病评估报告') ||
              (planDetailContent.flupType != '慢病评估报告' &&
                planDetailContent.flupType != '定期检验' &&
                planDetailContent.flupType != '定期检查')
            "
          >提交</el-button>
          <div
            class="tips"
            v-if="
              (constructionReport == '1' &&
                (planDetailContent.flupType == '定期检查' ||
                  planDetailContent.flupType == '定期检验')) ||
              (constructionPaper == '1' &&
                planDetailContent.flupType == '慢病评估报告')
            "
          >需要审核的记录请到管理后台操作</div>
        </div>
      </template>
    </el-drawer>
  </section>
</template>

<script setup>
import FollowupContent from './followup_content.vue';
import { onMounted, ref, inject, toRefs, defineProps, defineEmits, defineExpose, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const _http = inject('http');
const _apiUrl = inject('apiUrl');
const props = defineProps({
  planDetailContent: Object,
});
const constructionReport = ref('0'); //检查检验是否需要审核系统配置(0不审核，1审核)
const constructionPaper = ref('0'); //慢病报告是否需要审核系统配置(0不审核，1审核)
const contentDrawer = ref(true);
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
const questionnaireRecordtrfa = ref(true);
const tableList = ref([]);
const checkTypeList = ref([]);
const checkPartList = ref([]);
const checkItemList = ref([]);
const inspectionNameList = ref([]);
const inspectionTypeList = ref([]);
const editItem = ref({});
const patientDetailItem = ref({});
// const language = ref('zh-cn');
const followupContentRef = ref();
const disabledDate = (time) => {
  return Date.now() - 3600 * 1000 * 24 > time.getTime();
};
const { type, query, hideSubmit, preview, questionnaireRecord, planDetailContent } = toRefs(props);
watch(planDetailContent, (newName, oldName) => {
  init();
});
onMounted(() => {
  init();
});
const emit = defineEmits(['submit']);
const submit = (v) => {
  emit('submit', v);
};
defineExpose({});
const init = () => {
  if (planDetailContent.value.flupType === '定期检查' || planDetailContent.value.flupType === '定期检验') {
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
  if (planDetailContent.value.flupType === '定期检查' || planDetailContent.value.flupType === '定期检验' || planDetailContent.value.flupType === '慢病评估报告') {
    construction(); //查询系统配置是否审核
  }
};
function getItemList(res) {
  tableList.value = res.flupContent
    ? res.flupContent.split(',').map((item) => {
        if (planDetailContent.value.flupType == '定期检查') {
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
  tableList.value.forEach((item) => {
    item.isEdit = false;
  });
}
function onAdd() {
  let length = tableList.value.length;
  if (length > 0) {
    if (tableList.value[length - 1].isEdit === true) {
      ElMessage.error('请保存后再编辑');
      return;
    } else {
      tableList.value.push({ ...editItem.value });
    }
  } else {
    tableList.value.push({ ...editItem.value });
  }
}
function switchType(val) {
  let typeID = checkTypeList.value.find((item) => {
    return item.examTypeName == val.checkType;
  }).examTypeId;
  val.checkTypeCode = typeID;
  _http
    .get(_apiUrl.ExaminegetCheckPartsList, {
      params: {
        hospitalId: planDetailContent.value.hospitalId,
        examTypeId: typeID,
      },
    })
    .then((res) => {
      if (res) {
        checkPartList.value = res.examBodyInfoList;
      } else {
        ElMessage.error('当前系统错误');
      }
    });
}
function switchPart(val) {
  // this.editRow.checkItem = '';
  // this.editRow.checkItemCode = '';
  let bodyID = checkPartList.value.find((item) => {
    return item.examBodyName == val.checkPart;
  }).examBodyId;
  val.checkPartCode = bodyID;
  _http
    .get(_apiUrl.ExaminegetCheckItemList, {
      params: {
        hospitalId: planDetailContent.value.hospitalId,
        // examItemLike: '',
        examBodyId: bodyID,
      },
    })
    .then((res) => {
      if (res) {
        checkItemList.value = res.examItemInfos;
      } else {
        ElMessage.error('当前系统错误');
      }
    });
}
function switchItem(val) {
  let itemID = checkItemList.value.find((item) => {
    return item.examItemName == val.checkItem;
  }).examItemId;
  val.checkItemCode = itemID;
}
function onCancel() {
  tableList.value.splice(tableList.value.length - 1, 1);
}
function onConfirmEdit(row) {
  if (planDetailContent.value.flupType === '定期检查') {
    if (!row.checkType) {
      ElMessage.error('请选择检查内容');
      return;
    } else if (!row.checkPart) {
      ElMessage.error('请选择检查部位');
      return;
    } else if (!row.checkItem) {
      ElMessage.error('请选择检查项目');
      return;
    }
  } else {
    if (!row.examType) {
      ElMessage.error('请选择样本类型');
      return;
    } else if (!row.examItem) {
      ElMessage.error('请输入检验名称');
      return;
    }
  }
  _http
    .get(_apiUrl.saveSendCheckContent, {
      params: {
        serialNo: planDetailContent.value.serialNo,
        flupContent: convertData(),
      },
    })
    .then((res) => {
      if (res) {
        ElMessage({
          message: '保存成功',
          type: 'success',
        });
        row.isEdit = false;
        emit('close', { refresh: true, close: false });
      } else {
        ElMessage.error('当前系统错误');
      }
    });
}
function convertData() {
  return tableList.value
    .map((element) => {
      if (planDetailContent.value.flupType == '定期检查') {
        return `${element.checkType}|${element.checkTypeCode}|${element.checkPart}|${element.checkPartCode}|${element.checkItem}|${element.checkItemCode}`;
      } else {
        return `${element.examItem}|${element.examItemCode}|${element.examType}|${element.examTypeCode}`;
      }
    })
    .join(',');
}
function onDelete(row) {
  let edit = tableList.value.findIndex((i) => {
    return i.isEdit == true;
  });
  if (edit != -1) {
    ElMessage({
      message: '有正在编辑的数据,请先保存',
      type: 'warning',
    });
    return;
  }
  ElMessageBox.confirm('是否删除?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      let index = tableList.value.findIndex((i) => {
        return i == row;
      });
      tableList.value.splice(index, 1);
      _http
        .get(_apiUrl.saveSendCheckContent, {
          params: {
            serialNo: planDetailContent.value.serialNo,
            flupContent: convertData(),
          },
        })
        .then((res) => {
          if (res) {
            ElMessage({
              message: '操作成功',
              type: 'success',
            });
            row.isEdit = false;
            emit('close', { refresh: true, close: false });
          } else {
            ElMessage.error('当前系统错误');
          }
        });
    })
    .catch(() => {
      ElMessage({
        message: '已取消删除',
        type: 'success',
      });
    });
}
function cancelClick() {
  // drawer.value = false;
  emit('close', { refresh: false, close: true });
}
const construction = () => {
  //审核开关
  _http
    .get(_apiUrl.queryFlupConfigAllByGroup, {
      params: {
        hospitalId: planDetailContent.value.hospitalId,
      },
    })
    .then((res) => {
      if (res) {
        let list = res.find((i) => {
          return i.moduleName == '随访配置';
        });
        let report = list.childList.find((i) => {
          return i.componentDescription == '检查检验审核';
        });
        let paper = list.childList.find((i) => {
          return i.componentDescription == '评估报告审核';
        });
        constructionReport.value = report ? report.componentValue : '1';
        constructionPaper.value = paper ? paper.componentValue : '1';
      } else {
        ElMessage.error('当前系统错误');
      }
    });
};
//提交
function onSubmit() {
  // if (this.form.editPhone.length != 11 && this.form.editPhone.length > 0) {
  //   this.$message.warning('请输入正确的随访电话!')
  //   return
  // }
  let params = {
    serialNo: planDetailContent.value.serialNo,
    flupState: 1,
    // flupPhone: planDetailContent.value.editPhone,
    appointmentTime: planDetailContent.value.appointmentTime,
    remark2: planDetailContent.value.remark2,
    nextFlupTime: null,
    // coordination: parseInt(this.form.coordination),
    // crowdType: this.crowTypes.join(','),
    // bToken: this.$cookie.get('token') || this.$route.query.token,///////////////要改
  };
  if (planDetailContent.value.flupType === '专科随访') {
    // params.modifyStatus = this.disabledButton;///////////////要改

    followupContentRef.value.postMessage({
      user_id: planDetailContent.value.userId,
      old_flup_phone: planDetailContent.value.mobile || planDetailContent.value.phone || planDetailContent.value.contactPhone,
      // flup_phone: this.form.editPhone,
      // flup_status: this.form.followupResult,
      // flup_time_real: this.completeDate,
    });
    // followupContentRef.value.iframe.value.contentWindow.postMessage(
    //   {
    //     params: {
    //       user_id: planDetailContent.value.userId,
    //       old_flup_phone: planDetailContent.value.mobile || planDetailContent.value.phone || planDetailContent.value.contactPhone,
    //       // flup_phone: this.form.editPhone,
    //       // flup_status: this.form.followupResult,
    //       // flup_time_real: this.completeDate,
    //       IsSubmit: 0,
    //     },
    //   },
    //   '*'
    // );
  } else if (planDetailContent.value.flupType === '调查问卷') {
    if (planDetailContent.value.flupState === 1) {
      let data = followupContentRef.value.getAnswerContent();
      if (!data) {
        return;
      }
      // let questionnaire = {
      //   master_id: planDetailContent.value.master_id,
      //   target_ext_user_id: planDetailContent.value.id_no,
      //   version_number: planDetailContent.value.version_number,
      //   answer_content_json: JSON.stringify(data),
      //   serial_no: planDetailContent.value.master_id==null?planDetailContent.value.detail_serial_no:planDetailContent.value.flup_content_id,
      //   hospital_id: this.$global.hospital_id,
      //   taskid:planDetailContent.value.serial_no
      // }
      params.answerContentJson = JSON.stringify(data);
    }
  } else if (planDetailContent.value.flupType == '慢病评估报告') {
    followupContentRef.value.postMessage({
      user_id: planDetailContent.value.userId,
      old_flup_phone: planDetailContent.value.mobile || planDetailContent.value.phone || planDetailContent.value.contactPhone,
      IsSubmit: 0,
      // flup_phone: this.form.editPhone,
      // flup_status: this.form.followupResult,
      // flup_time_real: this.completeDate,
    });
    // iframeSave();
    // 发送慢病评估报告

    patientDetailItem.value.type = 2;
    let params = patientDetailItem.value;
    _http.post(_apiUrl.reportpushAndSend, { params }).then(async (res) => {
      if (res) {
        // ElMessage({
        //   message: '操作成功',
        //   type: 'success',
        // });
        // refresh();
      } else {
        ElMessage.error('当前系统错误');
      }
    });
  }
  _http
    .post(_apiUrl.savePhoneFlupRecord, {
      params,
    })
    .then((res) => {
      if (res) {
        ElMessage({
          message: '操作成功',
          type: 'success',
        });
        refresh();
      } else {
        ElMessage.error('当前系统错误');
      }
    });
}
//作废、审核
function onAudit(state) {
  let params;
  if (planDetailContent.value.flupType == '定期检查') {
    params = {
      serialNo: planDetailContent.value.serialNo,
      changeType: 'apply',
      authState: state,
      userId: planDetailContent.value.userId,
      appointmentTime: planDetailContent.value.appointmentTime,
      remark2: planDetailContent.value.remark2,
    };
  } else if (planDetailContent.value.flupType == '定期检验') {
    params = {
      serialNo: planDetailContent.value.serialNo,
      changeType: 'change',
      authState: state,
      content: planDetailContent.value.flupContent, //this.convertData(),
      openId: planDetailContent.value.openId,
      userId: planDetailContent.value.userId,
      appointmentTime: planDetailContent.value.appointmentTime,
      remark2: planDetailContent.value.remark2,
    };
  } else if (planDetailContent.value.flupType == '定期复诊') {
    params = {
      serialNo: planDetailContent.value.serialNo,
      authState: state,
      changeType: 'change',
      userId: planDetailContent.value.userId,
      appointmentTime: planDetailContent.value.appointmentTime,
      remark2: planDetailContent.value.remark2,
    };
    // this.iframeSave();
  } else if (planDetailContent.value.flupType == '慢病评估报告') {
    params = {
      serialNo: planDetailContent.value.serialNo,
      authState: state,
      changeType: 'chronicDisease',
      userId: planDetailContent.value.userId,
      // appointmentTime: planDetailContent.value.appointmentTime,
      // remark2: planDetailContent.value.remark2,
    };
  } else {
    params = {
      serialNo: planDetailContent.value.serialNo,
      authState: state,
      // userId: planDetailContent.value.patientId
    };
  }
  _http
    .post(_apiUrl.ChangePatientPlanAuthState, {
      params,
    })
    .then(async (res) => {
      // console.log(res);
      if (res) {
        ElMessage({
          message: '操作成功',
          type: 'success',
        });
        refresh();
      } else {
        ElMessage.error('当前系统错误');
      }
    });
}
function changeItem(val) {
  patientDetailItem.value = JSON.parse(val);
  // console.log('patientDetailItem.value', patientDetailItem.value);
}
function refresh() {
  emit('close', { refresh: true, close: true });
}
function getCheckTypeList() {
  _http
    .get(_apiUrl.ExaminegetCheckTypeList, {
      params: {
        hospitalId: planDetailContent.value.hospitalId,
      },
    })
    .then((res) => {
      if (res) {
        checkTypeList.value = res.examTypeList;
      } else {
        ElMessage.error('当前系统错误');
      }
    });
}
function getInspectionNameList() {
  _http
    .get(_apiUrl.ExaminegetExamineList, {
      params: {
        hospitalId: planDetailContent.value.hospitalId,
      },
    })
    .then((res) => {
      if (res) {
        inspectionNameList.value = res.list;
      } else {
        ElMessage.error('当前系统错误');
      }
    });
}
function getInspectionTypeList() {
  _http
    .get(_apiUrl.ExaminegetSampleList, {
      params: {
        hospitalId: planDetailContent.value.hospitalId,
      },
    })
    .then((res) => {
      if (res) {
        inspectionTypeList.value = res.list;
      } else {
        ElMessage.error('当前系统错误');
      }
    });
}
</script>
<style scoped lang="scss">
.drawer-detail {
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
      .result {
        color: #db524b;
        margin-left: 10px;
        font-size: 14px;
      }
    }
    .el-drawer__body {
      .base {
        border-bottom: 1px solid #e6e6e6;
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
            text-align: right;
            min-width: 84px;
            max-width: 84px;
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
          .primary {
            color: #2d81ed;
            font-family: MicrosoftYaHei;
            font-size: 12px;
            font-weight: normal;
            letter-spacing: 0em;
            line-height: 16px;
          }
          .cancel {
            margin-left: 10px;
          }
          .add {
            margin: 4px 0 0 5px;
            display: flex;
            .inline-middle {
              margin-left: 6px;
              color: #2d81ed;
              font-family: MicrosoftYaHei;
              font-size: 12px;
              font-weight: normal;
              letter-spacing: 0em;
              line-height: 16px;
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
<style lang="scss">
.drawer-detail {
  .el-overlay {
    .el-drawer__header {
      margin-bottom: 0px !important;
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
    .el-drawer__body {
      padding: 10px 10px 20px 10px !important;
      .base {
        .base-centent {
          .text {
            .el-input {
              width: 100% !important;
            }
          }
        }
      }
      .content {
        .detail {
          .question {
            .el-form-item__label {
              justify-content: flex-start !important;
            }
            .el-form-item__content {
              line-height: 22px;
              .el-radio-group {
                align-items: flex-start;
                .margin3 {
                  .el-radio {
                    border: none;
                  }
                }
              }
              .el-checkbox-group {
                .el-checkbox {
                  border: none;
                }
              }
            }
          }
          .el-table__body-wrapper {
            color: #111;
          }
        }
      }
    }
    .el-drawer__footer {
      box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.18);
      padding: 10px;
    }
  }
}
</style>
