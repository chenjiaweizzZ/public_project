<!-- 指标编辑 -->
<template>
  <div
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    class="targets-editor-container"
  >
    <!-- 标题 -->
    <head class="targets-title">
      <BlueIconTitle :text="title" />
    </head>
    <!-- 编辑主体 -->
    <main class="targets-editor-panel">
      <!-- 左 -->
      <section class="left-part">
        <section class="handle-section">
          <div>
            <el-button type="primary" size="mini" plain @click="saveConfig"> 保 存 </el-button>
            <el-button type="primary" size="mini" plain @click="showHelperDialog">
              帮 助
            </el-button>
            <el-button type="primary" size="mini" plain @click="back"> 返 回 </el-button>
          </div>
        </section>
        <!-- 图标渲染 -->
        <section v-show="!isShowError" class="chart-section">
          <div v-show="chartType !== 3" id="myCharts" style="height: 600px; width: 600px"></div>
          <TextComponent
            v-show="chartType === 3"
            ref="textComponent"
            :styleObj="textStyleObj"
            :handledData="handledData"
            :textMap="textMap"
            width="445px"
            height="147px"
          ></TextComponent>
        </section>
        <section v-show="isShowError" class="error-block">
          <div class="block-body">
            <div><img src="~@/assets/images/bi/renderFaild.svg" width="320px" alt="" /></div>
            <div class="body-span">渲染失败</div>
          </div>
        </section>
      </section>
      <!-- 右 -->
      <section class="right-part">
        <el-tabs v-model="activePanel" type="border-card" @tab-click="refreshCode">
          <el-tab-pane label="数据维护" name="dataConfigure">
            <div class="data-panel">
              <DataConfigure
                ref="dConf"
                @getHandledData="setHdata"
                @updateOptionStr="updateBasicOptionStr"
                @postTextData="receiveTextData"
                @updateSourceData="updateSourceData"
                :interfaceList.sync="apiData"
                :chartType="chartType"
                :sourceData="sourceData"
                :handledCode="handledCode"
                :hData="handledData"
                :timer.sync="timer"
                :eOption="eOption"
                :textMap="textMap"
                :classId="classId"
                :dataParams.sync="dataParams"
                :requestCode.sync="requestCode"
                @updateRequestCode="updateRequestCode"
                style="padding-bottom: 0.1px"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane :disabled="isShowError" label="基础配置" name="basicsConfigure">
            <div class="data-panel">
              <TextBasicsConfigure
                v-if="chartType === 3"
                @changeTargetRemark="changeTargetRemark"
                :targetRemark="targetRemark"
                :styleObj="textStyleObj"
                @changeTextStyleObj="changeTextStyleObj"
                style="padding-bottom: 0.1px"
              />
              <BasicsConfigure
                v-else
                :warp="true"
                :eOption="eOption"
                :remark.sync="targetRemark"
                :hData="handledData"
                :chartType="chartType"
                @updateOptionStr="updateBasicOptionStr"
                style="padding-bottom: 0.1px"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane :disabled="chartType === 3" label="高 级" name="advancedConfig">
            <div class="data-panel">
              <Editor
                ref="editor"
                @getChartData="renderChart"
                @setOptionFailed="setOptionFailed"
                :chartType="chartType"
                :optionCode="optionCode"
                :handledData="handledData"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>
    <Helper
      :helperDialogVisible="helperDialogVisible"
      :list="list"
      @helperDialogCloseEvent="helperDialogCloseEvent"
      @searchClick="searchClick"
      @closeEvent="closeEvent"
    ></Helper>
    <el-dialog :visible.sync="isShowBackDia" width="360px">
      <template #title>
        <BlueIconTitle :text="'返回'" />
      </template>
      <span>修改未保存，返回将不会保存修改，确认返回吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowBackDia = false" size="mini">取 消</el-button>
        <el-button @click="backDirect" size="mini">直接返回</el-button>
        <el-button type="primary" @click="doSave('back')" size="mini">保存并返回</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="isShowSaveDia" width="360px">
      <template #title>
        <BlueIconTitle :text="'保存'" />
      </template>
      <span
        >本指标应用于{{ warningMsg }}，修改指标将同步应用于以上大屏。
        <br />
        如需单独对某个大屏的指标进行修改，请复制本指标进行修改。确认保存修改吗？
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowSaveDia = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="doSave()" size="mini">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import DataConfigure from './components/DataConfigure/index.vue'
import BasicsConfigure from '@/components/BasicsConfigure/index.vue'
import TextComponent from '@/components/TextComponent.vue'
import TextBasicsConfigure from '@/components/TextBasicsConfigure/index.vue'
import BlueIconTitle from '@/components/BlueIconTitle.vue'
import Editor from './components/Editor/index.vue'
import Helper from './components/Helper.vue'
import * as echarts from 'echarts'
import _bi from '@/utils/biUtils'
import _ from '@/utils'
import * as _biApi from '@/service/biTools'
import { mapState, mapMutations } from 'vuex'
import { EventBus } from '@/event-bus'
export default {
  name: 'biTargetsEditor',
  components: {
    DataConfigure,
    Editor,
    Helper,
    BlueIconTitle,
    BasicsConfigure,
    TextBasicsConfigure,
    TextComponent
  },
  data() {
    return {
      title: '标题',
      activePanel: 'dataConfigure',
      loading: true,
      handledData: null,
      apiData: [],
      sourceData: [],
      chartType: 'LineChart',
      eOption: null,
      handledCode: '',
      optionCode: '',
      colorArr: [],
      targetRemark: '',
      chartType: 0,
      timer: {
        isOpen: false,
        type: 1,
        value: '3600'
      },
      classId: 1,
      // 文字指标相关
      textMap: null,
      helperDialogVisible: false, // 帮助
      optionCode: '',
      list: [],
      textStyleObj: {
        weiduFontSize: '',
        weiduFontWeight: '',
        weiduColor: '',
        duliangFontSize: '',
        duliangFontWeight: '',
        duliangColor: '',
        duliangDanwei: '',
        isShowMaohao: true,
        leftSpace: '',
        rightSpace: '',
        topSpace: '',
        bottomSpace: '',
        alignment: '2',
        backgroundColor: '',
        backgroundRadius: ''
      },
      textStyle: {},
      // 帮助
      helperDialogVisible: false, // 帮助
      optionCode: '',
      list: [],
      // 异常图显示Boo
      isShowError: false,
      isShowBackDia: false,
      isShowSaveDia: false,
      warningMsg: '',
      sourceRes: null,
      dataParams: {},
      requestCode: ''
    }
  },
  computed: {
    ...mapState('menu', {
      labelArr: state => state.labelArr
    })
  },
  watch: {
    '$route.query.id': {
      handler: function () {
        if (this.$route.name !== 'biTargetsEditor') return
        this.loading = true
        this.activePanel = 'dataConfigure'
        document.getElementsByTagName('html')[0].style['font-size'] = 16 + 'px'
        this.tagetDataInit()
      },
      deep: true
    },
    isShowError(currentData) {
      currentData ? this.$refs.dConf.setErrorTrue() : this.$refs.dConf.setErrorFalse()
    }
  },
  mounted() {
    /* init echarts DOM */
    let chartDom = document.getElementById('myCharts')
    document.getElementsByTagName('html')[0].style['font-size'] = 16 + 'px'
    this.myChart = echarts.init(chartDom, 'dark', { renderer: 'svg' })
    this.$route.query.id
      ? this.tagetDataInit()
      : _.showMessage('error', 'error：接口请求失败，指标id为空。')
  },
  created() {
    console.log('EventBus', EventBus)
    EventBus.$on('goOtherLabel', path => {
      this.$nextTick(() => {
        console.log('check Result', this.checkChange())
        if (this.checkChange()) {
          this.$router.push(path)
        } else {
          this.$confirm('检测到您有未保存的配置项，是否进行保存，直接跳转数据将会丢失！', '提示', {
            confirmButtonText: '保存并跳转',
            cancelButtonText: '直接跳转',
            type: 'warning',
            distinguishCancelAndClose: true,
            closeOnClickModal: false
          })
            .then(() => {
              this.doSave('goOtherLabel', path)
            })
            .catch(action => {
              action === 'cancel' ? this.$router.push(path) : ''
            })
        }
      })
    })
    this.searchClick()
  },
  beforeDestroy() {
    console.log('do beforeDestroy $off goOtherLabel')
    EventBus.$off('goOtherLabel')
  },
  methods: {
    updateRequestCode(val) {
      this.requestCode = val
    },
    ...mapMutations('menu', ['removeLabel']),
    /* 数据初始化 */
    tagetDataInit() {
      _biApi
        .getStatisticsDetail({
          id: this.$route.query.id
        })
        .then(res => {
          this.sourceRes = res
          this.dataParams = res.apiParameterVos[0].apiParameterDto.requestBody.parameters
          this.requestCode = res.apiParameterVos[0].apiParameterDto.requestBody.apiCode
          this.classId = res.classId
          /** 图标类型
           *  1 折线图
           *  2 饼状图
           *  3 纯文字
           *  4 仪表盘
           *  5 柱状图
           *  6 雷达图
           **/
          this.chartType = res.typeId
          // 数据源处理代码
          this.handledCode = res.apiCode
          if (_.isNEArray(res.apiParameterVos)) {
            let apiD = res.apiParameterVos[0]
            // 接口相关数据
            if (!apiD.result.rsp) return _.showMessage('error', '接口数据获取异常，rsp为空')
            this.sourceData = apiD.result.rsp.data
            apiD.apiParameterDto.type === 1
              ? (this.apiData = [
                  {
                    apiCode: apiD.apiParameterDto.requestBody.apiCode,
                    apiDescribe: apiD.apiParameterDto.remark,
                    id: apiD.apiParameterDto.id
                  }
                ])
              : (this.apiData = [{}])
          }
          // 指标说明
          this.targetRemark = res.remark

          this.title = res.name

          this.$nextTick(() => {
            if (res.configJson) {
              let conJ = res.configJson
              // 数据刷新策略
              this.timer = _.deepCopy(conJ.timer, {})
              if (this.chartType !== 3) {
                // echarts option代码
                this.optionCode = conJ.code
                if (this.$refs.editor) {
                  this.$refs.editor.setValue()
                }
              } else {
                // 纯文字
                this.textMap = conJ.textMap
                this.textStyleObj = conJ.textStyle
              }
            }
            let obj = _bi.dynamic(this.sourceData, this.handledCode)
            if (obj.status) {
              this.handledData = obj.data
            } else {
              console.error('targetEditor Data init error', obj.msg)
              _.showMessage(
                'error',
                `handledCode dynamic代码执行失败，请检查SourceData以及handleCode。`
              )
              this.isShowError = true
            }
            this.loading = false
          })
        })
    },
    /* 接收文字类型指标说明改变 */
    changeTargetRemark(val) {
      this.targetRemark = val
    },
    /* 接收文字类型指标说明改变 */
    changeTextStyleObj(val) {
      this.textStyleObj = _.deepCopy(val, {})
    },
    /* 接收文字数据源改变 */
    receiveTextData(data) {
      this.textMap = data
    },
    /* 更新基础配置 */
    updateBasicOptionStr(val, type) {
      this.$refs.editor.updatedOptionsStr(val, type)
    },
    /* 渲染图标 */
    renderChart(option) {
      if (this.isShowError) this.isShowError = false
      this.$nextTick(() => {
        // console.log('renderChart', option)
        option && this.myChart.setOption(option, true)
        this.eOption = option
      })
    },
    setHdata(data, code) {
      this.handledData = data
      this.handledCode = code
    },
    /* 刷新高级代码区 */
    refreshCode(e) {
      if (e.name && e.name === 'advancedConfig') this.$refs.editor.refreshCode()
    },
    /* 保存数据 */
    saveConfig() {
      if (this.$route.query.screenList) {
        this.warningMsg = ''
        let list = JSON.parse(this.$route.query.screenList)
        if (_.isNEArray(list)) {
          this.isShowSaveDia = true
          let str = ''
          list.forEach(i => {
            str += `${i.name}（${i.status === 1 ? '已发布' : '待发布'}）、`
          })
          return (this.warningMsg = str.substr(0, str.length - 1))
        }
      }
      this.$confirm('保存请确认代码运行结果与指标最终样式符合预期。', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.doSave()
        })
        .catch(() => {})
    },
    doSave(model = 'normal', path = '/bi/targets-list') {
      let obj = {}
      let picInfo = ''
      if (this.chartType !== 3) {
        picInfo = this.myChart.getDataURL()
        let optionCode = this.$refs.editor.getOptionCode()
        obj.code = optionCode
        obj.timer = this.timer
        obj.boxStyle = {
          width: 600,
          height: 600
        }
        let configStr = JSON.stringify(obj)
        this.updateStatisticsEvent(configStr, picInfo, model, path)
      } else {
        obj.textMap = this.textMap
        obj.textStyle = this.textStyleObj
        obj.timer = this.timer
        this.$refs.textComponent.divCut().then(result => {
          picInfo = result
          let configStr = JSON.stringify(obj)
          this.updateStatisticsEvent(configStr, picInfo, model, path)
        })
      }
    },
    updateStatisticsEvent(configStr, picInfo, model, path) {
      _biApi
        .updateStatistics({
          apiCode: this.handledCode,
          configCode: configStr,
          id: this.$route.query.id,
          classId: this.classId,
          typeId: this.chartType,
          remark: this.targetRemark,
          thumbnail: picInfo
        })
        .then(res => {
          if (res === 1) _.showMessage('success', '保存成功')
          if (model === 'back') {
            this.closeTopTab()
            this.$router.push(path)
            this.isShowBackDia = false
          } else if (model === 'goOtherLabel') {
            this.$router.push(path)
          } else {
            this.isShowSaveDia = false
            this.tagetDataInit()
          }
        })
    },
    /* 返回 */
    back() {
      if (this.checkChange()) {
        this.closeTopTab()
        return this.$router.push('/bi/targets-list')
      } else {
        this.isShowBackDia = true
      }
    },
    checkChange() {
      if (this.chartType !== 3) {
        let sR = this.sourceRes
        let optionCode = this.$refs.editor.getOptionCode()
        let result = Object.keys(this.timer).some(i => {
          return this.timer[i] !== sR.configJson.timer[i]
        })
        return optionCode === sR.configJson.code && this.handledCode === sR.apiCode && !result
      } else {
        // 文字校验TODO
        let result = Object.keys(this.timer).some(i => {
          return this.timer[i] !== this.sourceRes.configJson.timer[i]
        })
        if (
          this.sourceRes.configJson.textStyle === this.textStyleObj &&
          JSON.stringify(this.sourceRes.configJson.textMap) === JSON.stringify(this.textMap) &&
          this.handledCode === this.sourceRes.apiCode &&
          !result
        )
          return true
        else return false
      }
    },
    backDirect() {
      this.isShowBackDia = false
      this.closeTopTab()
      this.$router.push('/bi/targets-list')
    },
    closeTopTab() {
      this.removeLabel(
        this.labelArr.findIndex(i => {
          return i.fullPath === this.$route.fullPath
        })
      )
    },
    updateSourceData() {
      this.loading = true
      this.tagetDataInit()
    },
    setOptionFailed() {
      this.isShowError = true
    },
    showHelperDialog() {
      this.helperDialogVisible = true
    },
    searchClick(val) {
      let params = {
        name: ''
      }
      params.name = val
      _biApi.getStatisticsHelp(params).then(res => {
        this.list = res
      })
    },
    closeEvent() {
      this.helperDialogVisible = false
    },
    helperDialogCloseEvent() {
      this.helperDialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
$container-h: calc(100vh - 50px);
.targets-editor-container {
  margin: 10px;
  width: calc(100vw - 20px);
  min-width: 1260px;
  overflow-x: auto;
  height: $container-h;
  background: #fff;
  .targets-title {
    display: flex;
    height: 46px;
    padding: 10px;
  }
  .targets-editor-panel {
    display: flex;
    .left-part {
      width: 40%;
      min-width: 650px;
      height: calc($container-h - 56px);
      margin: 0 10px;
      display: flex;
      flex-direction: column;
      .handle-section {
        display: flex;
        justify-content: space-between;
        height: 34px;
        .type-select {
          width: 114px;
        }
      }
      .chart-section {
        flex: 1;
        border: 1px solid #e6e6e6;
        background: #fbfbfb;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .error-block {
        flex: 1;
        display: flex;
        justify-content: center;
        .block-body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .body-span {
            font-size: 18px;
            color: #3b5370;
          }
        }
      }
    }
    .right-part {
      flex: 1;
      height: calc($container-h - 50px);
      margin-right: 10px;
      .data-panel {
        max-height: calc($container-h - 100px);
      }
    }
  }
}
::v-deep .el-button--primary.is-plain {
  background: #fff;
  border: 1px solid #0075ff;
}
::v-deep .el-button--primary.is-plain:hover {
  background-color: #0075ff;
}

::v-deep .el-tabs--border-card {
  border: 0;
  box-shadow: none;
  & .el-tabs__nav-wrap {
    height: 34px;
    display: flex;
    align-items: flex-end;
    padding-left: 10px;
    background: #e4f1ff;
    & .el-tabs__item {
      height: 28px;
      line-height: 28px;
      margin-left: 4px;
      background: #abd2ff;
      font-weight: 600;
      color: #3f5384;
      border: 0;
      border-radius: 2px;
      padding: 0 16px;
    }
    & .is-active {
      background: #fff;
      border: 0;
    }
    & .is-disabled {
      background: #e6e6e6;
      color: #909399;
    }
  }

  & .el-tabs__content {
    border: 1px solid #e6e6e6;
    height: calc(100vh - 100px - 40px);
    padding: 10px 0 0 10px;
    overflow-y: auto;
  }
}
::v-deep .el-button--primary.is-plain:focus {
  color: #0075ff;
}
::v-deep .el-button--primary.is-plain:hover {
  color: #fff;
}

/* 折叠板 */
::v-deep .el-collapse-item__header {
  height: 30px !important;
}
::v-deep .el-icon-arrow-right:before {
  background: linear-gradient(180deg, rgba(185, 226, 255, 0.25) 0%, rgba(32, 157, 248, 0.25) 100%);
  border: 0.5px solid #3284e6;
  box-sizing: border-box;
  border-radius: 2px;
  content: '\e6df' !important;
}
::v-deep .el-collapse-item__arrow {
  margin: 0 6px 0 auto !important;
  color: #0075ff;
  font-size: 16px;
}
::v-deep .el-collapse-item__arrow.is-active {
  transform: rotate(180deg) !important;
}
::v-deep .el-collapse-item__content {
  border: 1px solid #e6e6e6;
  border-top: 0;
}
::v-deep .el-table {
  color: #111;
  &.el-table thead {
    color: #666;
  }
}
</style>
