<!-- 数据维护 -->
<template>
  <div>
    <el-collapse v-model="activeNames">
      <!-- 选择接口 -->
      <el-collapse-item name="1">
        <template slot="title">
          <div class="collapse-title">
            <div class="title-icon"></div>
            <div>选择接口</div>
          </div>
        </template>
        <div class="interface-config-panel">
          <div style="margin-bottom: 10px">
            <el-button type="success" size="mini" plain @click="createEvent"
              >接口替换</el-button
            >
          </div>
          <el-table :data="interfaceList" border stripe>
            <el-table-column label="操作" header-align="center" width="100">
              <template slot-scope="scope">
                <div class="item-handle">
                  <span @click="paramsManage(scope.row)" class="subitem"
                    >入参管理</span
                  >
                  <!-- <span @click="deleteRow(scope.row)" class="subitem">删除</span> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="apiCode"
              label="接口编码"
              width="220"
            ></el-table-column>
            <el-table-column
              prop="apiDescribe"
              label="接口描述"
            ></el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <!-- 数据展示与处理 -->
      <el-collapse-item name="2">
        <template slot="title">
          <div class="collapse-title">
            <div class="title-icon"></div>
            <div>数据展示与处理</div>
          </div>
        </template>
        <div class="interface-data-handle">
          <div class="data-handle-header">
            <div>获取的字段</div>
            <div class="code-icon" @click="showDataHandleDia">&lt;/&gt;</div>
          </div>
          <div class="source-data-panel" ref="sourceData"></div>
        </div>
      </el-collapse-item>
      <!-- 数据填充 -->
      <el-collapse-item name="3">
        <template slot="title">
          <div class="collapse-title">
            <div class="title-icon"></div>
            <div>数据填充</div>
          </div>
        </template>
        <div>
          <!-- 折线图or柱状图 -->
          <div v-if="!isError && [1, 5].includes(chartType)">
            <div class="data-cofig-item">
              <div class="item-title">维度/横坐标</div>
              <el-select
                v-model="xData"
                value-key="id"
                placeholder="请选择"
                @change="xDataChange"
              >
                <el-option
                  v-for="item in hData"
                  :label="item.label"
                  :value="item.value"
                  :key="item.id"
                ></el-option>
              </el-select>
            </div>
            <div v-for="(i, idx) in yData" :key="idx" class="data-cofig-item">
              <div class="item-title">度量/纵坐标</div>
              <el-select
                v-model="i.id"
                placeholder="请选择"
                @change="yDataChange"
              >
                <el-option
                  v-for="item in hData"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
              <i
                class="el-icon-circle-plus-outline handle-icon"
                @click="addYdata(idx)"
              ></i>
              <i
                v-if="yData.length > 1"
                class="el-icon-delete handle-icon"
                @click="delYdata(idx)"
              ></i>
            </div>
          </div>
          <!-- 纯文字 -->
          <div v-else-if="!isError && chartType === 3">
            <div
              class="text-item"
              v-for="(item, index) in textData"
              :key="index"
            >
              <div class="item-title">{{ item.label }}</div>
              <el-radio-group v-model="item.type" @change="textRadiochange">
                <el-row>
                  <el-radio :label="1">
                    <span style="margin-right: 37.8px">静态</span>
                    <el-input
                      :disabled="item.type !== 1"
                      v-model="item.value1"
                      type="text"
                      style="width: 240px"
                    />
                  </el-radio>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-radio :label="2">
                    <span style="margin-right: 10px">取自接口</span>
                    <el-select
                      :disabled="item.type !== 2"
                      v-model="item.value2"
                      value-key="id"
                      placeholder="请选择"
                      style="width: 240px"
                    >
                      <el-option
                        v-for="item in hData"
                        :label="item.label"
                        :value="item.label"
                        :key="item.id"
                      ></el-option>
                    </el-select>
                  </el-radio>
                </el-row>
              </el-radio-group>
            </div>
          </div>
          <div v-if="timerData">
            <div class="data-cofig-item">
              <div class="item-title">数据自动刷新</div>
              <el-switch
                v-model="timerData.isOpen"
                @change="timerChange"
              ></el-switch>
            </div>
            <!-- 数据刷新时间策略 -->
            <div class="data-cofig-item">
              <div class="item-title">刷新方式</div>
              <div class="refresh-panel">
                <div style="width: 180px; margin-right: 10px">
                  <el-select
                    :disabled="!timerData.isOpen"
                    v-model="timerData.type"
                    @change="timertypeChange"
                  >
                    <el-option
                      :label="'自定义时间间隔（秒）'"
                      :value="1"
                    ></el-option>
                    <el-option
                      :label="'每日固定时间（24时制）'"
                      :value="2"
                    ></el-option>
                  </el-select>
                </div>
                <div v-if="timerData.type === 1" style="width: 180px">
                  <el-input
                    :disabled="!timerData.isOpen"
                    v-model="timerData.value"
                    @change="timerChange"
                  />
                </div>
                <div v-else>
                  <el-time-select
                    v-model="timerData.value"
                    @change="timerChange"
                    :picker-options="{
                      start: '00:00',
                      step: '01:00',
                      end: '23:00',
                    }"
                    placeholder="选择时间"
                    :disabled="!timerData.isOpen"
                  >
                  </el-time-select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <DataHandleDia
      :show.sync="isShowDia"
      :sData="sourceData"
      :handledCode="handledCode"
      @dataTransmission="receiveData"
    />
    <ApiDialog
      :show.sync="showApiDia"
      :listData.sync="listData"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      :parsmsList="parsmsList"
      :flag="flag"
      :detailList="detailList"
      :classId="classId"
      @updateSourceData="updateSourceData"
      :dataParams.sync="dataParams"
      :requestCode.sync="requestCode"
      :currentID.sync="currentID"
      @updateRequestCode="updateRequestCode"
      :pages.sync="pages"
      :interfaceList="interfaceList"
      :detailreallyLists.sync="detailreallyList"
    />
  </div>
