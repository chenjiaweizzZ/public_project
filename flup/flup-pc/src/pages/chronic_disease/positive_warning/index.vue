<template>
  <div class="exception-warning">
    <div class="queryConditionsBox">
      <!-- <div class="queryConditions">
          <p>预警类型</p>
          <el-select
            class="value width200px"
            clearable
            v-model="warningType"
            placeholder="请选择"
            multiple
            @change="onSearch"
          >
            <el-option label="问卷异常" value="WJYC"></el-option>
            <el-option label="检测异常" value="JCYC"></el-option>
            <el-option label="重大阳性" value="ZDYX"></el-option>
          </el-select>
        </div> -->
      <div class="queryConditions">
        <p>科室</p>
        <el-select
          class="width200px"
          v-model="deptId"
          placeholder="请选择"
          :clearable="isAuthority"
          :filterable="isAuthority"
          @change="onSearch"
        >
          <el-option
            v-for="item in newDeptList"
            :key="item.deptCode"
            :value="item.deptCode"
            :label="item.deptName"
          ></el-option>
        </el-select>
      </div>
      <!-- <div class="queryConditions">
          <p>状态</p>
          <el-select
            class="value width200px"
            clearable
            multiple
            v-model="states"
            placeholder="请选择"
            @change="onSearch"
          >
            <el-option label="未处理" value="0"></el-option>
            <el-option label="已处理" value="1"></el-option>
            <el-option label="已结束" value="2"></el-option>
          </el-select>
      </div>-->
      <div class="queryConditions">
        <p>提交时间</p>
        <el-date-picker
          class="value"
          type="daterange"
          v-model="date"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
          @change="getWrining('1')"
          clearable
        ></el-date-picker>
      </div>
      <div class="queryConditions">
        <p>姓名</p>
        <el-input
          class="value width300px limiting"
          v-model="name"
          placeholder="请输入关键字"
          maxlength="20"
          show-word-limit
          @keyup.enter.native="onSearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="onSearch"
          ></el-button>
        </el-input>
      </div>
      <div class="queryConditions">
        <el-button type="success" plain @click="Download">导出</el-button>
        <el-button type="success" plain @click="addRecord" v-if="addShow"
          >新增</el-button
        >
      </div>
    </div>
    <el-collapse
      v-if="mainList.list && mainList.list.length != 0"
      style="margin-bottom:60px"
      class="margin-top20"
      v-model="activeName"
      accordion
    >
      <el-collapse-item v-for="(item, index) in mainList.list" :key="index">
        <template slot="title">
          <div class="color-333 bold margin-left20 title">
            <span v-if="item.name" :class="item.patientId ? '' : 'text'">
              {{ item.name }}
            </span>
            <span class="text" v-if="item.patientId"
              >({{ item.patientId }})</span
            >
            <span class="text" v-if="item.gender">{{ item.gender }}</span>
            <span class="text" v-if="item.age">{{ item.age }}岁</span>
            <span class="text" v-if="item.phone">
              {{ item.phone }}
              <i
                style="color:#32ae57;font-size: 21px;margin-left: 3px;cursor: pointer;"
                class="el-icon-phone-outline"
                @click="call(item.phone)"
              ></i>
            </span>
            <span class="text warning">{{ item.unTreatedCount }}条待处理</span>
            <span class="float-right">
              最新异常：{{
                item.warningPoList && item.warningPoList.length
                  ? item.warningPoList[0].warningContent
                  : ""
              }}
            </span>
          </div>
        </template>
        <el-table :data="item.warningPoList" border stripe>
          <el-table-column
            show-overflow-tooltip
            width="50"
            type="index"
            label="序号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="warningContent"
            label="预警内容"
            min-width="100"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="state"
            label="预警类型"
            width="100"
          >
            <template slot-scope="scope">
              <section>
                {{
                  scope.row.warningType == "WJYC"
                    ? "问卷异常"
                    : scope.row.warningType == "JCYC"
                    ? "监测异常"
                    : "重大阳性"
                }}
              </section>
            </template>
          </el-table-column>
          <el-table-column prop="warningIndex" label="异常内容">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.ruleSnapshot &&
                    scope.row.ruleSnapshot.classification == 1
                "
                style="color: #F5150A;"
                >{{ getAbnormalName(scope.row.warningResult) }}</span
              >
              <span
                v-else-if="
                  scope.row.ruleSnapshot &&
                    scope.row.ruleSnapshot.classification == 2
                "
                style="color: #FF9A35;"
                >{{ getAbnormalName(scope.row.warningResult) }}</span
              >
              <span v-else>{{ getAbnormalName(scope.row.warningResult) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="200"
            prop="warningTime"
            label="预警时间"
          ></el-table-column>
          <el-table-column show-overflow-tooltip width="150" label="医院编号">
            <template slot-scope="scope">{{
              scope.row.patientHosId ? scope.row.patientHosId : "--"
            }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="150" label="开单医生">
            <template slot-scope="scope">{{
              scope.row.doctorName ? scope.row.doctorName : "--"
            }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="150" label="开单科室">
            <template slot-scope="scope">{{
              scope.row.deptName ? scope.row.deptName : "--"
            }}</template>
          </el-table-column>
          <el-table-column
            width="80"
            show-overflow-tooltip
            prop="state"
            label="状态"
          >
            <template slot-scope="scope">
              <section>
                {{
                  scope.row.state == 0
                    ? "未处理"
                    : scope.row.state == 1
                    ? "已处理"
                    : "已结束"
                }}
              </section>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="220" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.state == 0"
                @click.stop="handle(scope.row, 1, item)"
                type="text"
                >处理</el-button
              >
              <el-button
                v-if="scope.row.state == 0"
                @click="batchHandle(scope.row)"
                type="text"
                >忽略</el-button
              >
              <el-button
                v-if="scope.row.state == 0"
                @click="viewHistory(scope.row)"
                type="text"
                >查看</el-button
              >
              <el-button
                v-if="scope.row.state == 1"
                @click.stop="handle(scope.row, 2, item)"
                type="text"
                >追加处理</el-button
              >
              <el-button
                v-if="scope.row.state == 2"
                type="text"
                @click.stop="handle(scope.row, 3, item)"
                >查看处理情况</el-button
              >
              <el-button
                v-if="scope.row.state != 0"
                @click.stop="seeOperationRecords(scope.row)"
                type="text"
                >操作记录</el-button
              >
              <el-button
                v-if="getStr(states) == '1'"
                @click.stop="Finish(scope.row.serialNo)"
                type="text"
                >结束</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <div class="fpimgbox" v-else>
      <img src="~@/assets/images/zwsj.png" alt="暂无数据" />
    </div>
    <el-pagination
      class="pageBottom"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="mainList.total"
    ></el-pagination>
    <el-dialog title="异常详情" :visible.sync="detailDialogVisible" width="50%">
      <div class="item">
        <span class="key">预警类型：</span>
        <span class="value">重大阳性</span>
      </div>
      <div class="item">
        <span class="key">预警内容：</span>
        <span class="value">{{ rowInfo.warningContent }}</span>
      </div>
      <div class="item">
        <span class="key">异常规则：</span>
        <span class="value">{{ rowInfo.ruleSnapshotName }}</span>
      </div>
      <div class="item">
        <span class="key">异常内容：</span>
        <table border>
          <tr v-for="(item, index) in rowInfo.warningResult" :key="index">
            <td class="keys">{{ item.hitName }}</td>
            <td class="values">
              {{ item.hitData }} {{ item.hitUnit ? item.hitUnit : "" }}
            </td>
          </tr>
        </table>
      </div>
      <div class="item">
        <span class="key">医院编号：</span>
        <span class="value">{{ rowInfo.patientHosId }}</span>
      </div>
      <div class="item">
        <span class="key">开单医生：</span>
        <span class="value">{{ rowInfo.doctorName }}</span>
      </div>
      <div class="item">
        <span class="key">预警时间：</span>
        <span class="value">{{ rowInfo.warningTime }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="操作记录"
      :visible.sync="recordDialogVisible"
      width="800px"
    >
      <el-table :data="tableData" border stripe>
        <el-table-column
          prop="handleUser"
          label="操作人"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="操作时间"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="handlingResult"
          label="处理内容"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="warningTime"
          label="预警时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="handleType"
          label="操作"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="recordDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="title"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="80%"
      :close-on-click-modal="false"
      :before-close="hide"
    >
      <div slot="title" class="dialog-title">
        <span class="dialog-title-title">{{ title }}</span>
        <span v-if="dialogTitle.name">{{ dialogTitle.name }}</span>
        <span v-if="dialogTitle.patientId">({{ dialogTitle.patientId }})</span>
        <span v-if="dialogTitle.gender">{{ dialogTitle.gender }}</span>
        <span v-if="dialogTitle.age">{{ dialogTitle.age }}</span>
        <span v-if="dialogTitle.phone">{{ dialogTitle.phone }}</span>
        <span v-if="dialogTitle.phone"
          ><i
            style="color:#32ae57;font-size: 21px;margin-left: 3px;cursor: pointer;"
            class="el-icon-phone-outline"
            @click="call(dialogTitle.phone)"
          ></i
        ></span>
      </div>
      <div class="main">
        <div class="left">
          <el-form
            v-if="type != 3"
            :model="ruleForm"
            ref="ruleForm"
            :rules="rules"
            class="demo-ruleForm"
          >
            <div class="items">
              <span class="key">医院编号：</span>
              <span class="value">{{ ruleForm.patientHosId ? ruleForm.patientHosId : "--" }}</span>
            </div>
            <div class="items">
              <p class="key">处理类型</p>
              <el-form-item prop="fuType">
                <el-select
                  v-model="ruleForm.fuType"
                  @change="switchFollowupType"
                >
                  <el-option
                    v-for="(item, index) in followupTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                  <el-option label="其他" value="其他"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="items">
              <p class="key">处理状态</p>
              <div v-if="ruleForm.fuType == '定期复诊'">
                <el-form-item prop="fuContentId">
                  <el-select v-model="ruleForm.fuContentId">
                    <el-option
                      v-for="(item, index) in deptList1"
                      :key="index"
                      :label="item.deptName"
                      :value="item.deptName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item prop="fuContent">
                <el-input
                  v-if="ruleForm.fuType == '消息提醒'"
                  type="textarea"
                  v-model="ruleForm.fuContent"
                ></el-input>
                <el-input
                  v-if="ruleForm.fuType == '其他'"
                  type="textarea"
                  v-model="ruleForm.fuContent"
                ></el-input>
                <el-select
                  v-if="
                    ruleForm.fuType == '健康宣教' ||
                      ruleForm.fuType == '调查问卷'
                  "
                  multiple
                  filterable
                  reserve-keyword
                  v-model="ruleForm.fuContent"
                  style="display: inline-block;"
                >
                  <el-option
                    v-for="(item, index) in followupContentList"
                    :key="index"
                    :label="item.questionnaireName"
                    :value="item.serialNo"
                  ></el-option>
                </el-select>
                <div v-if="ruleForm.fuType == '定期复诊'">
                  <el-input
                    type="textarea"
                    v-model="ruleForm.fuContent"
                  ></el-input>
                </div>
                <el-select
                  v-if="ruleForm.fuType == ''"
                  v-model="ruleForm.fuContent"
                >
                  <el-option
                    v-for="(item, index) in followupContentList"
                    :key="index"
                    :label="item.questionnaireName"
                    :value="item.serialNo"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="items">
              <p class="key">处理内容</p>
              <el-form-item prop="handlingResult">
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="ruleForm.handlingResult"
                  show-word-limit
                  :maxlength="100"
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
          <div class="historySend" v-if="type == 2 || type == 3">
            <div class="hsTitle">历史发送</div>
            <div class="hsInfo">
              <div class="hsInfoLi">
                <span class="key">预警内容</span>
                <div class="value">{{ ruleForm.warningContent }}</div>
              </div>
              <div class="hsInfoLi">
                <span class="key">异常内容</span>
                <div class="value">
                  <div v-if="ruleForm.warningType != 'WJYC'">
                    {{ ruleForm.warningIndex }}
                  </div>
                  <div v-else>
                    <div
                      v-for="(itemx, index) in JSON.parse(ruleForm.warningIndex)
                        .questionList"
                      :key="index"
                    >
                      <div v-if="itemx.abnormal">
                        问题{{ index + 1 + "：" + itemx.label }}
                        <p>答案：{{ itemx.value }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="hsInfoLi">
                <span class="key">预警时间</span>
                <div class="value">{{ ruleForm.warningTime }}</div>
              </div>
            </div>
            <div class="hsBlock" v-for="(item, index) in hsList" :key="index">
              <div class="hsbContent">
                <p class="key">{{ item.flupContent }}</p>
                <p class="value">{{ item.handlingResult }}</p>
              </div>
              <div class="hsbTitle">
                <span class="hsbType">{{ item.handleType }}</span>
                <span class="rightDisplay">{{ item.createTime }}</span>
                <span>{{ item.handleUser }}</span>
              </div>
              <!-- <span class="hsbh3">{{ item.flupContent }}</span>
              <div class="hsbContent">{{ item.handlingResult }}</div>-->
            </div>
          </div>
        </div>
        <div class="right">
          <PatientInfo :user-id="ruleForm.userId"></PatientInfo>
        </div>
      </div>
      <span slot="footer" class="dialog-footers">
        <el-button @click="hide" v-if="type != 3">取消</el-button>
        <!-- <el-button
          type="primary"
          plain
          @click="Finish(ruleForm.serialNo)"
          v-if="type != 3"
          >结束</el-button
        > -->
        <el-button type="primary" @click="bc">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PatientInfo from "../health_archives/components/patient_info.vue";
export default {
  data() {
    return {
      deptList: [],
      deptList1: [],
      deptId: "",
      his_setion_id: "",
      isAuthority: false,
      dialogVisible: false,
      mainList: {},
      activeName: "",
      date: [],
      followupTypeList: [],
      followupContentList: [],
      pageNo: 1,
      pageSize: 10,
      name: "",
      states: [],
      currentPage: 1,
      detailDialogVisible: false,
      recordDialogVisible: false,
      hospitalId: "",
      rowInfo: {},
      warningType: ["ZDYX"],
      tableData: [],
      hospitalId: "",
      followupContentList: [],
      query: {},
      ruleForm: {
        fuType: "",
        fuContent: "",
        handlingResult: ""
      },
      hsList: [],
      rules: {
        fuType: [
          { required: true, message: "请选择处理类型", trigger: "change" }
        ],
        fuContent: [{ required: true, message: "请输入", trigger: "change" }],
        fuContentId: [
          { required: true, message: "请选择内容", trigger: "change" }
        ]
      },
      type: 1,
      title: "处理",
      addShow: false,
      timer: null,
      dialogTitle: {}
    };
  },
  created() {
    this.date[0] = this.dateAdd(-1);
    this.date[1] = this.dateAdd(0);
  },
  async mounted() {
    switch (this.$route.params.type) {
      case "start":
        this.states = [0];
        this.addShow = true;
        this.timer = setInterval(() => {
          setTimeout(this.getWrining(this.pageNo), 0);
        }, 5 * 60 * 1000);
        break;
      case "carryout":
        this.states = [1];
        break;
      case "end":
        this.states = [2];
        break;
      default:
        this.states = [0];
    }
    await this.getDeptList();
    await this.getRight();
    this.getWrining();
    this.hospitalId = JSON.parse(sessionStorage.getItem("global")).hospital_id;
    this.$apis
      .flupTypequeryFollowTypeList({
        keyWord: "",
        enable: 1,
        hospitalId: this.hospitalId
      })
      .then(res => {
        this.followupTypeList = res.list.filter(item => {
          return (
            item.name !== "定期检查" &&
            item.name !== "定期检验" &&
            item.name !== "专科随访" &&
            item.name !== "慢病评估报告" &&
            item.name !== "处方提醒"
          );
        });
      });
  },
  components: {
    PatientInfo
  },
  computed: {
    newDeptList() {
      let list = [];
      if (!this.isAuthority) {
        list = this.deptList.filter(
          item => item.deptCode == this.his_setion_id
        );
      } else {
        list = this.deptList;
      }
      return list;
    }
  },
  methods: {
    async getRight() {
      let { ret_data } = await this.$apis.getPermissions({});
      if (ret_data.dataRangeList && ret_data.dataRangeList.length) {
        let info = ret_data.dataRangeList[0];
        if ((info.model_id = 678 && info.data_range >= 300)) {
          this.isAuthority = true;
        } else {
          await this.getSectionDetail();
          // this.his_setion_id = this.$global.sectionId;
          // this.$nextTick(() => {
          //  this.deptId = this.$global.sectionId;
          //});
        }
      }
      console.log("权限", ret_data.dataRangeList);
    },
    async getSectionDetail() {
      let { ext_prop_value } = await this.$apis.getSectionDetail({
        sectionId: JSON.parse(sessionStorage.getItem('global')).sectionId
      });
      if (ext_prop_value) {
        this.his_setion_id = JSON.parse(ext_prop_value).his_setion_id;
        this.$nextTick(() => {
          this.deptId = JSON.parse(ext_prop_value).his_setion_id;
        });
      }
    },
    async getDeptList() {
      let res = await this.$apis.departmentquery({
        flupDepartment: 1,
        hospitalId: this.$global.hospital_id,
        pageNo: 1,
        pageSize: 1000
      });
      this.deptList = res.list;
      console.log("科室", this.deptList);
    },
    call(Phone) {
      this.$message({
        type: "warning",
        message: "网络异常，电话无法呼出!"
      });
      return;
      if (Phone) {
        this.ipccPhone = Phone;
        this.$nextTick(() => {
          this.$refs.ipccRef.callOut();
        });
      }
    },
    // 拨号功能(暂时不做)
    Dial() {
      this.$message({
        type: "success",
        message: "拨号成功"
      });
    },
    // 查看操作记录
    seeOperationRecords(row) {
      this.$apis
        .queryOperationRecords({
          warnSerialNo: row.serialNo
        })
        .then(res => {
          this.tableData = res;
          this.recordDialogVisible = true;
        });
    },
    // 导出
    Download(event) {
      event.target.blur();
      if (event.target.nodeName == "SPAN") {
        event.target.parentNode.blur();
      }
      let deptId = '';
      if (this.deptList && this.deptList.length) {
        let info = this.deptList.find(item => item.deptCode == this.deptId);
        if (info) {
          deptId = info.serialNo;
        }
      }
      this.$apis
        .exportTelemonitorWarning({
          start: this.date && this.date.length ? this.date[0] : "",
          end: this.date && this.date.length ? this.date[1] : "",
          warningType: this.getStr(this.warningType),
          states: this.getStr(this.states),
          name: this.name,
          deptId 
        })
        .then(res => {
          try {
            let url = window.URL.createObjectURL(
              // data为后端返回的文件流,type 属性值根据下载文件的格式进行定义
              new Blob([res], { type: "application/ms-excel" })
            );
            // 进行基本思路的操作
            let link = document.createElement("a");
            link.href = url;
            link.download = "指标异常预警.xlsx";
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (e) {
            this.$message.error("导出异常，请联系管理员解决！");
          }
        })
        .catch(err => {
          this.$message.error("导出异常，请联系管理员解决！");
        });
    },
    //新增患者异常标记
    addRecord() {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + "/pc";
      }
      window.parent.postMessage(
        JSON.stringify({
          method: "addTab",
          url: urlx + "/#/addWarning?token=" + this.$route.query.token,
          title: "添加患者异常标记"
        }),
        "*"
      );
    },
    // 获取时间
    dateAdd(days) {
      var date = new Date();
      date.setDate(date.getDate() + days);
      var time = date.toISOString().slice(0, 10);
      return time;
    },
    // 获取列表
    getWrining(pageNo) {
      console.log(12138,this.deptId,this.deptList)
      let deptId = '';
      if (this.deptList && this.deptList.length) {
        let info = this.deptList.find(item => item.deptCode == this.deptId);
        if (info) {
          deptId = info.serialNo;
        }
      }
      console.log("deptd", deptId)
      this.$apis
        .warningQuery(
          pageNo || 1,
          this.pageSize,
          this.getStr(this.warningType),
          this.name,
          this.date && this.date.length ? this.date[0] : "",
          this.date && this.date.length ? this.date[1] : "",
          this.getStr(this.states),
          deptId
        )
        .then(res => {
          this.mainList = res;
          this.mainList.list.forEach(item => {
            item.warningPoList.forEach(items => {
              items.ruleSnapshot = items.ruleSnapshot
                ? JSON.parse(items.ruleSnapshot)
                : items.ruleSnapshot;
            });
          });
        });
    },
    // 分页查询
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getWrining(val);
    },
    // 处理，追加处理，查看处理情况
    handle(row, type, item = {}) {
      this.dialogTitle = item;
      this.type = type;
      this.title = type == 1 ? "处理" : type == 2 ? "追加处理" : "查看处理情况";
      this.ruleForm = {
        ...row,
        fuType: "",
        fuContent: "",
        handlingResult: "",
        fuContentId: ""
      };
      this.dialogVisible = true;
      if (type == 2 || type == 3) this.getQueryHistory();
    },
    // 忽略
    batchHandle(row) {
      this.$apis
        .addWainingHandle({
          userId: row.userId,
          warningSerialNo: row.serialNo,
          handleType: "忽略"
        })
        .then(res => {
          this.$message.success("操作成功");
          this.getWrining();
        });
    },
    // 查看
    viewHistory(row) {
      let row1 = JSON.parse(JSON.stringify(row));
      this.rowInfo = row1;
      let ruleSnapshot = row1.ruleSnapshot;
      if (ruleSnapshot && ruleSnapshot.positiveConditions) {
        ruleSnapshot.positiveConditions = JSON.parse(
          ruleSnapshot.positiveConditions
        );
      }
      this.rowInfo.warningResult = this.rowInfo.warningResult
        ? JSON.parse(this.rowInfo.warningResult)
        : this.rowInfo.warningResult;
      this.rowInfo.ruleSnapshotName =
        ruleSnapshot &&
        ruleSnapshot.positiveConditions &&
        ruleSnapshot.positiveConditions.length > 0
          ? this.getRuleSnapshotName(ruleSnapshot.positiveConditions)
          : "";
      this.detailDialogVisible = true;
    },
    getRuleSnapshotName(arr) {
      let str = "";
      arr.forEach((item, index) => {
        if (index == arr.length - 1) {
          str +=
            item.indicatorName +
            this.getCompareList(item.conditionSymbol) +
            item.value;
        } else {
          let name = item.connectSymbol == 1 ? " 或 " : " 与 ";
          str +=
            item.indicatorName +
            this.getCompareList(item.conditionSymbol) +
            item.value +
            name;
        }
      });
      return str;
    },
    //
    getAbnormalName(str) {
      if (!str) return "";
      let arr = JSON.parse(str);
      let newArr = [];
      arr.forEach(item => {
        if (item.hitUnit) {
          newArr.push(item.hitData + item.hitUnit);
        } else {
          newArr.push(item.hitData);
        }
      });
      return newArr.join("；");
    },
    getCompareList(v) {
      let arr = [
        {
          id: 1,
          name: "等于"
        },
        {
          id: 2,
          name: "不等于"
        },
        {
          id: 3,
          name: "大于"
        },
        {
          id: 4,
          name: "小于"
        },
        {
          id: 5,
          name: "大于等于"
        },
        {
          id: 6,
          name: "小于等于"
        },
        {
          id: 7,
          name: "包含"
        },
        {
          id: 8,
          name: "不包含"
        }
      ];
      let newArr = arr.filter(item => {
        return item.id == v;
      });
      return newArr[0].name;
    },
    // 搜索
    onSearch() {
      this.getWrining("1");
    },
    // 数组转字符串
    getStr(arr) {
      if (arr.length == 0) return "";
      return arr.join();
    },
    switchFollowupType(val) {
      console.log(val);
      this.ruleForm.fuContent = "";
      this.ruleForm.fuContentId = "";
      this.ruleForm.handlingResult = "";
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
      });
      if (this.ruleForm.fuType == "定期复诊") {
        this.$apis.systemManagequeryCurrentUserDept().then(res => {
          this.deptList1 = res;
        });
      } else {
        this.$apis
          .flupPathqueryFollowUpContent({
            name: val,
            hospitalId: this.hospitalId
          })
          .then(res => {
            this.followupContentList = res;
          });
      }
    },
    // 追加处理获取历史发送数据
    getQueryHistory() {
      this.$apis
        .queryHistory({
          warnSerialNo: this.ruleForm.serialNo,
          pageNo: 1,
          pageSize: 10
        })
        .then(res => {
          this.hsList = res.list;
        });
    },
    // 确定
    bc() {
      if (this.type == 3) {
        this.hide();
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let form = {
              handleType: this.ruleForm.fuType,
              questionnaireId: [],
              handlingResult: this.ruleForm.handlingResult,
              userId: this.ruleForm.userId,
              warningSerialNo: this.ruleForm.serialNo
            };
            if (this.ruleForm.fuType == "定期复诊") {
              form.questionnaireId[0] = this.deptList.filter(
                x => x.deptName == this.ruleForm.fuContentId
              )[0].serialNo;
              form.fuContent =
                this.ruleForm.fuContentId + "|" + this.ruleForm.fuContent;
            } else if (
              this.ruleForm.fuType == "消息提醒" ||
              this.ruleForm.fuType == "其他"
            ) {
              form.questionnaireId[0] = this.ruleForm.fuContent;
              form.fuContent = this.ruleForm.fuContent;
            } else {
              form.questionnaireId = this.ruleForm.fuContent;
            }
            this.$apis.addWainingHandle(form).then(res => {
              this.$message.success("保存成功");
              this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
              this.hide();
              this.getWrining();
            });
          }
        });
      }
    },
    // 结束预警
    Finish(serialNo) {
      this.$confirm("确定要结束该异常吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 状态变成已完结
          this.$apis
            .updateWarningState({
              warnSerialNo: serialNo
            })
            .then(res => {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.hide();
              this.getWrining();
            });
        })
        .catch(() => {});
    },
    hide() {
      this.ruleForm = {
        fuType: "",
        fuContent: "",
        handlingResult: ""
      };
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
      });
      this.dialogVisible = false;
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style lang="scss">
.exception-warning {
  padding: 0px 20px 20px 20px;
  [role="tab"] {
    border: 1px solid #e6e6e6;
  }
  .el-select__tags-text {
    display: inline-block;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
  .el-collapse {
    border: 0;
  }
  .el-collapse-item__content {
    border: 1px solid #e6e6e6;
    padding: 20px;
  }
  .el-collapse-item + .el-collapse-item {
    margin-top: 10px;
  }
  .el-collapse-item__header {
    border: 0;
    background: #fbfbfb;
    height: 44px;
    line-height: 44px;
  }
  .fpimgbox {
    width: 100%;
    padding-top: 50px;
    img {
      width: 300px;
      height: 350px;
      display: block;
      margin: 0 auto;
    }
  }
  .item {
    display: flex;
    align-items: top;
    margin-bottom: 20px;
    .key {
      flex-shrink: 0;
      display: inline-block;
      width: 100px;
      padding-right: 14px;
      text-align: right;
    }
    .value {
      flex: 1;
    }
  }
  .title {
    flex: 1;
    .text {
      margin-right: 20px;
    }
    .warning {
      padding: 4px 12px;
      height: 28px;
      background: #ffe7db;
      border-radius: 14px;
      font-size: 14px;
      font-weight: normal;
      color: #ff7b35;
    }
    .float-right {
      float: right;
      margin-right: 20px;
    }
  }
  .dialog-title {
    span {
      font-size: 16px;
    }
    .dialog-title-title {
      font-size: 20px;
    }
  }
  .main {
    height: 590px;
    display: flex;
    .left {
      width: 310px;
      background: #ffffff;
      border: 1px solid #e6e6e6;
      display: flex;
      flex-direction: column;
      .demo-ruleForm {
        padding: 20px 10px 0;
        .items {
          margin-bottom: 14px;
          .key {
            font-size: 14px;
            color: #333333;
            margin-bottom: 10px;
          }
        }
      }
      .historySend {
        background: #fbfbfb;
        flex: 1;
        overflow-y: auto;
        padding: 20px 10px;
        .hsTitle {
          font-size: 16px;
          font-weight: 800;
          color: #333333;
          position: relative;
          margin-bottom: 14px;
        }
        .hsTitle::after {
          position: absolute;
          left: 0;
          bottom: -14px;
          width: 270px;
          content: "";
          height: 1px;
          background: #d7dae0;
        }
        .hsInfo {
          padding-top: 20px;
          .hsInfoLi {
            margin-bottom: 14px;
            display: flex;
            .key {
              width: 60px;
              margin-right: 21px;
            }
            .value {
              flex: 1;
            }
          }
        }
        .hsBlock {
          background: #ffffff;
          box-sizing: border-box;
          border: 1px solid #e6e6e6;
          padding: 14px 10px;
          margin-bottom: 10px;
          .hsbContent {
            .key {
              color: #111111;
              font-weight: 800;
              margin-bottom: 10px;
            }
            .value {
              letter-spacing: 0.2px;
              color: #333333;
              padding-bottom: 14px;
            }
          }
          .hsbTitle {
            position: relative;
            font-size: 12px;
            color: #666666;
            margin-top: 10px;
            .rightDisplay {
              margin-right: 10px;
            }
            .hsbType {
              font-size: 12px;
              height: 20px;
              line-height: 20px;
              padding: 0 8px;
              border-radius: 10px;
              margin-right: 13px;
              border: 1px solid #32ae57;
              color: #00982d;
            }
          }
          .hsbTitle::before {
            position: absolute;
            content: "";
            width: 260px;
            height: 1px;
            background: #e6e6e6;
            left: 0;
            top: -10px;
          }
        }
      }
    }
    .right {
      overflow-y: auto;
      margin-left: 20px;
      flex: 1;
    }
  }
  .dialog-footers {
    .el-button {
      width: 96px !important;
      height: 36px !important;
      margin-left: 10px !important;
    }
    .is-plain {
      background: #f5faff;
      box-sizing: border-box;
      border: 1px solid #0276d7;
      color: #0276d7;
    }
    .is-plain:hover {
      background: #409eff;
      color: #ffffff;
    }
  }
  .el-tabs__item {
    border: none !important;
  }
  table {
    border-collapse: collapse;
    border-color: #e6e6e6;
    tr {
      td {
        padding: 10px 30px;
      }
      .keys {
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0.2px;
        color: #666666;
      }
      .values {
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 0.2px;
        color: #111111;
      }
    }
  }
}
</style>
