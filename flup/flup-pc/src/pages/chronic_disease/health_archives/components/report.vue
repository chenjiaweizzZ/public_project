<template>
  <div class="estimate-report">
    <el-tabs v-model="activeName">
      <el-tab-pane name="1" label="评估报告">
        <div id="reportbox" class="padding-top20">
          <div class="text-align-center font-size10 bold relative">
            {{ item.title }}
            <div class="absolute font-size2 color-333" style="right: 20px; top: 10px; font-weight: normal">报告ID: {{ item.reportId }}</div>
          </div>
          <div v-if="item.patientDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 padding-top20">基本信息</div>
          <div v-if="item.patientDisplay">
            <table class="table">
              <tr>
                <td class="table-label">姓名</td>
                <td class="table-value">{{ patientInfo.patientName | hideInfo("patientName") }}</td>
                <td class="table-label">性别</td>
                <td class="table-value">{{ patientInfo.sex }}</td>
                <td class="table-label">年龄</td>
                <td class="table-value">{{ patientInfo.age }}</td>
                <td class="table-label">电话</td>
                <td class="table-value">{{ patientInfo.phone | hideInfo("phone") }}</td>
              </tr>
              <tr>
                <td class="table-label">身高</td>
                <td class="table-value">{{ height || "-" }}</td>
                <td class="table-label">体重</td>
                <td class="table-value">{{ weight || "-" }}</td>
                <td class="table-label">血压</td>
                <td class="table-value">{{ bloodPressure || "-" }}</td>
                <td class="table-label">血糖</td>
                <td class="table-value">{{ bloodSugar || "-" }}</td>
              </tr>
              <tr>
                <td class="table-label">体重指数</td>
                <td class="table-value">{{ BMI || "-" }}</td>
                <td class="table-label">吸烟</td>
                <td class="table-value">{{ patientInfo.smokeHistory || "-" }}</td>
                <td class="table-label">饮酒</td>
                <td class="table-value">{{ patientInfo.drinkHistory || "-" }}</td>
                <td class="table-label">降压情况</td>
                <td class="table-value">{{ "-" }}</td>
              </tr>
              <tr>
                <td class="table-label">既往史</td>
                <td class="table-value" colspan="7">{{ patientInfo.pastHistory }}</td>
              </tr>
              <tr>
                <td class="table-label">家族慢病史</td>
                <td class="table-value" colspan="7">{{ patientInfo.familyHistory }}</td>
              </tr>
              <tr>
                <td class="table-label">入院诊断</td>
                <td class="table-value" colspan="7">{{ patientInfo.emAdmissionSimpleRecord && patientInfo.emAdmissionSimpleRecord.presentHistory }}</td>
              </tr>
              <tr>
                <td class="table-label">家庭地址</td>
                <td class="table-value" colspan="7">{{ patientInfo.homeAddrHouseNumber }}</td>
              </tr>
            </table>
          </div>
          <div v-if="item.detectDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">健康监测数据</div>
          <el-row v-if="item.detectDisplay" type="flex" style="flex-wrap: wrap" class="padding20">
            <div class="card" v-for="item in chartDataList" :key="item.label">
              <ve-line
                class="margin-top10"
                :title="{ text: item.label, left: 16 }"
                :data="item.data"
                :colors="VLineColors"
                :grid="VLineGrid"
                :settings="{ labelMap: item.labelMap }"
                :extend="lienExtend"
              ></ve-line>
            </div>
          </el-row>
          <el-row v-if="item.riskDisplay" type="flex" justify="space-between" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">
            风险评估
            <el-select v-model="reportType" placeholder="请选择评估报告" @change="ifurl">
              <el-option v-for="item in reportList" :key="item.value" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-row>
          <div v-if="item.riskDisplay" id="frambox" style="width: 100%">
            <iframe ref="iframe" id="iframex" width="100%" height="500" :src="url" frameborder="0"></iframe>
          </div>

          <div v-if="item.suggestionDisplay" class="padding-bottom12 font-size2 color-333 margin-top20">健康建议</div>
          <div v-if="item.suggestionDisplay" class="border1 padding-top20 relative flex-column" style="height: 500px">
            <!-- {{item.suggestionContent || '-'}} -->
            <el-row class="padding10 border-bottom1" type="flex" justify="space-between" align="middle">
              <div>
                <span>自动编号</span>
                <el-switch v-model="showIndex"></el-switch>
              </div>
            </el-row>
            <el-input
              :autosize="{ minRows: 19, maxRows: 19 }"
              class="textarea flex1"
              type="textarea"
              placeholder="请输入内容"
              v-model="item.suggestionContent"
              maxlength="1000"
              resize="none"
            ></el-input>
            <!-- <textarea class="textarea flex1" v-model="item.suggestionContent" placeholder="请输入内容"></textarea> -->
            <!-- <DivEditable class="flex scroll-auto" v-model="item.suggestionContent" placeholder="请输入内容"></DivEditable> -->
            <div class="side-right border-left1" :style="{ width: sideRightOpen ? '300px' : '0' }">
              <el-carousel trigger="click" height="40px" :loop="false" indicator-position="none" :autoplay="false" arrow="always" @change="changeType">
                <el-carousel-item>
                  <div style="text-align: center; line-height: 40px">常规模板</div>
                </el-carousel-item>
                <el-carousel-item>
                  <div style="text-align: center; line-height: 40px">用药指导</div>
                </el-carousel-item>
                <el-carousel-item>
                  <div style="text-align: center; line-height: 40px">运动方案</div>
                </el-carousel-item>
                <el-carousel-item>
                  <div style="text-align: center; line-height: 40px">饮食建议</div>
                </el-carousel-item>
              </el-carousel>
              <el-tree v-if="activeTemplate == 0 && sideRightOpen" :data="configList" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false">
                <el-tooltip v-if="data.children.length == 0 && data.content" slot-scope="{ node, data }" effect="dark" :content="data.content" placement="top-end">
                  <span style="user-select: none" @dblclick="setContent(data, item, node)">{{ node.label }}</span>
                </el-tooltip>
                <span v-else style="user-select: none" slot-scope="{ node }">{{ node.label }}</span>
              </el-tree>
              <el-tabs v-else v-model="active" stretch>
                <el-tab-pane name="当前" label="当前">
                  <el-table :data="historyListx" border>
                    <el-table-column label="方案" :width="90" prop="type"></el-table-column>
                    <el-table-column label="创建时间" :width="120" prop="createTime" :formatter="$utils.formatTableDate()"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="{ row }">
                        <el-button type="text" @click="selectTemplate(row)">选择</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <el-input v-if="historyListx.length > 0" type="textarea" v-model="historyListx[0]['content']" disabled :autosize="{ minRows: 2, maxRows: 14 }"></el-input>
                </el-tab-pane>
                <el-tab-pane name="历史" label="历史">
                  <el-table :data="historyLists" border>
                    <el-table-column label="方案" :width="90" prop="type"></el-table-column>
                    <el-table-column label="创建时间" :width="120" prop="createTime" :formatter="$utils.formatTableDate()"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="{ row }">
                        <el-button type="text" @click="selectTemplate(row)">选择</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
              <el-row v-if="sideRightOpen" type="flex" justify="center" class="absolute" style="left: 0; right: 0; bottom: 10px">
                <el-button type="primary" @click="modify">去修改</el-button>
              </el-row>
              <i class="icon-side_btn absolute cursor-pointer" style="left: -36px; top: 150px" @click="sideRightOpen = !sideRightOpen"></i>
            </div>
          </div>
          <div v-if="item.followDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">随访安排</div>
          <div v-if="item.followDisplay">
            <div class="margin-top14">下次随访安排</div>
            <div class="margin-top10 margin-left20">随访时间：{{ item.followDate || "-" }}</div>
            <div class="margin-top10 margin-left20">随访内容：{{ item.followContent || "-" }}</div>
            <div class="margin-top10 margin-left20">注意事项：{{ item.followMark || "-" }}</div>
          </div>
          <div v-if="item.informedDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">知情同意书</div>
          <div class="buttonFootContainer">
            <div class="containerBackground">
              <el-button type="info" @click="onSave">生成报告</el-button>
              <el-button type="primary" @click="onSaveAndSend">生成并发送</el-button>
            </div>
          </div>
          <div v-if="item.informedDisplay" class="pre-wrap padding-top14 padding-bottom60">{{ item.informedContent }}</div>
          <!--解决ios兼容问题-->
          <div style="height:20px"></div>
        </div>
        <!-- <el-row
          class="padding-top20 margin-top20"
          style="box-shadow: 0 -2px 6px 0 rgba(0,0,0,0.18);display:flex;justify-content:center;z-index:1000"
          type="flex"
          align="middle"
          justify="end"
        >-->

        <!-- <el-col style="height:25px">

        </el-col>-->
        <!-- </el-row> -->
      </el-tab-pane>
      <el-tab-pane name="2" label="评估记录">
        <el-table class="margin-top20" :data="recordList" border>
          <el-table-column type="index" label="序号" :width="50"></el-table-column>
          <el-table-column label="报告ID" prop="reportId"></el-table-column>
          <el-table-column label="报告医生" prop="createBy"></el-table-column>
          <el-table-column label="报告时间" prop="createTime" :formatter="$utils.formatTableDate()"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{ row }">
              <div v-if="row.send">已发送</div>
              <div v-else>未发送</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button type="text" @click="onSend(row)">发送</el-button>
              <el-button type="text" @click="yulan(row)">预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="item2.title" :visible.sync="dialogVisible" width="80%" :center="true">
      <div v-if="item2.patientDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">基本信息</div>
      <div v-if="item2.patientDisplay">
        <table class="table">
          <tr>
            <td class="table-label">姓名</td>
            <td class="table-value">{{ patientInfoX.patientName }}</td>
            <td class="table-label">性别</td>
            <td class="table-value">{{ patientInfoX.sex }}</td>
            <td class="table-label">年龄</td>
            <td class="table-value">{{ patientInfoX.age }}</td>
            <td class="table-label">电话</td>
            <td class="table-value">{{ patientInfoX.phone }}</td>
          </tr>
          <tr>
            <td class="table-label">身高</td>
            <td class="table-value">{{ height1 || "-" }}</td>
            <td class="table-label">体重</td>
            <td class="table-value">{{ weight1 || "-" }}</td>
            <td class="table-label">血压</td>
            <td class="table-value">{{ bloodPressure1 || "-" }}</td>
            <td class="table-label">血糖</td>
            <td class="table-value">{{bloodSugar1 || "-" }}</td>
          </tr>
          <tr>
            <td class="table-label">体重指数</td>
            <td class="table-value">{{ BMI1 || "-" }}</td>
            <td class="table-label">吸烟</td>
            <td class="table-value">{{ patientInfoX.smokeHistory || "-" }}</td>
            <td class="table-label">饮酒</td>
            <td class="table-value">{{ patientInfoX.drinkHistory || "-" }}</td>
            <td class="table-label">降压情况</td>
            <td class="table-value">{{ "-" }}</td>
          </tr>
          <tr>
            <td class="table-label">既往史</td>
            <td class="table-value" colspan="7">{{ patientInfoX.pastHistory }}</td>
          </tr>
          <tr>
            <td class="table-label">家族慢病史</td>
            <td class="table-value" colspan="7">{{ patientInfoX.familyHistory }}</td>
          </tr>
          <tr>
            <td class="table-label">入院诊断</td>
            <td class="table-value" colspan="7">{{ patientInfoX.emAdmissionSimpleRecord && patientInfoX.emAdmissionSimpleRecord.presentHistory }}</td>
          </tr>
          <tr>
            <td class="table-label">家庭地址</td>
            <td class="table-value" colspan="7">{{ patientInfoX.homeAddrHouseNumber }}</td>
          </tr>
        </table>
      </div>
      <div v-if="item2.detectDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">健康监测数据</div>
      <el-row v-if="item2.detectDisplay" type="flex" style="flex-wrap: wrap" class="padding20">
        <div class="card" v-for="item in chartDataListX" :key="item.label">
          <ve-line
            class="margin-top10"
            :title="{ text: item.label, left: 16 }"
            :data="item.data"
            :colors="VLineColors"
            :grid="VLineGrid"
            :settings="{ labelMap: item.labelMap }"
            :extend="lienExtend"
          ></ve-line>
        </div>
      </el-row>
      <el-row v-if="item2.riskDisplay" type="flex" justify="space-between" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">
        风险评估
        <p>{{ item2.riskResult }}</p>
      </el-row>
      <div v-if="item2.riskDisplay" id="frambox" style="width: 100%">
        <iframe id="iframex" width="100%" height="500" :src="url2" frameborder="0"></iframe>
      </div>
      <div v-if="item2.suggestionDisplay" class="padding-bottom12 font-size2 color-333 margin-top20">健康建议</div>
      <div v-if="item2.suggestionDisplay" class="border1 padding-top20 relative flex-column" style="height: 500px">
        <!-- <el-row class="padding10 border-bottom1" type="flex" justify="space-between" align="middle"></el-row> -->
        <textarea class="textarea flex1" :disabled="currentItem.authState==20||currentItem.authState==30||currentItem.authState==60" v-model="item2.suggestionContent"></textarea>
      </div>
      <div v-if="item2.followDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">随访安排</div>
      <div v-if="item2.followDisplay">
        <div class="margin-top14">下次随访安排</div>
        <div class="margin-top10 margin-left20">随访时间：{{ item2.followDate || "-" }}</div>
        <div class="margin-top10 margin-left20">随访内容：{{ item2.followContent || "-" }}</div>
        <div class="margin-top10 margin-left20">注意事项：{{ item2.followMark || "-" }}</div>
      </div>
      <div v-if="item2.informedDisplay" class="border-bottom1 padding-bottom12 font-size2 color-333 margin-top20">知情同意书</div>
      <div v-if="item2.informedDisplay" class="pre-wrap margin-top14 padding-bottom60">{{ item2.informedContent }}</div>
      <span slot="footer" class="dialog-footer padding80">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
      <!--解决ios兼容问题-->
      <div style="height:20px"></div>
    </el-dialog>
  </div>