</template>
<script>
import { mount } from 'object-visualizer'
import transformer from '@/utils/transformer'
import * as _biApi from '@/service/biTools'
import _ from '@/utils'
import _bi from '@/utils/biUtils'
import { EventBus } from '../../../../../event-bus'
export default {
  name: '',
  components: {
    DataHandleDia: () =>
      import(
        /* webpackChunkName: "targetEditorDataHandleDia" */ './DataHandleDia'
      ),
    ApiDialog: () =>
      import(
        /* webpackChunkName: "targetEditorApiDialog" */ './ApiDialog/index.vue'
      ),
  },
  props: {
    interfaceList: {
      type: Array,
      default() {
        return [
          {
            apiCode: '',
            apiDescribe: '',
            id: '',
          },
        ]
      },
    },
    classId: {
      type: Number,
    },
    chartType: {
      type: Number,
    },
    sourceData: {
      type: Array | Object,
      default() {
        return []
      },
    },
    hData: {
      type: Array | Object,
      default() {
        return []
      },
    },
    eOption: {
      type: Object,
    },
    handledCode: {
      type: String,
    },
    timer: {
      type: Object,
    },
    textMap: {
      type: Array | Object,
    },
    requestCode: {
      type: String,
      default: '',
    },
    dataParams: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      activeNames: ['1', '2', '3'],
      xData: null,
      yData: [],
      textData: [
        {
          label: '维度',
          value1: '',
          value2: '',
          type: 1,
        },
        {
          label: '度量',
          value1: '',
          value2: '',
          type: 1,
        },
      ],
      isShowDia: false,
      isAutoRefresh: false,
      refreshType: '0',
      timeVal: '',
      showApiDia: false,
      showParamsDia: false,
      timerData: {
        isOpen: false,
        type: 1,
        value: '3600',
      },
      flag: '',
      parsmsList: [],
      listData: [],
      detailList: [],
      isError: false,
      loading: false,
      isXY: 'x',
      returnParams: {},
      currentID: 0,
      requestCodes: this.requestCode,
      pages: 1,
      detailreallyList:[]
    }
  },
  watch: {
    eOption: {
      handler: function (currentData) {
        if (this.chartType === 1 || this.chartType === 5) {
          this.isXY === 'y'
            ? (this.xData = currentData.yAxis.data)
            : (this.xData = currentData.xAxis.data)
          this.yData = []
          currentData.series.forEach((i) => {
            let idx = this.hData.findIndex((h) => {
              return h.value === i.data
            })
            this.yData.push({
              id: idx,
              smooth: i.smooth,
              opacity: i.areaStyle.opacity,
              width: i.lineStyle.width,
              label: i.label,
            })
          })
        }
      },
      deep: true,
    },
    sourceData: {
      handler: function (currentData) {
        let sourceDataEl = this.$refs.sourceData
        mount(currentData, sourceDataEl, {
          rootName: 'Source Data',
          expandOnCreatedAndUpdated(path) {
            /*
              path.length为层级 0为第一级 下面逻辑为只展开对象第一级
            */
            if (path.length === 0) return true
            else return false
          },
        })
      },
      deep: true,
    },
    timer: {
      handler: function (currentData) {
        if (!currentData) return
        this.timerData = _.deepCopy(currentData, {})
      },
      deep: true,
    },
    textMap: {
      handler: function (currentData) {
        if (!currentData) return
        this.textData = _.deepCopy(currentData, [])
      },
      deep: true,
    },
    textData: {
      handler: function (currentData) {
        !_bi.textDataIsEqual(currentData, this.textMap)
          ? this.$emit('postTextData', this.textData)
          : ''
      },
      deep: true,
    },
    isXY: {
      handler: function (currentData) {
        currentData === 'y'
          ? (this.xData = this.eOption.yAxis.data)
          : (this.xData = this.eOption.xAxis.data)
      },
    },
  },
  created() {
    EventBus.$on('changeXY', (data) => {
      this.isXY = data
    })
  },
  beforeDestroy() {
    EventBus.$off('changeXY')
  },
  methods: {
    updateRequestCode(val) {
      this.requestCodes = val
      this.$emit('updateRequestCode', this.requestCodes)
    },
    paramsManage(row) {
      this.loading = true
      this.flag = 'management'
      let params = {
        id: '',
        selectSon: '',
      }
      console.log(row)
      if (!row.id) return _.showMessage('warning', '请选择接口')
      params.id = row.id
      this.currentID = row.id
      this.parsmsList = []
      _biApi
        .getSelectConfigDetail(params)
        .then((res) => {
          this.loading = false

          if (Object.keys(res.parameters).length !== 0) {
            let obj = res.parameters
            Object.keys(obj).forEach((key) => {
              let item = {
                key: key,
                remark: obj[key],
                value: this.dataParams[key],
              }
              this.parsmsList.push(item)
            })
          }

          this.requestCodes = row.apiCode
          this.activeVersion = row.apiVersion
        })
        .catch(() => {})
      this.showApiDia = true
    },
    showDataHandleDia() {
      this.isShowDia = true
    },
    // 接口替换
    createEvent() {
      this.showApiDia = true
       this.currentID = this.interfaceList[0].id,
      this.flag = 'create'
      let params = {
        status: '1',
        apiCode: '',
        apiVersion: '',
        apiNotes: '',
        pageSize: 30,
      }
      _biApi
        .getSelectConfigList(params)
        .then((res) => {
          this.listData = res.list
          this.pages = res.pages
          this.detailList = []
        })
        .catch(() => {})
      _biApi
        .getSelectConfigDetail({
          id: this.interfaceList[0].id,
          selectSon: '',
        })
        .then((res) => {
          console.log('接口管理')
          this.detailreallyList=[]
          if (Object.keys(res.parameters).length !== 0) {
            let obj = res.parameters
            Object.keys(obj).forEach((key) => {
              let item = {
                key: key,
                remark: obj[key],
                value: this.dataParams[key],
              }
              this.detailreallyList.push(item)
            })
          }
        })
        .catch(() => {})
    },
    receiveData(handledData, code) {
      this.$emit('getHandledData', handledData, code)
    },
    xDataChange(e) {
      let idx = this.hData.findIndex((i) => {
        return i.value === e
      })
      this.chartType === 5 && this.isXY === 'y'
        ? this.$emit(
            'updateOptionStr',
            transformer.yAxis(
              idx,
              this.eOption.yAxis.axisLabel.rotate,
              this.chartType
            ),
            'yAxis'
          )
        : this.$emit(
            'updateOptionStr',
            transformer.xAxis(
              idx,
              this.eOption.xAxis.axisLabel.rotate,
              this.chartType
            ),
            'xAxis'
          )
    },
    yDataChange() {
      this.$emit(
        'updateOptionStr',
        transformer.legendDataChange(this.yData, this.eOption.legend),
        'legend'
      )
      this.$emit(
        'updateOptionStr',
        transformer.series(this.yData, this.hData, this.chartType).optStr,
        'series'
      )
    },
    timerChange() {
      this.$emit('update:timer', this.timerData)
    },
    timertypeChange(e) {
      e === 1
        ? (this.timerData.value = '3600')
        : (this.timerData.value = '00:00')
      this.$emit('update:timer', this.timerData)
    },
    /* 文字数据填充 */
    // 模式
    textRadiochange() {
      this.textData.forEach((i) => {
        i[`value${i.type === 2 ? i.type - 1 : i.type + 1}`] = ''
      })
      this.$emit('postTextData', this.textData)
    },
    addYdata(idx) {
      let obj = _.deepCopy(this.yData[0], {})
      obj.id = ''
      this.yData.splice(idx + 1, 0, obj)
    },
    delYdata(idx) {
      this.yData.splice(idx, 1)
      this.yDataChange()
    },
    updateSourceData() {
      this.$emit('updateSourceData')
    },
    setErrorTrue() {
      this.isError = true
    },
    setErrorFalse() {
      this.isError = false
    },
  },
}
</script>
<style lang="scss" scoped>
.collapse-title {
  width: 100%;
  display: flex;
  align-items: center;
  .title-icon {
    box-sizing: border-box;
    width: 4px;
    height: 17px;
    background: #0075ff;
    margin-top: 2px;
    margin-right: 10px;
  }
}
.interface-config-panel {
  padding: 10px 14px;
  .item-handle {
    display: flex;
    justify-content: center;
    color: #0075ff;
    .subitem {
      padding: 4px;
    }
    .subitem:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
}
.interface-data-handle {
  padding: 10px;
  padding-right: 0;
  .data-handle-header {
    display: flex;
    justify-content: space-between;
    color: #3b5370;
    padding-right: 5px;
    .code-icon:hover {
      color: #409eff;
      cursor: pointer;
    }
  }
  .source-data-panel {
    height: 240px;
  }
}
.text-item {
  display: flex;
  margin-top: 10px;
  .item-title {
    color: #3b5370;
    width: 100px;
    display: flex;
    justify-content: flex-end;
    margin: 3.5px 0;
    margin-right: 14px;
  }
}
.data-cofig-item {
  display: flex;
  align-items: center;
  .item-title {
    color: #3b5370;
    width: 100px;
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
    margin-right: 14px;
  }
  .refresh-panel {
    display: flex;
  }
  .handle-icon {
    color: #0075ff;
    font-size: 18px;
    margin-left: 8px;
    cursor: pointer;
  }
}

::v-deep .el-collapse-item__content {
  border: 1px solid #e6e6e6;
  border-top: 0;
}

::v-deep .object-visualizer {
  background-color: #fff !important;
}
</style>
