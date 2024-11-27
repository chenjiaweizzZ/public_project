<template>
  <el-dialog
    :title="!edit ? '新增临时随访任务' : '编辑随访任务'"
    :visible.sync="dialogVisible"
    width="700px"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$emit('update:show', false)"
    append-to-body
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="随访计划" prop="flupPlan">
        <el-input
          class="width100"
          width
          readonly
          v-model="form.flupPlan"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="随访日期" prop="flupStartTime">
        <el-date-picker
          style="width: 100%"
          v-model="form.flupStartTime"
          :picker-options="pickerOptions"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="随访类型" prop="flupType">
        <el-select
          class="width100"
          v-model="form.flupType"
          @change="switchFollowupType"
        >
          <el-option
            v-for="(item, i) in followupTypeList"
            :key="i"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.flupType == '调查问卷'"
        prop="flupContent"
        label="问卷内容"
      >
        <el-select
          class="width100"
          v-model="form.flupContent"
          filterable
          @change="switchFollowupContent"
        >
          <el-option
            v-for="(item, i) in followupContentList"
            :key="i"
            :label="item.questionnaireName"
            :value="item.questionnaireName"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-else-if="form.flupType == '健康宣教'"
        prop="flupContent"
        label="宣教内容"
      >
        <el-select
          class="width100"
          v-model="form.flupContent"
          @change="switchFollowupContent"
          filterable
        >
          <el-option
            v-for="(item, i) in followupContentList"
            :key="i"
            :label="item.questionnaireName"
            :value="item.questionnaireClass || item.questionnaireName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-else-if="form.flupType == '专科随访'"
        prop="flupContent"
        label="随访模板"
      >
        <el-select
          class="width100"
          v-model="form.flupContent"
          @change="switchFollowupContent"
          filterable
        >
          <el-option
            v-for="(item, i) in followupContentList"
            :key="i"
            :label="item.questionnaireName"
            :value="item.questionnaireName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-else-if="form.flupType == '定期复诊'"
        prop="flupContent"
        label="科室"
      >
        <el-select
          class="width100"
          v-model="flupContent"
          @change="srflupContent"
          filterable
        >
          <el-option
            v-for="(item, i) in newDeptOptions"
            :key="i"
            :label="item.deptName"
            :value="item.deptName"
          ></el-option>
        </el-select>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="textarea"
          @input="srflupContent"
        ></el-input>
      </el-form-item>
      <div class="jcjy" v-else-if="form.flupType == '定期检查'">
        <el-button plain @click="addfile">添加</el-button>
        <el-table
          v-if="form.flupType == '定期检查'"
          :data="dqjcjyList"
          border
          style="width: 100%; margin-bottom: 10px"
        >
          <el-table-column label="检查内容">
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.type"
                class="width100"
                v-model="scope.row.examTypeName"
                @change="getCheckPartsList(scope.row, false)"
                filterable
              >
                <el-option
                  v-for="(item, i) in checkTypeList"
                  :key="i"
                  :label="item.examTypeName"
                  :value="item.examTypeName"
                ></el-option>
              </el-select>
              <p v-else>{{ scope.row.examTypeName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="检查部位">
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.type"
                class="width100"
                v-model="scope.row.examBodyName"
                @change="getCheckItemList(scope.row, false)"
                filterable
              >
                <el-option
                  v-for="(item, i) in checkPartsList"
                  :key="i"
                  :label="item.examBodyName"
                  :value="item.examBodyName"
                ></el-option>
              </el-select>
              <p v-else>{{ scope.row.examBodyName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="检查项目">
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.type"
                class="width100"
                v-model="scope.row.examItemName"
                @change="getflupContent(scope.row, false)"
                filterable
              >
                <el-option
                  v-for="(item, i) in checkItemList"
                  :key="i"
                  :label="item.examItemName"
                  :value="item.examItemName"
                ></el-option>
              </el-select>
              <p v-else>{{ scope.row.examItemName }}</p>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
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
      </div>
      <div class="jcjy" v-else-if="form.flupType == '定期检验'">
        <el-button plain @click="addfile">添加</el-button>
        <el-table
          v-if="form.flupType == '定期检验'"
          :data="dqjcjyList"
          border
          style="width: 100%; margin-bottom: 10px"
        >
          <el-table-column label="检验名称">
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.type"
                class="width100"
                v-model="scope.row.ylmc"
                @change="getflupContentjy(scope.row)"
                filterable
              >
                <el-option
                  v-for="(item, i) in examineList"
                  :key="i"
                  :label="item.ylmc"
                  :value="item.ylmc"
                ></el-option>
              </el-select>
              <p v-else>{{ scope.row.ylmc }}</p>
            </template>
          </el-table-column>
          <el-table-column label="样本类型">
            <template slot-scope="scope">
              <el-select
                v-if="scope.row.type"
                class="width100"
                v-model="scope.row.sampledescribe"
                @change="getflupContentjy(scope.row)"
                filterable
              >
                <el-option
                  v-for="(item, i) in sampleList"
                  :key="i"
                  :label="item.sampledescribe"
                  :value="item.sampledescribe"
                ></el-option>
              </el-select>
              <p v-else>{{ scope.row.sampledescribe }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="100">
            <template slot-scope="scope">
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
      </div>
      <div v-else-if="form.flupType == '消息提醒'">
        <el-form-item label="消息模板">
          <el-select
            style="margin-bottom: 10px"
            v-model="form.flupContentId"
            @change="onChange($event, index)"
          >
            <el-option
              v-for="item in messageReminderList"
              :key="item.templateId"
              :label="item.templateName"
              :value="item.templateId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="flupContent" label="消息内容">
          <el-input
            class="width100"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            :maxlength="50"
            v-model="form.flupContent"
            clearable
          ></el-input>
        </el-form-item>
      </div>

      <el-form-item
        v-if="form.flupType == '慢病评估报告' && reportList.length > 0"
        prop="flupContent"
        label="风险评估报告"
      >
        <el-select
          v-model="diseaseReportId"
          v-if="form.flupType === '慢病评估报告' && reportList.length > 0"
          @change="changeDiseaseReport"
          filterable
        >
          <el-option
            v-for="item in reportList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效天数" prop="validDate">
        <el-input-number
          class="width170px"
          :min="0"
          :max="9999"
          :step="1"
          step-strictly
          v-model="form.validDate"
          v-alphanumericSymbol
        ></el-input-number>
        <span>有效天数为0时任务永久有效</span>
      </el-form-item>
      <el-form-item prop="smartFlupMethod" label="随访途径">
        <el-radio-group v-model="form.smartFlupMethod">
          <el-radio
            @change="switchFollowupWay"
            v-for="(item, i) in followupWayList"
            :disabled="item.disabled"
            :key="i"
            :label="item.dict_name"
            >{{ item.dict_name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onConfirmNewTask">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import followupRouteMixins from "@/mixins/followupRouteMixins";
import dialogMixins from "@/mixins/dialog";
export default {
  name: "new-task",
  mixins: [followupRouteMixins, dialogMixins],
  data() {
    return {
      flupContent: null,
      textarea: null,
      form: {
        flupPlan: "",
        planNameId: "",
        fuRuleId: "",
        flupStartTime: ""
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      followupWayList: [],
      followupTypeList: [],
      reportList: [],
      diseaseReportId: "",
      diseaseReport: "",
      newDeptOptions: [],
      checkTypeList: [],
      examTypeId: null,
      checkPartsList: [],
      examBodyId: null,
      checkItemList: [],
      examItemId: null,
      examineList: [],
      autoid: null,
      sampleList: [],
      yblx: null,
      dqjcjyList: [],
      backups: null,
      rules: {
        flupType: [
          { required: true, message: "请选择随访类型", trigger: "change" }
        ],
        smartFlupMethod: [
          { required: true, message: "请选择随访途径", trigger: "change" }
        ],
        flupStartTime: [
          { required: true, message: "请选择随访日期", trigger: "change" }
        ],
        flupContent: [
          { required: true, message: "必填内容", trigger: "change" }
        ]
      },
      messageReminderList: []
    };
  },
  props: [
    "fuRuleId",
    "flupPlan",
    "planNameId",
    "fuWay",
    "oldTaskSerialNo",
    "edit",
    "editData"
  ],
  async mounted() {
    // console.log(this.editData);
    this.form.fuRuleId = this.fuRuleId || "";
    this.form.flupPlan = this.flupPlan || "";
    this.form.flupPlanId = this.planNameId || "";
    this.form.flupStartTime = this.editData ? this.editData.flupStartTime : "";
    this.form.flupType = this.editData ? this.editData.flupType : "";
    this.form.smartFlupMethod = this.editData
      ? this.editData.smartFlupMethod
      : "";
    this.form.flupContent = this.editData ? this.editData.flupContent : "";
    this.form.flupContentId = this.editData ? this.editData.flupContentId : "";
    this.form.smartFlupMethodId = this.editData
      ? this.editData.smartFlupMethodId
      : "";
    if (this.edit) {
      this.switchFollowupType(this.editData.flupType);
      this.form.validDate =
        this.$utils.GetDateDiff(
          this.editData.flupStartTime,
          this.editData.flupEndTime,
          "day"
        ) > 9999
          ? 0
          : this.$utils.GetDateDiff(
              this.editData.flupStartTime,
              this.editData.flupEndTime,
              "day"
            );

      if (this.editData.flupType == "定期检查") {
        // this.addfile();
        if (this.editData.flupContent.indexOf(",") != -1) {
          let jcListDatas = this.editData.flupContent.split(",");
          jcListDatas.forEach(i => {
            let arrjc = i.split("|");
            this.dqjcjyList.push({
              examTypeId: arrjc[1],
              examTypeName: arrjc[0],
              examBodyId: arrjc[3],
              examBodyName: arrjc[2],
              examItemId: arrjc[5],
              examItemName: arrjc[4],
              type: true
            });
          });
        } else {
          let jcList = this.editData.flupContent.split("|");
          this.dqjcjyList.push({
            examTypeId: jcList[1],
            examTypeName: jcList[0],
            examBodyId: jcList[3],
            examBodyName: jcList[2],
            examItemId: jcList[5],
            examItemName: jcList[4],
            type: true
          });
        }
        // console.log(this.dqjcjyList, 'ffffffffffffff');
      } else if (this.editData.flupType == "定期检验") {
        if (this.editData.flupContent.indexOf(",") != -1) {
          let jyListDatas = this.editData.flupContent.split(",");
          jyListDatas.forEach(i => {
            let arrjy = i.split("|");
            this.dqjcjyList.push({
              ylmc: arrjy[0],
              autoid1: arrjy[1],
              autoid2: arrjy[3],
              sampledescribe: arrjy[2],
              type: true
            });
          });
        } else {
          let jyList = this.editData.flupContent.split("|");
          this.dqjcjyList.push({
            ylmc: jyList[0],
            autoid1: jyList[1],
            autoid2: jyList[3],
            sampledescribe: jyList[2],
            type: true
          });
        }
        // console.log(this.dqjcjyList, 'ffffffffffffff');
      } else if (this.editData.flupType == "定期复诊") {
        this.flupContent = this.editData.flupContent.split("|")[0];
        this.textarea = this.editData.flupContent.split("|")[1];
      }
    }
    //  await this.getFollowupTypeList();
    this.getData();
    // this.$apis
    //   .getFollowupTypeList({
    //     hospitalId: JSON.parse(sessionStorage.getItem('global')).hospital_id,
    //     keyWord: '',
    //     enable: this.$route.params.type === 'specialist' ? 1 : 0,
    //   })
    //   .then((res) => {
    //     console.log(res, 'lllllllllllll');
    //     if (this.fuWay != 2) {
    //       this.followupTypeList = res.list.filter((item) => {
    //         if (item.name && item.name != '慢病评估报告' && item.enable != 0) {
    //           return item;
    //         }
    //       });
    //     } else {
    //       this.followupTypeList = res.list.filter((item) => {
    //         if (item.name && item.name != '慢病评估报告' && item.enable != 0) return item;
    //       });
    //     }
    //     this.followupTypeList = this.followupTypeList.filter((item) => {
    //       if (item.name && item.name != '处方提醒' && item.enable != 0 && item.name != '慢病评估报告') {
    //         return item;
    //       }
    //     });
    //   });
    // // await this.getFolloupWayList();
    // this.$apis
    //   .BaseDictGetDictItems({
    //     parentId: '2019051518541847339f',
    //   })
    //   .then((res) => {
    //     this.followupWayList = res;
    //     // console.log(this.followupWayList)
    //     this.followupWayList.forEach((item) => {
    //       this.$set(item, 'disabled', true);
    //     });
    //   });

    this.$apis.systemManagequeryCurrentUserDept({}).then(res => {
      this.newDeptOptions = res;
    });
    this.$apis.ExaminegetCheckTypeList({}).then(res => {
      this.checkTypeList = res.examTypeList;
    });
    this.$apis.ExaminegetExamineList({}).then(res => {
      this.examineList = res.list;
    });
    this.$apis.ExaminegetSampleList().then(res => {
      this.sampleList = res.list;
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
      this.form.flupContent = arr[0].msContent.replace(/<br>/g, '\n')
    },
    getData() {
      this.$apis
        .getFollowupTypeList({
          hospitalId: JSON.parse(sessionStorage.getItem("global")).hospital_id,
          keyWord: "",
          enable: this.$route.params.type === "specialist" ? 1 : 0
        })
        .then(res => {
          // console.log(res, 'lllllllllllll');
          if (this.fuWay != 2) {
            this.followupTypeList = res.list.filter(item => {
              if (
                item.name &&
                item.name != "慢病评估报告" &&
                item.enable != 0
              ) {
                return item;
              }
            });
          } else {
            this.followupTypeList = res.list.filter(item => {
              if (item.name && item.name != "慢病评估报告" && item.enable != 0)
                return item;
            });
          }
          this.followupTypeList = this.followupTypeList.filter(item => {
            if (
              item.name &&
              item.name != "处方提醒" &&
              item.enable != 0 &&
              item.name != "慢病评估报告"
            ) {
              return item;
            }
          });
        });
      // await this.getFolloupWayList();
      this.$apis
        .BaseDictGetDictItems({
          parentId: "2019051518541847339f"
        })
        .then(res => {
          // console.log(res, '22222222222222222222222');
          this.followupWayList = res;
          // console.log(this.followupWayList)
          this.followupWayList.forEach(item => {
            this.$set(item, "disabled", true);
          });
        });
    },
    revocation(scope) {
      this.dqjcjyList = JSON.parse(JSON.stringify(this.backups));
      this.checkPartsList = [];
      this.checkItemList = [];
    },
    redactAddfile(row) {
      if (JSON.stringify(this.dqjcjyList).indexOf("true") != -1) {
        this.$message({
          message: "请保存后再编辑!",
          type: "warning"
        });
        return;
      }
      if (this.form.flupType == "定期检查") {
        this.getCheckPartsList(row, true);
        this.getCheckItemList(row, true);
      }

      this.backups = JSON.parse(JSON.stringify(this.dqjcjyList));
      row.type = true;
    },
    affirmAddfile(row) {
      if (
        (this.form.flupType == "定期检查" &&
          row.examTypeId &&
          row.examBodyId &&
          row.examItemId) ||
        (this.form.flupType == "定期检验" && row.ylmc && row.sampledescribe)
      ) {
        row.type = false;
      } else {
        this.$message({
          message: "请全部选择后再点击!",
          type: "warning"
        });
      }
    },
    erase(scope) {
      this.dqjcjyList.splice(scope.$index, 1);
    },
    addfile() {
      if (JSON.stringify(this.dqjcjyList).indexOf("true") != -1) {
        this.$message({
          message: "请保存后再添加!",
          type: "warning"
        });
        return;
      }
      this.backups = JSON.parse(JSON.stringify(this.dqjcjyList));
      if (this.form.flupType == "定期检查") {
        this.dqjcjyList.push({
          examTypeId: null,
          examTypeName: null,
          examBodyId: null,
          examBodyName: null,
          examItemId: null,
          examItemName: null,
          type: true
        });
      } else if (this.form.flupType == "定期检验") {
        this.dqjcjyList.push({
          ylmc: null,
          autoid1: null,
          autoid2: null,
          sampledescribe: null,
          type: true
        });
        console.log(this.dqjcjyList);
      }
    },
    getflupContentjy(row) {
      if (row.ylmc) {
        for (let i in this.examineList) {
          if (this.examineList[i].ylmc == row.ylmc) {
            row.autoid1 = this.examineList[i].autoid;
          }
        }
      }
      if (row.sampledescribe) {
        for (let i in this.sampleList) {
          if (this.sampleList[i].sampledescribe == row.sampledescribe) {
            row.autoid2 = this.sampleList[i].autoid;
          }
        }
      }
    },
    getflupContent(row) {
      for (let i in this.checkItemList) {
        if (this.checkItemList[i].examItemName == row.examItemName) {
          row.examItemId = this.checkItemList[i].examItemId;
        }
      }
    },
    getCheckPartsList(row, edit) {
      if (!edit) {
        row.examBodyId = null;
        row.examBodyName = null;
        row.examItemId = null;
        row.examItemName = null;
        this.checkPartsList = [];
        this.checkItemList = [];
        for (let i in this.checkTypeList) {
          if (this.checkTypeList[i].examTypeName == row.examTypeName) {
            row.examTypeId = this.checkTypeList[i].examTypeId;
          }
        }
      }
      this.$apis
        .ExaminegetCheckPartsList({
          examTypeId: row.examTypeId
        })
        .then(res => {
          this.checkPartsList = res.examBodyInfoList;
        });
    },
    getCheckItemList(row, edit) {
      if (!edit) {
        row.examItemId = null;
        row.examItemName = null;
        this.checkItemList = [];
        for (let i in this.checkPartsList) {
          if (this.checkPartsList[i].examBodyName == row.examBodyName) {
            row.examBodyId = this.checkPartsList[i].examBodyId;
          }
        }
      }

      this.$apis
        .ExaminegetCheckItemList({
          examBodyId: row.examBodyId
        })
        .then(res => {
          this.checkItemList = res.examItemInfos;
        });
    },
    srflupContent() {
      if (this.flupContent && this.textarea) {
        this.form.flupContent = this.flupContent + "|" + this.textarea;
      } else {
        this.form.flupContent = null;
      }
    },
    switchFollowupType(val) {
      if(val == '消息提醒'){
        this.getMessageTemplateList()
      }
      this.dqjcjyList = [];

      this.flupContent = null;
      this.textarea = null;
      if (!this.edit) {
        this.form.smartFlupMethod = null;
        this.form.flupContent = null;
      }
      this.$apis
        .flupPathqueryFollowUpContent({
          name: val,
          hospitalId: JSON.parse(sessionStorage.getItem("global")).hospital_id
        })
        .then(res => {
          this.followupContentList = res;
        });
      this.getWayDisable();
      this.form.fuContent = "";
      this.form.fuContentId = "";
      this.diseaseReportId = "";
      this.diseaseReport = "";
      this.reportList = "";
    },
    getWayDisable() {
      if (this.form.flupType == "专科随访") {
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
      } else if (this.form.flupType == "调查问卷") {
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
      } else if (this.form.flupType == "消息提醒") {
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
        this.form.flupType == "健康宣教" ||
        this.form.flupType == "定期复诊"
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
        this.form.flupType == "定期检查" ||
        this.form.flupType == "定期检验"
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
    switchFollowupContent(val) {
      console.log(this.form.flupType);
      this.diseaseReportId = "";
      this.diseaseReport = "";
      this.reportList = "";
      if (val == "定期复诊") {
        let itemobj = this.deptList.find((value, index, item) => {
          return value.Text == val;
        });
        this.form.flupContentId = itemobj.Value;
      } else if (this.form.flupType == "健康宣教") {
        let itemobj = this.followupContentList.find((value, index, item) => {
          let name = value.questionnaireClass || value.questionnaireName;
          return name == val;
        });
        this.form.flupContentId = itemobj.serialNo;
      } else {
        let itemobj = this.followupContentList.find((value, index, item) => {
          return value.questionnaireName == val;
        });
        this.form.flupContentId = itemobj.serialNo;
        if (this.form.flupType == "慢病评估报告") {
          var item = JSON.parse(itemobj.content).modules[2];
          if (item.status && item.fields.length > 0) {
            this.reportList = item.fields;
            this.diseaseReportId = this.diseaseReportId
              ? this.diseaseReportId
              : this.reportList[0].id;
            this.diseaseReport = this.reportList[0].questionnaireName;
          }
        }
      }
    },
    async onConfirmNewTask(v) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = this.getForm("临时任务");
          if (
            (data.flupType == "定期检查" || data.flupType == "定期检验") &&
            (this.dqjcjyList.length <= 0 ||
              JSON.stringify(this.dqjcjyList).indexOf("true") != -1)
          ) {
            this.$message({
              message: "请选择" + data.flupType + "内容",
              type: "warning"
            });
            return;
          }
          if (data) {
            //拼接风险评估报告
            if (data.flupType == "慢病评估报告" && this.diseaseReportId) {
              data.fuContent = data.fuContent + "|" + this.diseaseReport;
              data.fuContentId = data.fuContentId + "|" + this.diseaseReportId;
              data.flupContent = data.fuContent + "|" + this.diseaseReport;
              data.flupContentId =
                data.fuContentId + "|" + this.diseaseReportId;
            }
            if (data.flupType == "定期检查") {
              let list = [];
              for (let i in this.dqjcjyList) {
                let flupContent =
                  this.dqjcjyList[i].examTypeName +
                  "|" +
                  this.dqjcjyList[i].examTypeId +
                  "|" +
                  this.dqjcjyList[i].examBodyName +
                  "|" +
                  this.dqjcjyList[i].examBodyId +
                  "|" +
                  this.dqjcjyList[i].examItemName +
                  "|" +
                  this.dqjcjyList[i].examItemId;
                list.push(flupContent);
              }
              data.flupContent = list.join(",");
            }
            if (data.flupType == "定期检验") {
              let list = [];
              for (let i in this.dqjcjyList) {
                let flupContent =
                  this.dqjcjyList[i].ylmc +
                  "|" +
                  this.dqjcjyList[i].autoid1 +
                  "|" +
                  this.dqjcjyList[i].sampledescribe +
                  "|" +
                  this.dqjcjyList[i].autoid2;
                list.push(flupContent);
              }
              data.flupContent = list.join(",");
            }
            let patientInfo = {};
            this.$apis
              .getPatientInfoBySerialNo({
                serialNo: this.$route.query.recordSerialNo,
                patientTypeCode: this.$route.query.joinPlanPatientType
              })
              .then(res => {
                if (res) {
                  patientInfo.deptName = res.deptName;
                  patientInfo.deptCode = res.deptCode;
                  patientInfo.dateOfBirth = res.dateOfBirth;
                  patientInfo.idNo = res.idNo;
                  patientInfo.packageCode = res.packageCode;
                }
              });
            if (!this.edit) {
              this.$apis
                .addTemporaryFollowupTaskNew({
                  ...data,
                  ...patientInfo,
                  followupPathWay: data.smartFlupMethod,
                  followupPathWayId: data.smartFlupMethodId,
                  hospitalId: JSON.parse(sessionStorage.getItem("global"))
                    .hospital_id,
                  userId: this.$route.query.userId || this.$route.query.user_id,
                  // recordSerialNo: this.$route.query.recordSerialNo,
                  // patientTypeCode: this.$route.query.joinPlanPatientType,
                  flupRuleId: data.fuRuleId,
                  oldTaskSerialNo: this.oldTaskSerialNo,
                  checkItems: null
                })
                .then(res => {
                  if (res) {
                    this.$notify({
                      title: "成功",
                      message: "创建成功",
                      type: "success"
                    });
                  } else {
                    this.$notify.error({
                      title: "失败",
                      message: "创建失败"
                    });
                  }
                  this.dialogVisible = false;
                  this.$parent.getList();
                });
            } else {
              this.$apis
                .updateTemporaryFollowupTaskNew({
                  ...data,
                  ...patientInfo,
                  followupPathWay: data.smartFlupMethod,
                  followupPathWayId: data.smartFlupMethodId,
                  hospitalId: JSON.parse(sessionStorage.getItem("global"))
                    .hospital_id,
                  userId: this.$route.query.userId || this.$route.query.user_id,
                  // recordSerialNo: this.$route.query.recordSerialNo,
                  // patientTypeCode: this.$route.query.joinPlanPatientType,
                  flupRuleId: data.fuRuleId,
                  oldTaskSerialNo: this.oldTaskSerialNo,
                  checkItems: null,
                  serialNo: this.editData.serialNo
                })
                .then(res => {
                  if (res) {
                    this.$notify({
                      title: "成功",
                      message: "创建成功",
                      type: "success"
                    });
                  } else {
                    this.$notify.error({
                      title: "失败",
                      message: "创建失败"
                    });
                  }
                  this.dialogVisible = false;
                  this.$parent.getList();
                });
            }
          }
        }
      });
    },
    changeDiseaseReport() {
      let itemobj = this.reportList.find((value, index, item) => {
        return value.id == this.diseaseReportId;
      });
      this.diseaseReport = itemobj.name;
    }
  }
};
</script>
<style lang="scss" scoped>
.jcjy {
  display: flex;
  .el-button--default {
    margin: 0 20px 0 20px;
  }
}
</style>