</template>

<script>
import DivEditable from '@/components/div_editable';
import VeLine from 'v-charts/lib/line.common';
import 'echarts/lib/component/title';
// import jigaowei from '@/assets/images/jigaowei.png'
// import gaowei from '@/assets/images/gaowei.png'
// import zhongwei from '@/assets/images/zhongwei.png'
// import diwei from '@/assets/images/diwei.png'

export default {
  name: 'report',
  components: {
    DivEditable,
    [VeLine.name]: VeLine,
  },
  props: {
    contentJson: String,
    serialNo: String
  },
  data() {
    this.VLineColors = ['#19d4ae', '#5ab1ef', '#fa6e86'];
    this.VLineGrid = { left: 10, right: 30 };
    this.lienExtend = {
      xAxis: {
        axisLabel: {
          showMaxLabel: true,
          formatter: function (value) {
            var valueDetal = value.split(' ');
            if (valueDetal.length > 0) {
              var temp = valueDetal[0] + '\n' + valueDetal[1];
              return temp;
            } else {
              return value;
            }
          },
        },
      },
    };
    return {
      dialogVisible: false,
      activeName: '1',
      recordList: [],
      patientInfo: {},
      item: {},
      sideRightOpen: false,
      defaultProps: {
        label: 'node',
      },
      activeTemplate: 0,
      configList: [],
      chartDataList: [],
      reportType: null,
      reportList: [],
      showIndex: true,
      active: '当前',
      historyList: [],
      patientInfoX: {},
      chartDataListX: [],
      serialNumberlist: [1],
      historyListx: [],
      historyLists: [],
      url: null,
      url2: null,
      item2: {},
      bloodPressure: '-',
      bloodSugar: '-',
      weight: '-',
      BMI: '-',
      height: '-',
      bloodPressure1: '-',
      bloodSugar1: '-',
      weight1: '-',
      BMI1: '-',
      height1: '-',
      currentItem:{}
    };
  },
  watch: {
    activeTemplate: {
      handler() {
        // this.queryInterveneConfig(this.activeTemplate)
      },
      immediate: true,
    },
    activeName() {
      if (this.activeName == '2') {
        this.$apis
          .getReportList({
            userId: this.$route.query.userId,
            hospitalId: this.$global.hospital_id,
          })
          .then((res) => {
            this.recordList = res;
          });
      }
    },
  },
  computed: {},
  mounted() {
    this.$apis
      .riskassessment({
        pageNo: 1,
        pageSize: 9999,
      })
      .then((res) => {
        this.reportList = res.list;
      });
    // this.reportList = JSON.parse(this.contentJson).modules[2].fields
    // this.reportType = JSON.parse(this.contentJson).modules[2].value[0]
    this.queryInterveneConfig('常规模板');
    this.getDiseaseReport();
    this.getCurrentItem();
    // this.ifurl()
  },
  methods: {
    getCurrentItem(){
      this.$apis
        .getFollowupTaskInfoForJava({
          serialNo: this.serialNo,
        })
        .then((res) => {
          this.currentItem = res || {};
        });
    },
    ifurl() {
      let smartFormUrl = this.$parent.$baseURL.SmartFormUrl;
      this.item.riskType = this.reportType;
      this.reportList.forEach((element) => {
        if (element.id == this.item.riskType) {
          this.item.riskResult = element.name;
        }
      });
      this.getFormId();
      // this.url =
      //   smartFormUrl +
      //   '/view/form/createViaFormId?appid=flupsystem&businessId=78978900011&saveHook= ' +
      //   this.$parent.$baseURL.ICDMApiUrl +
      //   '/s/smartForm/saveHook&templateId=' +
      //   this.reportType +
      //   '&formId=0001'
    },
    yulan(row) {
      this.$apis
        .getFormById({
          id: row.riskFormId,
          templateId: row.riskType,
        })
        .then((res) => {
          this.url2 = res;
        });

      this.$apis.queryById({ reportId: row.id }).then((res) => {
        this.item2 = res;
        this.patientInfoX = res.patientSimpleInfo;
        this.dialogVisible = true;
        if (res.healthRiskReportRecordList) {
          this.chartDataListX = res.healthRiskReportRecordList.map((item) => {
            let rows = JSON.parse(item.data);
            if (item.type == 'bloodPressure') {
              this.bloodPressure1 =
                (rows[rows.length - 1].bloodPressureL ? rows[rows.length - 1].bloodPressureL : '-') +
                '/' +
                (rows[rows.length - 1].bloodPressureH ? rows[rows.length - 1].bloodPressureH : '-');

              return {
                data: {
                  columns: ['checkDatetime', 'bloodPressureH', 'bloodPressureL'],
                  rows,
                },
                unit: 'mmHg',
                label: '血压',
                labelMap: {
                  bloodPressureL: '舒张压',
                  bloodPressureH: '收缩压',
                },
              };
            } else if (item.type == 'spo2') {
              return {
                data: {
                  columns: ['checkDatetime', 'spo2'],
                  rows,
                },
                unit: '%',
                label: '血氧',
                labelMap: {
                  spo2: '血氧',
                },
              };
            } else if (item.type == 'bloodSugar') {
              this.bloodSugar1 =
                (rows[rows.length - 1].bloodSugarBeforeMeal ? rows[rows.length - 1].bloodSugarBeforeMeal : '-') +
                '/' +
                (rows[rows.length - 1].bloodSugarAfterMeal ? rows[rows.length - 1].bloodSugarAfterMeal : '-');
              return {
                data: {
                  columns: ['checkDatetime', 'bloodSugarBeforeMeal', 'bloodSugarAfterMeal', 'bloodSugar'],
                  rows,
                },
                unit: 'mmol/L',
                label: '血糖',
                labelMap: {
                  bloodSugarBeforeMeal: '餐前血糖',
                  bloodSugarAfterMeal: '餐后血糖',
                  bloodSugar: '随机血糖'
                },
              };
            } else if (item.type == 'temperature') {
              return {
                data: {
                  columns: ['checkDatetime', 'bodyTemperature'],
                  rows,
                },
                unit: '℃',
                label: '体温',
                labelMap: {
                  bodyTemperature: '体温',
                },
              };
            } else if (item.type == 'bmi') {
              this.BMI1 = rows[rows.length - 1].bmi;
              return {
                data: {
                  columns: ['checkDatetime', 'bmi'],
                  rows,
                },
                unit: '',
                label: 'BMI',
                labelMap: {
                  bmi: 'BMI',
                },
              };
            } else if (item.type == 'heartRate') {
              return {
                data: {
                  columns: ['checkDatetime', 'heartRate'],
                  rows,
                },
                unit: '次/分',
                label: '心率',
                labelMap: {
                  heartRate: '心率',
                },
              };
            } else if (item.type == 'height') {
              this.height1 = rows[rows.length - 1].height;
              return {
                data: {
                  columns: ['checkDatetime', 'height'],
                  rows,
                },
                unit: 'cm',
                label: '身高',
                labelMap: {
                  height: '身高',
                },
              };
            } else if (item.type == 'weight') {
              this.weight1 = rows[rows.length - 1].weight;
              return {
                data: {
                  columns: ['checkDatetime', 'weight'],
                  rows,
                },
                unit: 'kg',
                label: '体重',
                labelMap: {
                  weight: '体重',
                },
              };
            } else if (item.type == 'waistLine') {
              return {
                data: {
                  columns: ['checkDatetime', 'waistLine'],
                  rows,
                },
                unit: 'cm',
                label: '腰围',
                labelMap: {
                  waistLine: '腰围',
                },
              };
            } else if (item.type == 'boneDensity') {
              return {
                data: {
                  columns: ['checkDatetime', 'checkResult'],
                  rows,
                },
                unit: '',
                label: '骨密度',
                labelMap: {
                  checkResult: '骨密度',
                },
              };
            }
          });
        }
      });
    },
    onSend(row) {
      this.$apis
        .sendReport({
          reportId: row.id,
          userId: row.patientId,
          reportTitle: row.title,
        })
        .then((res) => {
          this.$notify({
            title: '成功',
            message: '发送成功',
            type: 'success',
          });
          this.$apis
            .getReportList({
              userId: this.$route.query.userId,
              hospitalId: this.$global.hospital_id,
            })
            .then((res) => {
              this.recordList = res;
            });
        });
    },
    onSaveAndSend() {
      if (this.reportType) {
        this.iframeSave();
      }
      this.item.type = 2;
      this.$apis.reportpushAndSend(this.item).then(() => {
        this.$notify({
          title: '成功',
          message: '生成发送成功',
          type: 'success',
        });
        this.getDiseaseReport();
      });
    },
    onSave() {
      if (this.reportType) {
        this.iframeSave();
      }
      this.item.type = 2;
      this.$apis.saveReport(this.item).then(() => {
        this.$notify({
          title: '成功',
          message: '生成成功',
          type: 'success',
        });
        this.getDiseaseReport();
      });
    },
    iframeSave() {
      this.$refs.iframe.contentWindow.postMessage(
        {
          params: {
            form_id: this.item.formId,
            user_id: this.$route.query.userId,
            old_flup_phone: this.patientInfo.phone,
            flup_phone: '19999999999',
            flup_status: this.patientInfo.followupResult,
            flup_time_real: this.completeDate,
            IsSubmit: 0,
          },
        },
        '*'
      );
    },
    queryInterveneConfig(type) {
      this.$apis
        .queryInterveneConfig({
          tab: type,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.configList = res.publicNodeList || [];
        });
    },
    getDiseaseReport() {
      this.$apis
        .getDiseaseReport({
          userId: this.$route.query.userId,
          hospitalId: this.$global.hospital_id,
          planId: this.$route.query.flupPlanId,
        })
        .then((res) => {
          this.patientInfo = res.patientSimpleInfo;
          this.item = res;
          this.reportType = res.riskType;
          this.getFormId();
          this.ifurl();
          if (this.item.healthRiskReportRecordList) {
            this.chartDataList = this.item.healthRiskReportRecordList.map((item) => {
              let rows = JSON.parse(item.data);
              if (item.type == 'bloodPressure') {
                this.bloodPressure =
                  (rows[rows.length - 1].bloodPressureL ? rows[rows.length - 1].bloodPressureL : '-') +
                  '/' +
                  (rows[rows.length - 1].bloodPressureH ? rows[rows.length - 1].bloodPressureH : '-');

                return {
                  data: {
                    columns: ['checkDatetime', 'bloodPressureH', 'bloodPressureL'],
                    rows,
                  },
                  unit: 'mmHg',
                  label: '血压',
                  labelMap: {
                    bloodPressureL: '舒张压',
                    bloodPressureH: '收缩压',
                  },
                };
              } else if (item.type == 'spo2') {
                return {
                  data: {
                    columns: ['checkDatetime', 'spo2'],
                    rows,
                  },
                  unit: '%',
                  label: '血氧',
                  labelMap: {
                    spo2: '血氧',
                  },
                };
              } else if (item.type == 'bloodSugar') {
                this.bloodSugar =
                  (rows[rows.length - 1].bloodSugarBeforeMeal ? rows[rows.length - 1].bloodSugarBeforeMeal : '-') +
                  '/' +
                  (rows[rows.length - 1].bloodSugarAfterMeal ? rows[rows.length - 1].bloodSugarAfterMeal : '-');
                return {
                  data: {
                    columns: ['checkDatetime', 'bloodSugarBeforeMeal', 'bloodSugarAfterMeal', 'bloodSugar'],
                    rows,
                  },
                  unit: 'mmol/L',
                  label: '血糖',
                  labelMap: {
                    bloodSugarBeforeMeal: '餐前血糖',
                    bloodSugarAfterMeal: '餐后血糖',
                    bloodSugar: '随机血糖'
                  },
                };
              } else if (item.type == 'temperature') {
                return {
                  data: {
                    columns: ['checkDatetime', 'bodyTemperature'],
                    rows,
                  },
                  unit: '℃',
                  label: '体温',
                  labelMap: {
                    bodyTemperature: '体温',
                  },
                };
              } else if (item.type == 'bmi') {
                this.BMI = rows[rows.length - 1].bmi;
                return {
                  data: {
                    columns: ['checkDatetime', 'bmi'],
                    rows,
                  },
                  unit: '',
                  label: 'BMI',
                  labelMap: {
                    bmi: 'BMI',
                  },
                };
              } else if (item.type == 'heartRate') {
                return {
                  data: {
                    columns: ['checkDatetime', 'heartRate'],
                    rows,
                  },
                  unit: '次/分',
                  label: '心率',
                  labelMap: {
                    heartRate: '心率',
                  },
                };
              } else if (item.type == 'height') {
                this.height = rows[rows.length - 1].height;
                return {
                  data: {
                    columns: ['checkDatetime', 'height'],
                    rows,
                  },
                  unit: 'cm',
                  label: '身高',
                  labelMap: {
                    height: '身高',
                  },
                };
              } else if (item.type == 'weight') {
                this.weight = rows[rows.length - 1].weight;
                return {
                  data: {
                    columns: ['checkDatetime', 'weight'],
                    rows,
                  },
                  unit: 'kg',
                  label: '体重',
                  labelMap: {
                    weight: '体重',
                  },
                };
              } else if (item.type == 'waistLine') {
                return {
                  data: {
                    columns: ['checkDatetime', 'waistLine'],
                    rows,
                  },
                  unit: 'cm',
                  label: '腰围',
                  labelMap: {
                    waistLine: '腰围',
                  },
                };
              } else if (item.type == 'boneDensity') {
                return {
                  data: {
                    columns: ['checkDatetime', 'checkResult'],
                    rows,
                  },
                  unit: '',
                  label: '骨密度',
                  labelMap: {
                    checkResult: '骨密度',
                  },
                };
              }
            });
          }
        });
    },
    setContent(data, item, node) {
      // let index = 1
      if (data.children && data.children.length === 0) {
        if (this.item.suggestionContent) {
          this.item.suggestionContent += '\n\n';
        } else {
          this.item.suggestionContent = '';
        }
        if (this.showIndex) {
          if (this.item.suggestionContent) {
            this.serialNumber = this.item.suggestionContent.split('<br><br>').length;
          }
          var trfa = true;
          do {
            for (var i in this.serialNumberlist) {
              let n = this.serialNumberlist[i] + '、';
              if (this.item.suggestionContent.indexOf(n) == -1) {
                this.item.suggestionContent += `${this.serialNumberlist[i]}、`;
                this.serialNumberlist.push(this.serialNumberlist[i] + 1);
                trfa = false;
                break;
              } else {
                if (i == this.serialNumberlist.length - 1) {
                  this.serialNumberlist.push(this.serialNumberlist[i] + 1);
                }
              }
            }
          } while (trfa);
        }
        this.item.suggestionContent += `${data.content || '-'}`;
      }
    },
    modify() {
      if (this.activeTemplate == 0) {
        var urlx;
        if (location.pathname) {
          urlx = location.origin + location.pathname;
        } else {
          urlx = location.origin + '/pc';
        }
        if (this.$isProduction) {
          window.parent.postMessage(
            JSON.stringify({
              method: 'addTab',
              url: urlx + '/#/healthIntervention',
              title: `健康干预模板`,
            }),
            '*'
          );
        } else {
          window.open(urlx + '/#/healthIntervention');
        }
      } else if (this.activeTemplate == 1) {
        this.$parent.openMenu('Medication');
      } else if (this.activeTemplate == 2) {
        this.$parent.openMenu('Sport');
      } else if (this.activeTemplate == 3) {
        this.$parent.openMenu('Diet');
      }
    },
    changeType(index) {
      this.activeTemplate = index;
      if (index != 0) {
        let type;
        switch (index) {
          case 1:
            type = '用药指导';
            break;
          case 2:
            type = '运动方案';
            break;
          case 3:
            type = '饮食建议';
            break;
        }
        this.$apis
          .getConfigHistory({
            typeName: type,
            patientId: this.$route.query.userId,
          })
          .then((res) => {
            this.historyList = res || [];
            this.historyListx = [];
            if (this.historyList[0]) {
              this.historyListx.push(this.historyList[0]);
            }
            this.historyLists = this.historyList.slice(1);
          });
      }
    },
    selectTemplate(row) {
      if (this.item.suggestionContent) {
        this.item.suggestionContent += '\n\n';
      } else {
        this.item.suggestionContent = '';
      }
      if (this.showIndex) {
        if (this.item.suggestionContent) {
          this.serialNumber = this.item.suggestionContent.split('<br><br>').length;
        }
        var trfa = true;
        do {
          for (var i in this.serialNumberlist) {
            let n = this.serialNumberlist[i] + '、';
            if (this.item.suggestionContent.indexOf(n) == -1) {
              this.item.suggestionContent += `${this.serialNumberlist[i]}、`;
              this.serialNumberlist.push(this.serialNumberlist[i] + 1);
              trfa = false;
              break;
            } else {
              if (i == this.serialNumberlist.length - 1) {
                this.serialNumberlist.push(this.serialNumberlist[i] + 1);
              }
            }
          }
        } while (trfa);
      }
      this.item.suggestionContent += `${row.type}\n${row.content || '-'}`;
    },
    getFormId() {
      this.$apis
        .getFormId({
          userId: this.$route.query.userId,
          templateId: this.reportType,
          planId: this.$route.query.flupPlanId,
        })
        .then((res) => {
          this.url = res.flupAddress;
          this.item.id = res.formId;
          this.item.formId = res.formId;
          this.item.riskFormId = res.formId;
        });
    },
  },
};
</script>

