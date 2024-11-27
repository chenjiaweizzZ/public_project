<template>
  <section class="margin-top20 normal">
    <el-row type="flex" justify="space-between" align="middle">
      <div class="title">常规路径</div>
      <div>
        <el-button
          type="primary"
          plain
          :disabled="$route.name == 'rulesWarehouse' || sourceType == 1"
          @click="onAdd"
          >新 增</el-button
        >
        <el-button
          type="warning"
          plain
          :disabled="$route.name == 'rulesWarehouse' || sourceType == 1"
          @click="copy"
          >复 制</el-button
        >
      </div>
    </el-row>
    <el-table
      style="margin-top: 10px;"
      class="rules-table"
      :data="mainList"
      stripe
      border
    >
      <el-table-column width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip width="130" label="随访类型">
        <template slot-scope="scope">
          <el-select
            v-if="scope.$index == editIndex"
            v-model="editRow.fuType"
            @change="switchFollowupType"
          >
            <el-option
              v-for="item in followupTypeList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <div v-else>{{ scope.row.fuType }}</div>
        </template>
      </el-table-column>
      <el-table-column label="随访内容" width="220">
        <template slot-scope="scope">
          <div v-if="scope.$index == editIndex">
            <div v-for="(jtem, index) in editRow.pathDetail" :key="index">
              <!-- <el-row v-if="scope.$index == editIndex" style="display: flex;justify-content: flex-end;"> -->
              <el-row v-if="scope.$index == editIndex">
                <!-- <div v-if="scope.$index == editIndex "> -->
                <!-- <i
                    v-if=" index == scope.row.pathDetail.length-1"
                    class="el-icon-circle-plus-outline"
                    style="color:blue;margin-right:5px;line-height:3"
                    @click="addDetail(scope.$index,index)"
                ></i>-->
                <!-- <i v-if="editRow.pathDetail.length>1" class="el-icon-remove-outline" style="color:blue;margin-right:5px;line-height:3" @click="delDetail(scope.$index,index)"></i> -->
                <!-- </div> -->
                <div style="width:150px">
                  <div
                    v-if="
                      scope.$index == editIndex && editRow.fuType === '消息提醒'
                    "
                  >
                    <el-select
                      style="margin-bottom: 10px"
                      v-model="editRow.pathDetail[index].flupContentId"
                      @change="onChange($event, index)"
                    >
                      <el-option
                        v-for="item in messageReminderList"
                        :key="item.templateId"
                        :label="item.templateName"
                        :value="item.templateId"
                      ></el-option>
                    </el-select>
                    <el-input
                      maxlength="300"
                      show-word-limit
                      type="textarea"
                      v-model="editRow.pathDetail[index].flupContentText"
                    ></el-input>
                  </div>

                  <el-select
                    v-else-if="
                      scope.$index == editIndex && editRow.fuType === '定期复诊'
                    "
                    v-model="editRow.pathDetail[index].flupContentId"
                    @change="switchFollowupContent(index, $event, true)"
                    disabled
                    filterable
                  >
                    <template>
                      <el-option
                        v-for="(item, i) in deptList"
                        :key="i"
                        :label="item.deptName"
                        :value="item.serialNo"
                      ></el-option>
                    </template>
                  </el-select>
                  <el-select
                    v-else-if="scope.$index == editIndex"
                    v-model="editRow.pathDetail[index].flupContentId"
                    @change="switchFollowupContent(index, $event, true)"
                    filterable
                  >
                    <template>
                      <el-option
                        v-for="item in followupContentList"
                        :key="item.questionnaireName"
                        :label="item.questionnaireName"
                        :value="item.serialNo"
                      ></el-option>
                    </template>
                  </el-select>
                  <template
                    v-if="
                      scope.$index == editIndex && editRow.fuType === '定期复诊'
                    "
                  >
                    <el-input
                      type="textarea"
                      maxlength="300"
                      show-word-limit
                      v-model="editRow.pathDetail[index].flupContentText"
                    ></el-input>
                  </template>
                  <el-select
                    v-if="
                      scope.$index == editIndex &&
                        editRow.fuType === '定期复诊' &&
                        businessLinkageList.length != 0
                    "
                    v-model="editRow.pathDetail[index].businessLinkage"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="(item, i) in businessLinkageList"
                      :key="i"
                      :label="item.businessName"
                      :value="item.businessCode"
                      :disabled="item.enabled != 1"
                    ></el-option>
                  </el-select>
                </div>
              </el-row>
            </div>
          </div>
          <div v-else>
            <div v-if="scope.row.pathDetail">
              <div v-for="(jtem, index) in scope.row.pathDetail" :key="index">
                <el-row v-if="scope.row.fuType != '消息提醒'">
                  <div>{{ jtem.flupContentName }}</div>
                </el-row>
                <el-row>
                  <div>{{ jtem.flupContentText }}</div>
                  <div>{{ businessName(jtem.businessLinkage) }}</div>
                </el-row>
              </div>
            </div>

            <div v-else>{{ scope.row.fuContent }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150" label="有效天数">
        <template slot="header" slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="有效天数为0时任务永久有效"
            placement="top"
          >
            <div>
              有效天数
              <span class="tips">?</span>
            </div>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-input-number
            v-if="scope.$index == editIndex"
            v-model="editRow.validDate"
            :min="0"
            :max="999"
            controls-position="right"
          ></el-input-number>
          <div v-else>{{ scope.row.validDate }}</div>
        </template>
      </el-table-column>
      <el-table-column width="120" label="随访途径">
        <template slot-scope="scope">
          <el-select
            v-if="scope.$index == editIndex"
            v-model="editRow.followupPathway"
            @change="switchFollowupWay"
          >
            <el-option
              v-for="item in followupWayList"
              :key="item.dict_name"
              :label="item.dict_name"
              :value="item.dict_name"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
          <div v-else>{{ scope.row.followupPathway }}</div>
        </template>
      </el-table-column>
      <el-table-column label="周期性随访">
        <template slot-scope="scope">
          <el-switch
            :disabled="$route.name == 'rulesWarehouse' || sourceType == 1"
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
            :key="scope.row.serialNo + '1'"
          ></el-switch>
          <div v-if="editRow.fuPeriod == '1' && scope.$index == editIndex">
            <span>随访间隔(天)：</span>
            <br />
            <el-input-number
              v-model="editRow.fuInterval"
              :min="0"
              :max="9999"
              size="small"
              label="随访间隔(天)"
            ></el-input-number>
            <br />
            <span>循环次数：</span>
            <br />
            <el-input-number
              v-model="editRow.fuNumber"
              :min="1"
              :max="999"
              size="small"
              label="循环次数："
            ></el-input-number>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="restrictionEnabled"
        label="限制条件"
        :width="restrictionWidth"
      >
        <template slot-scope="scope">
          <div v-if="scope.$index == editIndex">
            <div v-for="(jtem, index) in editRow.pathDetail" :key="index">
              <div
                v-if="scope.$index == editIndex"
                style="display: flex;align-items: center;"
              >
                <p style="width:90px">条件类型</p>
                <el-select
                  v-model="editRow.pathDetail[index].flupConditionTypeId"
                  @change="value => getContent(index, value)"
                  clearable
                >
                  <el-option
                    v-for="item in restrictionList"
                    :key="item.dict_name"
                    :label="item.dict_name"
                    :value="item.serial_no"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
                <p style="width:50px;margin-left:10px">内容</p>
                <el-select
                  v-model="editRow.pathDetail[index].flupConditionContentTypeId"
                  @change="getConditionContentType(index)"
                  clearable
                >
                  <div
                    v-if="
                      editRow.pathDetail[index].flupConditionTypeId ==
                        ruleType.ruleTypeDept
                    "
                  >
                    <el-option
                      v-for="item in restrictionContentDeptlist"
                      :key="item.dict_name"
                      :label="item.dict_name"
                      :value="item.serial_no"
                      :disabled="item.disabled"
                    ></el-option>
                  </div>
                  <div
                    v-else-if="
                      editRow.pathDetail[index].flupConditionTypeId ==
                        ruleType.ruleTypeAge
                    "
                  >
                    <el-option
                      v-for="item in restrictionContentAgelist"
                      :key="item.dict_name"
                      :label="item.dict_name"
                      :value="item.serial_no"
                      :disabled="item.disabled"
                    ></el-option>
                  </div>
                  <div
                    v-else-if="
                      editRow.pathDetail[index].flupConditionTypeName == '医嘱'
                    "
                  >
                    <el-option
                      v-for="item in restrictionContentMedicalList"
                      :key="item.dict_name"
                      :label="item.dict_name"
                      :value="item.serial_no"
                      :disabled="item.disabled"
                    ></el-option>
                  </div>
                  <div
                    v-else-if="
                      editRow.pathDetail[index].flupConditionTypeName == '诊断'
                    "
                  >
                    <el-option
                      v-for="item in restrictionContentDiagnoseList"
                      :key="item.dict_name"
                      :label="item.dict_name"
                      :value="item.serial_no"
                      :disabled="item.disabled"
                    ></el-option>
                  </div>
                </el-select>
                <el-input
                  style="width: 150px;"
                  v-if="
                    editRow.pathDetail[index].flupConditionTypeId ==
                      ruleType.ruleTypeAge ||
                      editRow.pathDetail[index].flupConditionTypeName ==
                        '医嘱' ||
                      editRow.pathDetail[index].flupConditionTypeName == '诊断'
                  "
                  type="Number"
                  min="0"
                  placeholder="请输入"
                  v-model="editRow.pathDetail[index].flupConditionContentId"
                  @change="getConditionContentAge(index)"
                  maxlength="3"
                  oninput="if(value.length>3)value=value.slice(0,3)"
                  show-word-limit
                ></el-input>
                <el-select
                  style="width: 150px;"
                  v-else-if="
                    editRow.pathDetail[index].flupConditionTypeId ==
                      ruleType.ruleTypeDept
                  "
                  v-model="editRow.pathDetail[index].flupConditionContentId"
                  clearable
                  @change="getConditionContent(index)"
                >
                  <el-option
                    v-for="item in newDeptOptions"
                    :key="item.Value"
                    :value="item.serialNo"
                    :label="item.deptName"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div v-else>
            <div v-for="(jtem, index) in scope.row.pathDetail" :key="index">
              {{ jtem.flupConditionTypeName
              }}{{ jtem.flupConditionContentTypeName
              }}{{ jtem.flupConditionContentName }}
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="短信模板">
        <template slot-scope="scope">
          <div v-if="scope.$index == editIndex">
            <div v-for="(jtem,index) in editRow.pathDetail" :key="index">
              <div v-if="scope.$index== editIndex" style="display: flex;align-items: center;">
                <el-select v-model="editRow.pathDetail[index].msTemplateId" clearable>
                  <el-option v-for="item in msgTemplateList" :key="item.id" :label="item.templateName" :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div v-else>
            <div v-for="(jtem,index) in scope.row.pathDetail" :key="index">{{ jtem.templateName}}</div>
          </div>
        </template>
      </el-table-column>-->
      <el-table-column prop="createTime" label="操作">
        <template slot-scope="scope">
          <div v-if="scope.$index == editIndex && editSattus !== 'none'">
            <el-button
              @click="onCancel"
              :disabled="$route.name == 'rulesWarehouse' || sourceType == 1"
              type="text"
              >撤销</el-button
            >
            <el-button
              type="text"
              :disabled="$route.name == 'rulesWarehouse' || sourceType == 1"
              @click="onConfirm(scope.$index)"
              >确定</el-button
            >
          </div>
          <div v-else>
            <el-button
              type="text"
              :disabled="$route.name == 'rulesWarehouse' || sourceType == 1"
              @click="onEdit(scope.row, scope.$index)"
              >编辑</el-button
            >
            <el-button
              type="text"
              :disabled="$route.name == 'rulesWarehouse' || sourceType == 1"
              @click="onDelete(scope.row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import DeptList from "@/mixins/deptList.js";

import { ruleType } from "@/mixins/enum.js";
// import { log } from 'console';
export default {
  mixins: [DeptList, ruleType],
  data() {
    return {
      mainList: [],
      followupTypeList: [],
      followupContentList: [],
      editRow: {},
      followupWayList: [],
      editIndex: -1,
      editSattus: "none",
      show: false,
      deptList: [],
      hospitalId: null,
      reportList: [],
      diseaseReportId: "",
      diseaseReport: "",
      isPeriod: false,
      restrictionList: [],
      restrictionEnabled: false,
      restrictionContentDeptlist: [],
      restrictionContentAgelist: [],
      restrictionWidth: 200,
      oriEditRow: {},
      oriDetail: [
        {
          flupConditionContentId: "",
          flupConditionContentName: "",
          flupConditionContentTypeId: "",
          flupConditionContentTypeName: "",
          flupConditionTypeId: "",
          flupConditionTypeName: "",
          flupContentId: "",
          flupContentName: "",
          flupContentText: "",
          businessLinkage: null,
          msTemplateId: "",
          templateName: ""
        }
      ],
      contentStyle: "",
      msgTemplateList: [],
      businessLinkageList: [],
      restrictionContentMedicalList: [],
      restrictionContentDiagnoseList: [],
      value: "",
      messageReminderList: [],
      backups: {}
    };
  },
  props: {
    data: Array,
    relationDept: String,
    sourceType: Number
  },
  computed: {
    type() {
      return this.$route.params.type === "specialist" ? 1 : 0;
    }
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this.mainList = this.data;
        });
      },
      immediate: true
    }
  },
  created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem("global")).hospital_id;
    if (this.$route.name == "rulesWarehouse") {
      return;
    }
    this.getMessageTemplateList();
    this.$apis
      .flupTypequeryFollowTypeList({
        keyWord: "",
        enable: this.type,
        hospitalId: this.hospitalId
      })
      .then(res => {
        this.followupTypeList = res.list.filter(item => {
          if (this.$route.params.type == "whole") {
            return item.name == "健康宣教" || item.name == "调查问卷";
          } else if (this.$route.params.type == "specialist") {
            return (
              item.name == "健康宣教" ||
              item.name == "调查问卷" ||
              item.name == "专科随访" ||
              item.name == "消息提醒" ||
              item.name == "定期复诊"
            );
          } else if (this.$route.params.type == "icdm") {
            return (
              item.name == "健康宣教" ||
              item.name == "调查问卷" ||
              item.name == "专科随访" ||
              item.name == "消息提醒" ||
              item.name == "定期复诊" ||
              item.name == "慢病评估报告"
            );
          }

          // if (
          //   this.$route.params.type == 'whole' ||
          //   this.$route.params.type == 'specialist'
          // ) {
          //   return (
          //     item.name !== '定期检查' &&
          //     item.name !== '定期检验' &&
          //     item.name !== '慢病评估报告' &&
          //     item.name !== '处方提醒' &&
          //     item.enable != 0
          //   )
          // } else {
          //   return (
          //     item.name !== '定期检查' &&
          //     item.name !== '定期检验' &&
          //     item.name !== '处方提醒' &&
          //     item.enable != 0
          //   )
          // }
        });
      });
    this.$apis
      .BaseDictGetEnableDictItems({
        parentId: "2019051518541847339f"
      })
      .then(res => {
        this.followupWayList = res;
        this.followupWayList.forEach(item => {
          this.$set(item, "disabled", true);
        });
      });
    this.$apis.systemManagequeryCurrentUserDept().then(res => {
      this.deptList = res;
    });
    //获取条件类型下拉框
    this.$apis
      .BaseDictGetEnableDictItems({
        parentId: this.ruleType.ruleType
      })
      .then(res => {
        this.restrictionList = res;
      });
    //获取科室内容选项下拉框
    this.$apis
      .BaseDictGetEnableDictItems({
        parentId: this.ruleType.ruleTypeDept
      })
      .then(res => {
        this.restrictionContentDeptlist = res.filter(x => x.enabled == "1");
      });
    //获取年龄内容选项下拉框
    this.$apis
      .BaseDictGetEnableDictItems({
        parentId: this.ruleType.ruleTypeAge
      })
      .then(res => {
        this.restrictionContentAgelist = res.filter(x => x.enabled == "1");
      });

    // this.$apis
    //   .ParameterselectParametersByParameterKey({
    //     parameterKey: 'ruleConditionConfig',
    //     hospitalId: this.$global.hospital_id,
    //   })
    //   .then((res) => {
    //     if (res) {
    //       this.restrictionEnabled = res.enabled == 1 ? true : false
    //     }
    //   })
    this.$apis
      .queryFlupConfigOne({
        hospitalId: this.$global.hospital_id,
        moduleCode: "followUpSetting",
        componentKey: "ruleConditionConfig"
      })
      .then(res => {
        if (res) {
          this.restrictionEnabled = res.componentValue == 1 ? true : false;
        }
      });
    this.getNewDeptList();
    this.$apis
      .getByParameterKeyNoCache({
        parameterKey: "businessLinkage"
      })
      .then(res => {
        if (res.enabled == 1) {
          this.businessLinkageList = JSON.parse(res.parameterValue);
        }
      });
  },
  methods: {
    getMessageTemplateList() {
      this.$apis
        .selectMessage({
          name: "",
          pageIndex: 1,
          pageSize: 999
        })
        .then(res => {
          this.messageReminderList = res.list;
        });
    },
    onChange(v, index) {
      let arr = this.messageReminderList.filter(item => {
        return item.templateId == v;
      });
      this.editRow.pathDetail[index].flupContentName = arr[0].templateName;
      this.editRow.pathDetail[index].flupContentText = arr[0].msContent.replace(/<br>/g, '\n');
    },
    businessName(code) {
      let businessLinkage = this.businessLinkageList.filter(item => {
        return item.businessCode == code;
      });
      return businessLinkage.length == 0 ? "" : businessLinkage[0].businessName;
    },
    getContent(index, value) {
      // console.log(this.editRow.pathDetail, index, value);
      let indexs = this.restrictionList.findIndex(i => {
        return i.serial_no == value;
      });
      if (
        (this.restrictionList[indexs].dict_name == "医嘱" &&
          this.restrictionContentMedicalList.length == 0) ||
        (this.restrictionList[indexs].dict_name == "诊断" &&
          this.restrictionContentDiagnoseList.length == 0)
      ) {
        this.getList(this.restrictionList[indexs], index);
      } else {
      }
      this.editRow.pathDetail[index].flupConditionTypeName = "";
      this.editRow.pathDetail[index].flupConditionContentTypeId = "";
      this.editRow.pathDetail[index].flupConditionContentTypeName = "";
      this.editRow.pathDetail[index].flupConditionContentId = "";
      this.editRow.pathDetail[index].flupConditionContentName = "";
      this.editRow.pathDetail[index].businessLinkage = null;
      this.restrictionList.forEach(element => {
        if (
          element.serial_no ==
          this.editRow.pathDetail[index].flupConditionTypeId
        ) {
          this.editRow.pathDetail[index].flupConditionTypeName =
            element.dict_name;
        }
      });
    },
    getList(item) {
      //获取内容选项下拉框
      this.$apis
        .BaseDictGetEnableDictItems({
          parentId: item.serial_no
        })
        .then(res => {
          if (item.dict_name == "医嘱") {
            this.restrictionContentMedicalList = res.filter(
              x => x.enabled == "1"
            );
          } else {
            this.restrictionContentDiagnoseList = res.filter(
              x => x.enabled == "1"
            );
          }
        });
    },
    getConditionContentType(index) {
      if (
        this.editRow.pathDetail[index].flupConditionTypeId ==
        this.ruleType.ruleTypeDept
      ) {
        this.restrictionContentDeptlist.forEach(element => {
          if (
            element.serial_no ==
            this.editRow.pathDetail[index].flupConditionContentTypeId
          ) {
            this.editRow.pathDetail[index].flupConditionContentTypeName =
              element.dict_name;
          }
        });
      } else {
        this.restrictionContentAgelist.forEach(element => {
          if (
            element.serial_no ==
            this.editRow.pathDetail[index].flupConditionContentTypeId
          ) {
            this.editRow.pathDetail[index].flupConditionContentTypeName =
              element.dict_name;
          }
        });
      }
      this.editRow.pathDetail[index].flupConditionContentId = "";
      this.editRow.pathDetail[index].flupConditionContentName = "";
    },
    getConditionContent(index) {
      let dept = this.newDeptOptions.filter(
        x => x.serialNo == this.editRow.pathDetail[index].flupConditionContentId
      );
      this.editRow.pathDetail[index].flupConditionContentName =
        dept.length > 0 ? dept[0].deptName : "";
    },
    getConditionContentAge(index) {
      this.editRow.pathDetail[
        index
      ].flupConditionContentName = this.editRow.pathDetail[
        index
      ].flupConditionContentId;
    },
    onEdit(row, index) {
      let singal2 = this.$parent.$parent.$refs.cancel2
        ? this.$parent.$parent.$refs.cancel2.editSattus !== "none"
        : false;

      let singal3 = this.$parent.$parent.$refs.cancel3
        ? this.$parent.$parent.$refs.cancel3.editSattus !== "none"
        : false;
      let singal4 = this.$parent.$parent.$refs.cancel4
        ? this.$parent.$parent.$refs.cancel4.isSave !== true
        : false;
      let singal =
        // this.$route.params.type == 'whole'?
        this.editSattus !== "none" || singal2 || singal3 || singal4;
      // : false
      console.log(singal4);
      if (singal) {
        this.$message({
          type: "warning",
          message: "请保存后再编辑!"
        });
        return;
      }
      this.restrictionWidth = 500;
      this.editSattus = "edit";
      this.editIndex = index;
      this.editRow = { ...this.mainList[index] };
      this.oriEditRow = JSON.parse(JSON.stringify(this.editRow));
      //设置多条路径样式
      this.setStyle();
      this.$apis
        .flupPathqueryFollowUpContent({
          name: this.editRow.fuType,
          hospitalId: this.hospitalId
        })
        .then(res => {
          this.followupContentList = res;
        });
      this.getMsgTemplate(this.editRow.fuType);
      this.getWayDisable();
    },
    async onDelete(row) {
      if (this.editSattus !== "none") {
        this.$message({
          type: "warning",
          message: "请保存后再编辑!"
        });
        return;
      }
      await this.$confirm("是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      this.$apis.flupPathdelFlupPath(row.serialNo).then(() => {
        this.$parent.$parent.getPathList();
      });
    },
    onAdd() {
      this.restrictionWidth = 500;
      this.setStyle();
      let singal2 = this.$parent.$parent.$refs.cancel2
        ? this.$parent.$parent.$refs.cancel2.editSattus !== "none"
        : false;

      let singal3 = this.$parent.$parent.$refs.cancel3
        ? this.$parent.$parent.$refs.cancel3.editSattus !== "none"
        : false;
      let singal4 = this.$parent.$parent.$refs.cancel4
        ? this.$parent.$parent.$refs.cancel4.isSave !== true
        : false;
      let singal = this.editSattus !== "none" || singal2 || singal3 || singal4;
      console.log(this.editSattus !== "none" || singal2 || singal3 || singal4);
      if (singal) {
        if (this.$route.params.type == "whole") {
        }
        this.$message({
          type: "warning",
          message: "请保存后再编辑!"
        });
        return;
      }

      this.editSattus = "add";
      this.mainList.push({
        serialNo: "",
        fuType: "",
        fuContent: "",
        fuContentId: "",
        validDate: 2,
        followupPathway: "",
        followupPathwayId: "",
        fuPeriod: 0,
        fuInterval: 0,
        fuNumber: 1,
        executeUnit: 0,
        isDelete: 0,
        pathDetail: [
          {
            flupConditionContentId: "",
            flupConditionContentName: "",
            flupConditionContentTypeId: "",
            flupConditionContentTypeName: "",
            flupConditionTypeId: "",
            flupConditionTypeName: "",
            flupContentId: "",
            flupContentName: "",
            flupContentText: "",
            msTemplateId: "",
            templateName: "",
            flupPathId: "",
            id: 0,
            isDelete: 0,
            sort: 0
          }
        ]
      });
      this.editRow = JSON.parse(
        JSON.stringify(this.mainList[this.mainList.length - 1])
      );
      this.editIndex = this.mainList.length - 1;
      this.getWayDisable();
    },
    switchFollowupType(val) {
      // this.editRow.pathDetail = JSON.parse(JSON.stringify(this.oriDetail))
      // this.mainList[this.editIndex].pathDetail = JSON.parse(
      //   JSON.stringify(this.oriDetail)
      // )
      this.editRow.pathDetail.splice(0, this.editRow.pathDetail.length);
      let newDetail = {
        flupConditionContentId: "",
        flupConditionContentName: "",
        flupConditionContentTypeId: "",
        flupConditionContentTypeName: "",
        flupConditionTypeId: "",
        flupConditionTypeName: "",
        flupContentId: "",
        flupContentName: "",
        flupContentText: "",
        flupPathId: "",
        businessLinkage: null
      };
      if (val == "定期复诊") {
        this.deptList.forEach(element => {
          if (element.deptName == this.relationDept) {
            newDetail.flupContentName = element.deptName;
            newDetail.flupContentId = element.serialNo;
          }
        });
      }

      this.$set(this.editRow.pathDetail, 0, newDetail);
      this.editRow.followupPathway = "";
      // this.reportList = ''
      this.$apis
        .flupPathqueryFollowUpContent({
          name: val,
          hospitalId: this.hospitalId
        })
        .then(res => {
          this.followupContentList = res;
        });
      this.getMsgTemplate(val);
      this.getWayDisable();
    },
    getMsgTemplate(val) {
      this.$apis
        .getTemplateList({
          pageNo: 0,
          pageSize: 0,
          flupType: val,
          keyword: ""
        })
        .then(res => {
          this.msgTemplateList = res.list;
        });
    },
    getWayDisable() {
      if (this.editRow.fuType == "专科随访") {
        this.followupWayList.forEach(element => {
          if (element.dict_name == "微信") {
            element.disabled = true;
          } else if (element.dict_name == "电话") {
            element.disabled = false;
          } else if (element.dict_name == "短信") {
            element.disabled = true;
          } else if (element.dict_name == "无动作") {
            element.disabled = true;
          }
        });
      } else if (this.editRow.fuType == "调查问卷") {
        this.followupWayList.forEach(element => {
          if (element.dict_name == "电话") {
            element.disabled = false;
          } else if (element.dict_name == "微信") {
            element.disabled = false;
          } else if (element.dict_name == "短信") {
            element.disabled = false;
          } else if (element.dict_name == "无动作") {
            element.disabled = true;
          }
        });
      } else if (this.editRow.fuType == "消息提醒") {
        this.followupWayList.forEach(element => {
          if (element.dict_name == "电话") {
            element.disabled = true;
          } else if (element.dict_name == "微信") {
            element.disabled = false;
          } else if (element.dict_name == "短信") {
            element.disabled = false;
          } else if (element.dict_name == "无动作") {
            element.disabled = false;
          }
        });
      } else if (
        this.editRow.fuType == "健康宣教" ||
        this.editRow.fuType == "定期复诊"
      ) {
        this.followupWayList.forEach(element => {
          if (element.dict_name == "电话") {
            element.disabled = true;
          } else if (element.dict_name == "微信") {
            element.disabled = false;
          } else if (element.dict_name == "短信") {
            element.disabled = false;
          } else if (element.dict_name == "无动作") {
            element.disabled = true;
          }
        });
      } else if (
        this.editRow.fuType == "定期检查" ||
        this.editRow.fuType == "定期检验" ||
        this.editRow.fuType == "慢病评估报告"
      ) {
        this.followupWayList.forEach(element => {
          if (element.dict_name == "电话") {
            element.disabled = true;
          } else if (element.dict_name == "微信") {
            element.disabled = false;
          } else if (element.dict_name == "短信") {
            element.disabled = true;
          } else if (element.dict_name == "无动作") {
            element.disabled = true;
          }
        });
      } else {
        this.followupWayList.forEach(element => {
          if (element.dict_name == "电话") {
            element.disabled = true;
          } else if (element.dict_name == "微信") {
            element.disabled = true;
          } else if (element.dict_name == "短信") {
            element.disabled = true;
          } else if (element.dict_name == "无动作") {
            element.disabled = true;
          }
        });
      }
    },
    switchFollowupContent(index, val, isClean) {
      if (this.editRow.fuType == "定期复诊") {
        let itemobj = this.deptList.find((value, index, item) => {
          return value.serialNo == val;
        });
        this.editRow.pathDetail[index].flupContentName = itemobj.deptName;
      } else if (this.editRow.fuType == "健康宣教") {
        let itemobj = this.followupContentList.find((value, index, item) => {
          return value.serialNo == val;
        });
        this.editRow.pathDetail[index].flupContentName =
          itemobj.questionnaireClass || itemobj.questionnaireName;
      } else {
        let itemobj = this.followupContentList.find((value, index, item) => {
          return value.serialNo == val;
        });
        this.editRow.pathDetail[index].flupContentName =
          itemobj.questionnaireName;
      }
    },
    switchFollowupWay(val) {
      let itemobj = this.followupWayList.find((value, index, item) => {
        return value.dict_name == val;
      });
      this.editRow.followupPathwayId = itemobj.dict_code;
    },
    onCancel() {
      if (this.editSattus === "add") {
        this.mainList.splice(this.mainList.length - 1, 1);
      } else {
        this.$set(this.mainList, this.editIndex, this.oriEditRow);
        // this.mainList[this.editIndex] = this.oriEditRow;
      }
      this.restrictionWidth = 200;
      this.editSattus = "none";
      this.editIndex = -1;
      this.contentStyle = "";
      this.value = "";
    },
    onConfirm(index) {
      if (!this.editRow.fuType) {
        this.$message({
          type: "warning",
          message: "请选择随访类型"
        });
        return;
      } else if (!this.editRow.validDate && this.editRow.validDate != 0) {
        this.$message({
          type: "warning",
          message: "请输入有效天数"
        });
        return;
      } else if (!this.editRow.followupPathway) {
        this.$message({
          type: "warning",
          message: "请选择随访途径"
        });
        return;
      }

      //判断条件
      if (this.editRow.pathDetail.length > 0) {
        try {
          this.editRow.pathDetail.forEach((detail, index) => {
            if (this.editRow.fuType == "消息提醒") {
              if (this.editRow.pathDetail[index].flupContentText == "") {
                this.editRow.pathDetail[index].flupContentId = "";
                this.editRow.pathDetail[index].flupContentMame = "";
              }
            }
            if (this.editRow.fuType != "消息提醒") {
              if (!detail.flupContentId) {
                this.$message({
                  type: "warning",
                  message: `请为第${index + 1}条路径设置随访内容`
                });
                throw new Error("");
              }
              this.switchFollowupContent(index, detail.flupContentId);
            }

            if (this.editRow.fuType == "定期复诊") {
              if (detail.businessLinkage) {
                detail.flupContentText =
                  detail.flupContentText + "|" + detail.businessLinkage;
              }
            }

            if (detail.flupConditionTypeId) {
              if (!detail.flupConditionContentTypeId) {
                this.$message({
                  type: "warning",
                  message: `请为第${index + 1}条路径设置限制条件`
                });
                throw new Error("");
              } else if (!detail.flupConditionContentName) {
                this.$message({
                  type: "warning",
                  message: `请为第${index + 1}条路径设置限制条件内容`
                });
                throw new Error("");
              }
            }
            detail.sort = index;
          });
        } catch (e) {
          return;
        }
      }
      let obj = this.$parent.$parent.tabs.find(item => {
        return this.$parent.$parent.active == item.id;
      });
      this.restrictionWidth = 200;
      const model1 = {
        flupInterval: 1,
        fuPeriod: 0,
        fuNumber: 1,
        checkItems: null
      };

      const model2 = {
        flupRuleId: obj.flupRuleId,
        interventionBenchmark: obj.interventionBenchmark,
        interventionDay: obj.interventionDay,
        executeUnit: obj.executeUnit,
        flupTimeconfigId: obj.id
      };

      this.$apis
        .flupPathsaveFlupPathNew({
          ...model1,
          ...this.editRow,
          ...model2,
          patientTypeCode: obj.patientTypeCode,
          hospitalId: this.hospitalId
          // conditions,
        })
        .then(() => {
          this.$parent.$parent.getPathList();
          this.editSattus = "none";
          this.$set(this.mainList, index, this.editRow);
          this.editIndex = -1;
          this.contentStyle = "";
          this.value = "";
        });
    },
    copy() {
      if (this.editSattus !== "none") {
        this.$message({
          type: "warning",
          message: "请保存后再编辑!"
        });
        return;
      }
      this.$emit("getList", 1);
      // this.$parent.$parent.copyFlag = 1;
      // this.$parent.$parent.copyDialog = true;
    },
    addDetail(rIndex, ndex) {
      let newDetail = {
        flupConditionContentId: "",
        flupConditionContentName: "",
        flupConditionContentTypeId: "",
        flupConditionContentTypeName: "",
        flupConditionTypeId: "",
        flupConditionTypeName: "",
        flupContentId: "",
        flupContentName: "",
        flupContentText: "",
        flupPathId: ""
      };
      this.$set(
        this.editRow.pathDetail,
        this.editRow.pathDetail.length,
        newDetail
      );
      // this.editRow.pathDetail.splice(index + 1, 0, newDetail)
      // this.mainList[rIndex].pathDetail.splice(index + 1, 0, newDetail)
    },
    delDetail(rIndex, index) {
      // this.mainList[rIndex].pathDetail.splice(index, 1)
      this.editRow.pathDetail.splice(index, 1);
    },
    resetEdit() {
      this.editRow = {
        fuType: "",
        fuContent: "",
        fuContentId: "",
        validDate: 2,
        followupPathway: "",
        fuPeriod: 0,
        fuInterval: 0,
        fuNumber: 1,
        pathDetail: [
          {
            flupConditionContentId: "",
            flupConditionContentName: "",
            flupConditionContentTypeId: "",
            flupConditionContentTypeName: "",
            flupConditionTypeId: "",
            flupConditionTypeName: "",
            flupContentId: "",
            flupContentName: "",
            flupContentText: "",
            flupPathId: "",
            id: 0,
            isDelete: 0,
            sort: 0
          }
        ]
      };
    },
    setStyle() {
      this.contentStyle = "align-items:center;justify-content: flex-end;";
    }
  }
};
</script>