<style lang="scss">
.estimate-report {
  .el-carousel__arrow--left,
  .el-carousel__arrow--right {
    background: rgb(255, 255, 255);
    color: black;
  }
  .textarea {
    border: 0;
    padding: 10px;
    flex: 1;
    font-size: 14px;
    font-family: 'PingFangSC-Regular', 'microsoft yahei', 'Arial' !important;
  }
  .side-right {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
    right: 0;
    transition: width ease 0.3s;
    background: #fff;
  }
  .card {
    background: #ffffff;
    box-shadow: 0 4px 21px 0 rgba(0, 0, 0, 0.08);
    border-radius: 8.45px;
    width: 320px;
    height: 400px;
  }
  .level {
    position: relative;
    height: 60px;
    color: #fff;
    text-align: center;
    line-height: 60px;
    // background-color: #32ae57;
    // margin: 0 40px;
  }
  .level-1 {
    background-color: #32ae57;
    margin: 0 40px;
    margin-top: 10px;
  }
  .level-2 {
    background-color: #ff9000;
    margin: 0 80px;
    margin-top: 10px;
  }
  .level-3 {
    background-color: #f15f00;
    margin: 0 120px;
    margin-top: 10px;
  }
  .level-4 {
    width: 0;
    margin: 0 121px;
    border-left: 29px solid transparent;
    border-right: 29px solid transparent;
    border-bottom: 58px solid #ff220a;
    position: relative;
    .text {
      position: absolute;
      width: 40px;
      left: -18px;
      bottom: -55px;
      color: #fff;
      font-size: 12px;
    }
  }
  .level:before {
    z-index: -1;
    content: '';
    display: block;
    width: 40px;
    height: 60px;
    position: absolute;
    transform: skewX(-30deg);
    left: -20px;
    top: 0;
  }
  .level:after {
    content: '';
    z-index: -1;
    display: block;
    width: 40px;
    height: 60px;
    position: absolute;
    transform: skewX(30deg);
    right: -20px;
    top: 0;
  }
  .level-1::before,
  .level-1::after {
    background: #32ae57;
  }
  .level-2::before,
  .level-2::after {
    background: #ff9000;
  }
  .level-3::before,
  .level-3::after {
    background: #f15f00;
  }
  .riskResult {
    background: #ffffff;
    border-radius: 16px;
    line-height: 28px;
    min-width: 90px;
    margin-left: 10px;
    padding: 0 12px;
    text-align: center;
    font-weight: bold;
  }
  .table-label {
    color: #666666;
  }
  .buttonFootContainer {
    position: fixed;
    display: flex;
    height: 66px;
    align-items: center;
    left: 0;
    bottom: 0;
    right: 0;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.18);
    z-index: 1000;
    background-color: #fff;
    text-align: right;
    margin-bottom: -15px;

    .containerBackground {
      width: 100%;
      height: 40px;
      padding-right: 40px;
      // margin-top: 4px;
      // margin-bottom: 4px;
      .el-button {
        height: 38px;
      }
    }
  }
}
</style>
