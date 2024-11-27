<!-- 基础配置 -->
<template>
  <el-collapse v-if="true" v-model="activeNames">
    <el-collapse-item v-if="true" name="1">
      <template slot="title">
        <div class="collapse-title">
          <div class="title-icon"></div>
          <div>基础设置</div>
        </div>
      </template>
      <div>
        <div class="data-cofig-item" style="padding-bottom: 10px">
          <div class="item-title">指标说明</div>
          <div class="item-config">
            <el-input
              v-model="targetRemark"
              maxlength="50"
              placeholder="请输入指标说明"
              :disabled="!enable"
            />
          </div>
        </div>
      </div>
    </el-collapse-item>
    <el-collapse-item v-if="true" name="2">
      <template slot="title">
        <div class="collapse-title">
          <div class="title-icon"></div>
          <div>标题设置</div>
        </div>
      </template>
      <div>
        <div class="data-cofig-item">
          <div class="item-title">标题</div>
          <div class="item-config">
            <el-input v-model="title.text" maxlength="255" placeholder="请输入标题" />
          </div>
        </div>
        <div class="data-cofig-item">
          <div class="item-title">标题字号</div>
          <div class="item-config">
            <div class="item-config-child">
              <el-select
                v-model="title.textStyle.fontSize"
                placeholder="请选择"
                style="width: 180px"
              >
                <el-option
                  v-for="item in configOpt.fontSizeRemOption"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="item-config-child">
              <el-select
                v-model="title.textStyle.fontWeight"
                placeholder="请选择"
                style="width: 180px"
              >
                <el-option
                  v-for="item in configOpt.fontWeightOption"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="item-config-child">
              <el-input v-model="title.textStyle.color" style="width: 180px">
                <el-color-picker
                  v-model="title.textStyle.color"
                  show-alpha
                  slot="prefix"
                  size="mini"
                ></el-color-picker>
              </el-input>
            </div>
          </div>
        </div>
        <div class="data-cofig-item">
          <div class="item-title">标题X轴位置</div>
          <div class="item-config">
            <div class="item-config-child">
              <el-radio-group v-model="titleX" size="small" @change="titleXChange">
                <el-radio-button label="left">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{ color: titleX === 'left' ? '#fff' : '#666' }"
                  >
                    <use xlink:href="#icon-format-vertical-align-left"></use>
                  </svg>
                </el-radio-button>
                <el-radio-button label="center">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{ color: titleX === 'center' ? '#fff' : '#666' }"
                  >
                    <use xlink:href="#icon-format-vertical-align-center"></use>
                  </svg>
                </el-radio-button>
                <el-radio-button label="right">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{ color: titleX === 'right' ? '#fff' : '#666' }"
                  >
                    <use xlink:href="#icon-format-vertical-align-right"></use>
                  </svg>
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="item-config-child">
              <el-input v-model="titleLeft" style="width: 180px" @input="titleLeftChange" />
            </div>
          </div>
        </div>
        <div class="data-cofig-item" style="padding-bottom: 10px">
          <div class="item-title">标题Y轴位置</div>
          <div class="item-config">
            <div class="item-config-child">
              <el-radio-group v-model="titleY" size="small" @change="titleYChange">
                <el-radio-button label="top">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{
                      color: titleY === 'top' ? '#fff' : '#666'
                    }"
                  >
                    <use xlink:href="#icon-format-horizontal-align-top"></use>
                  </svg>
                </el-radio-button>
                <el-radio-button label="center">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{
                      color: titleY === 'center' ? '#fff' : '#666'
                    }"
                  >
                    <use xlink:href="#icon-format-horizontal-align-center"></use>
                  </svg>
                </el-radio-button>
                <el-radio-button label="bottom">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{
                      color: titleY === 'bottom' ? '#fff' : '#666'
                    }"
                  >
                    <use xlink:href="#icon-format-horizontal-align-bottom"></use>
                  </svg>
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="item-config-child">
              <el-input v-model="titleTop" style="width: 180px" @input="titleTopChange" />
            </div>
          </div>
        </div>
      </div>
    </el-collapse-item>
    <el-collapse-item v-if="![4].includes(chartType)" name="3">
      <template slot="title">
        <div class="collapse-title">
          <div class="title-icon"></div>
          <div>图例设置</div>
        </div>
      </template>
      <div>
        <div class="data-cofig-item">
          <div class="item-title">是否显示图例</div>
          <div class="item-config">
            <div class="item-config-child">
              <el-switch v-model="legend.show" />
            </div>
          </div>
        </div>
        <div class="data-cofig-item">
          <div class="item-title">图例X轴位置</div>
          <div class="item-config">
            <div class="item-config-child">
              <el-radio-group
                size="small"
                v-model="legendX"
                :disabled="!legend.show"
                @change="legendXChange"
              >
                <el-radio-button label="left">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{ color: legendX === 'left' ? '#fff' : '#666' }"
                  >
                    <use xlink:href="#icon-format-vertical-align-left"></use>
                  </svg>
                </el-radio-button>
                <el-radio-button label="center">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{ color: legendX === 'center' ? '#fff' : '#666' }"
                  >
                    <use xlink:href="#icon-format-vertical-align-center"></use>
                  </svg>
                </el-radio-button>
                <el-radio-button label="right">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{ color: legendX === 'right' ? '#fff' : '#666' }"
                  >
                    <use xlink:href="#icon-format-vertical-align-right"></use>
                  </svg>
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="item-config-child">
              <el-input
                style="width: 180px"
                v-model="legendLeft"
                @input="legendLeftChange"
                :disabled="!legend.show"
              />
            </div>
          </div>
        </div>
        <div class="data-cofig-item">
          <div class="item-title">图例Y轴位置</div>
          <div class="item-config">
            <div class="item-config-child">
              <el-radio-group
                v-model="legendY"
                size="small"
                @change="legendYChange"
                :disabled="!legend.show"
              >
                <el-radio-button label="top">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{
                      color: legendY === 'top' ? '#fff' : '#666'
                    }"
                  >
                    <use xlink:href="#icon-format-horizontal-align-top"></use>
                  </svg>
                </el-radio-button>
                <el-radio-button label="center">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{
                      color: legendY === 'center' ? '#fff' : '#666'
                    }"
                  >
                    <use xlink:href="#icon-format-horizontal-align-center"></use>
                  </svg>
                </el-radio-button>
                <el-radio-button label="bottom">
                  <svg
                    class="local-icon"
                    aria-hidden="true"
                    :style="{
                      color: legendY === 'bottom' ? '#fff' : '#666'
                    }"
                  >
                    <use xlink:href="#icon-format-horizontal-align-bottom"></use>
                  </svg>
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="item-config-child">
              <el-input v-model="legendTop" style="width: 180px" @input="legendTopChange" :disabled="!legend.show" />
            </div>
          </div>
        </div>
        <div
          class="data-cofig-item"
          :style="[2, 6].includes(chartType) ? `padding-bottom: 10px` : ''"
        >
          <div class="item-title">图例布局朝向</div>
          <div class="item-config">
            <div class="item-config-child" style="padding-top: 4px">
              <el-radio-group size="mini" v-model="legend.orient" :disabled="!legend.show">
                <el-radio :label="'horizontal'">横向</el-radio>
                <el-radio :label="'vertical'">纵向</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div v-if="![2, 6].includes(chartType)">
          <div class="data-cofig-item">
            <div class="item-title">是否显示数值</div>
            <div class="item-config">
              <div class="item-config-child">
                <el-switch v-model="seriesLabel.show" />
              </div>
            </div>
          </div>
          <div class="data-cofig-item" style="padding-bottom: 10px">
            <div class="item-title">数值字号</div>
            <div class="item-config">
              <div class="item-config-child">
                <el-select
                  placeholder="请选择"
                  style="width: 180px"
                  :disabled="!seriesLabel.show"
                  v-model="seriesLabel.fontSize"
                >
                  <el-option
                    v-for="item in configOpt.fontSizeRemOption"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="item-config-child">
                <el-select
                  placeholder="请选择"
                  style="width: 180px"
                  :disabled="!seriesLabel.show"
                  v-model="seriesLabel.fontWeight"
                >
                  <el-option
                    v-for="item in configOpt.fontWeightOption"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="item-config-child">
                <el-input
                  v-model="seriesLabel.color"
                  :disabled="!seriesLabel.show"
                  style="width: 180px"
                >
                  <el-color-picker
                    :disabled="!seriesLabel.show"
                    v-model="seriesLabel.color"
                    show-alpha
                    slot="prefix"
                    size="mini"
                  ></el-color-picker>
                </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-collapse-item>
    <el-collapse-item v-if="![2, 4, 6].includes(chartType)" name="4">
      <template slot="title">
        <div class="collapse-title">
          <div class="title-icon"></div>
          <div>间距设置</div>
        </div>
      </template>
      <div>
        <div class="data-cofig-item">
          <div class="item-title">左间距</div>
          <div class="item-config">
            <div class="item-config-child">
              <el-radio-group v-model="grid.left" size="mini">
                <el-radio-button label="0%"></el-radio-button>
                <el-radio-button label="5%"></el-radio-button>
                <el-radio-button label="10%"></el-radio-button>
                <el-radio-button label="15%"></el-radio-button>
                <el-radio-button label="20%"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="item-config-child">
              <el-input v-model="grid.left" placeholder="支持输入百分比" style="width: 180px" />
            </div>
          </div>
        </div>
        <div class="data-cofig-item">
          <div class="item-title">右间距</div>
          <div class="item-config">
            <div class="item-config-child">
              <el-radio-group v-model="grid.right" size="mini">
                <el-radio-button label="0%"></el-radio-button>
                <el-radio-button label="5%"></el-radio-button>
                <el-radio-button label="10%"></el-radio-button>
                <el-radio-button label="15%"></el-radio-button>
                <el-radio-button label="20%"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="item-config-child">
              <el-input v-model="grid.right" placeholder="支持输入百分比" style="width: 180px" />
            </div>
          </div>
        </div>
        <div class="data-cofig-item">
          <div class="item-title">上间距</div>
          <div class="item-config">
            <div class="item-config-child">
              <el-radio-group v-model="grid.top" size="mini">
                <el-radio-button label="0%"></el-radio-button>
                <el-radio-button label="5%"></el-radio-button>
                <el-radio-button label="10%"></el-radio-button>
                <el-radio-button label="15%"></el-radio-button>
                <el-radio-button label="20%"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="item-config-child">
              <el-input v-model="grid.top" placeholder="支持输入百分比" style="width: 180px" />
            </div>
          </div>
        </div>
        <div class="data-cofig-item" style="padding-bottom: 10px">
          <div class="item-title">下间距</div>
          <div class="item-config">
            <div class="item-config-child">
              <el-radio-group v-model="grid.bottom" size="mini">
                <el-radio-button label="0%"></el-radio-button>
                <el-radio-button label="5%"></el-radio-button>
                <el-radio-button label="10%"></el-radio-button>
                <el-radio-button label="15%"></el-radio-button>
                <el-radio-button label="20%"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="item-config-child">
              <el-input v-model="grid.bottom" placeholder="支持输入百分比" style="width: 180px" />
            </div>
          </div>
        </div>
      </div>
    </el-collapse-item>
    <el-collapse-item v-if="![4].includes(chartType)" name="5">
      <template slot="title">
        <div class="collapse-title">
          <div class="title-icon"></div>
          <div>颜色设置</div>
        </div>
      </template>
      <div>
        <div class="data-cofig-item">
          <div class="item-title">图例主颜色</div>
          <div class="item-config">
            <div
              class="item-config-child"
              :style="
                warp ? `height: ${Math.ceil(configOpt.colorOption.length / 2) * 23 + 10}px` : ''
              "
            >
              <div v-for="m in configOpt.colorOption" :key="m.id" class="themeColor">
                <el-radio v-model="color" :label="m.value" @change="chooseThemeColor">
                  <span
                    v-for="(n, index) in m.value.split(',')"
                    :key="index"
                    :style="{ backgroundColor: n }"
                    class="block"
                  ></span>
                </el-radio>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-collapse-item>
    <el-collapse-item v-if="true" name="6">
      <template slot="title">
        <div class="collapse-title">
          <div class="title-icon"></div>
          <div>背景设置</div>
        </div>
      </template>
      <div>
        <div class="data-cofig-item" style="padding-bottom: 10px">
          <div class="item-title">背景色</div>
          <div class="item-config-child">
            <el-input v-model="backgroundColor" style="width: 180px">
              <el-color-picker
                v-model="backgroundColor"
                show-alpha
                slot="prefix"
                size="mini"
              ></el-color-picker>
            </el-input>
          </div>
        </div>
      </div>
    </el-collapse-item>
    <!-- 大屏编辑专属插槽 -->
    <el-collapse-item v-if="!warp" name="8">
      <template slot="title">
        <div class="collapse-title">
          <div class="title-icon"></div>
          <div>尺寸及位置设置</div>
        </div>
      </template>
      <slot name="locationSetting"></slot>
    </el-collapse-item>
    <el-collapse-item v-if="true" name="7">
      <template slot="title">
        <div class="collapse-title">
          <div class="title-icon"></div>
          <div>其他设置</div>
        </div>
      </template>
      <component :is="currentTabComponent" :otherSetting="otherSetting" @changeOS="changeOS" />
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import { EventBus } from '@/event-bus'
import transformer from '@/utils/transformer'
import '@/assets/iconfont/local-icon.js'
import _ from '@/utils'
import _bi from '@/utils/biUtils'
import configOpt from '@/utils/BIUIConfiguration'
import { OSLine, OSPie, OSGauge, OSBar, OSRadar } from './otherSettingComponents'
export default {
  name: '',
  components: {
    OSLine,
    OSPie,
    OSGauge,
    OSBar,
    OSRadar
  },
  props: {
    warp: {
      type: Boolean,
      default: false
    },
    eOption: {
      type: Object
    },
    remark: {
      type: String
    },
    chartType: {
      type: Number
    },
    hData: {
      type: Array | Object,
      default() {
        return []
      }
    },
    enable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      configOpt,
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8'],
      radio: '',
      color: '', // 颜色设置
      targetRemark: this.remark, // 指标说明
      title: {
        text: '', // 标题文字
        textStyle: {
          fontWeight: '',
          fontSize: 0,
          color: ''
        },
        left: '0%',
        x: '',
        top: '0%'
      },
      titleLeft: '0%',
      titleTop: '0%',
      titleX: '',
      titleY: '',

      grid: {
        left: '',
        right: '',
        top: '',
        bottom: ''
      },
      legend: {
        show: false,
        left: '',
        top: '',
        orient: 'horizontal'
      },
      legendLeft: '0%',
      legendTop: '0%',
      legendX: '',
      legendY: '',

      seriesLabel: {
        show: false,
        color: '#FFFFFF',
        fontSize: 0,
        fontWeight: 'normal'
      },
      backgroundColor: '',
      otherSetting: null,
      lineOS: null,
      gaugeOS: null,
      PieOS: null,
      RadarOS: null,
      gaugeOSData: null,
      rotate: '0',
      isXYFan: '' //柱状图其他设置中特有的
    }
  },
  computed: {
    currentTabComponent() {
      return configOpt.otherSettingType[this.chartType - 1]
    }
  },
  watch: {
    eOption: {
      handler: function (newV) {
        this.dataInit(newV)
      }
    },
    remark(newV) {
      this.targetRemark = newV
    },
    targetRemark(newV) {
      this.$emit('update:remark', newV)
    },
    grid: {
      handler: function (newV, oldV) {
        if (newV !== oldV) return
        Object.keys(newV).forEach(v => {
          newV[v] = this.strFilter(newV[v])
        })
        this.$emit('updateOptionStr', transformer.grid(newV), 'grid')
      },
      deep: true
    },
    title: {
      handler: function (newV, oldV) {
        if (!newV.x && !newV.left) return (newV.left = '0%')
        if (!newV.y && !newV.top) return (newV.top = '0%')
        let result = false
        if (
          ((newV.x && newV.x === oldV.x) || (newV.left && newV.left === oldV.left)) &&
          ((newV.y && newV.y === oldV.y) || (newV.top && newV.top === oldV.top))
        )
          result = true
        if (newV !== oldV && result) return
        this.$emit('updateOptionStr', transformer.title(newV), 'title')
      },
      deep: true
    },
    /* 图例 */
    legend: {
      handler: function (newV, oldV) {
        if (!newV.x && !newV.left) return (newV.left = '0%')
        if (!newV.y && !newV.top) return (newV.top = '0%')
        let result = false
        if (
          ((newV.x && newV.x === oldV.x) || (newV.left && newV.left === oldV.left)) &&
          ((newV.y && newV.y === oldV.y) || (newV.top && newV.top === oldV.top))
        )
          result = true
        if (newV !== oldV && result) return
        this.$emit(
          'updateOptionStr',
          transformer.legend(newV, this.hData, this.chartType),
          'legend'
        )
      },
      deep: true
    },
    // 是否显示数值
    seriesLabel: {
      handler: function (newV, oldV) {
        if (newV !== oldV) return
        // transformer.seriesLabel(newV, this.eOption.series, this.hData)
        this.$emit(
          'updateOptionStr',
          transformer.seriesLabel(newV, this.eOption.series, this.hData, this.chartType),
          'series'
        )
      },
      deep: true
    },
    backgroundColor(newV) {
      this.$emit('updateOptionStr', transformer.backgroundColor(newV), 'backgroundColor')
    },

    lineOS: {
      handler: function (newV, oldV) {
        if (newV !== oldV) return
        this.$emit(
          'updateOptionStr',
          transformer.lineOS(newV, this.eOption.series, this.hData),
          'series'
        )
      },
      deep: true
    },
    // 旋转角度
    rotate(newV) {
      let idx = -1
      if (this.chartType === 5 && this.isXYFan === 'y') {
        idx = this.hData.findIndex(i => {
          return i.value === this.eOption.yAxis.data
        })
        this.$emit('updateOptionStr', transformer.yAxis(idx, newV), 'yAxis')
      } else {
        idx = this.hData.findIndex(i => {
          return i.value === this.eOption.xAxis.data
        })
        this.$emit('updateOptionStr', transformer.xAxis(idx, newV, this.chartType), 'xAxis')
      }
    },

    isXYFan(newV, oldV) {
      if (this.chartType !== 5 || !oldV) return
      if (this.warp) EventBus.$emit('changeXY', newV)
      let rotate = this.eOption[`${oldV}Axis`].axisLabel.rotate
      let currentData = this.eOption[`${oldV}Axis`].data
      let idx = this.hData.findIndex(i => {
        return i.value === currentData
      })

      idx > -1
        ? this.$emit('updateOptionStr', transformer.changeXY(newV, idx, rotate), 'xyChange')
        : _.showMessage('error', 'XY轴数据转换异常')
    },
    PieOS: {
      handler: function (newV, oldV) {
        if (newV !== oldV) return
        this.$emit(
          'updateOptionStr',
          transformer.PieOS(newV, this.eOption.series, this.hData),
          'series'
        )
      },
      deep: true
    },
    gaugeOS: {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) return
        this.$emit(
          'updateOptionStr',
          transformer.axisTick(newVal, this.eOption.series, this.hData),
          'axisTick'
        )
      },
      deep: true
    },
    gaugeOSData: {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) return
        this.$emit(
          'updateOptionStr',
          transformer.gaugeOSData(newVal, this.eOption.series, this.hData),
          'gaugeOSData'
        )
      },
      deep: true
    },
    RadarOS: {
      handler: function (newV, oldV) {
        if (newV !== oldV) return
        this.$emit(
          'updateOptionStr',
          transformer.RadarOS(newV, this.eOption.series, this.hData),
          'series'
        )
      },
      deep: true
    }
  },
  methods: {
    dataInit(option) {
      if (!option) return
      this.legendLeft = '0%'
      this.legendTop = '0%'
      this.legendX = ''
      this.legendY = ''
      this.titleLeft = '0%'
      this.titleTop = '0%'
      this.titleX = ''
      this.titleY = ''

      this.title = _.deepCopy(option.title, {}) // 标题设置
      this.grid = _.deepCopy(option.grid, {}) // 间距设置
      this.backgroundColor = option.backgroundColor // 背景颜色
      // 标题间距
      option.title.left ? (this.titleLeft = option.title.left) : (this.titleX = option.title.x)
      option.title.top ? (this.titleTop = option.title.top) : (this.titleY = option.title.y)

      this.legend = _.deepCopy(option.legend, {}) // 图例设置
      if (this.chartType !== 4) {
        // *仪表盘不存在图例
        // 图例间距
        option.legend.left
          ? (this.legendLeft = option.legend.left)
          : (this.legendX = option.legend.x)
        option.legend.top ? (this.legendTop = option.legend.top) : (this.legendY = option.legend.y)
      }

      // 图例颜色
      let str = option.color.reduce((pre, cur) => {
        return (pre += `${cur},`)
      }, '')
      this.color = str.substr(0, str.length - 1)
      /* 1 折线图 */
      if ([1, 5].includes(this.chartType)) {
        this.seriesLabel = _.deepCopy(option.series[0].label, {}) // seriesLabel设置
        // 其他设置
        let item = option.series[0]
        // 解决数据异步更新延迟问题
        if (!item.areaStyle) return
        var obj = {
          series: {
            smooth: item.smooth,
            opacity: item.areaStyle.opacity !== '0',
            width: item.lineStyle.width
          },
          rotate: '0'
        }
        if (this.chartType === 5 && option.xAxis) {
          option.xAxis.axisLabel
            ? (obj.rotate = option.xAxis.axisLabel.rotate)
            : (obj.rotate = option.yAxis.axisLabel.rotate)
          obj.isXYFan = option.xAxis.data ? 'x' : 'y'
          this.isXYFan = obj.isXYFan
          EventBus.$emit('changeXY', obj.isXYFan)
        } else {
          obj.rotate = option.xAxis.axisLabel.rotate
        }
      } else if (this.chartType === 2) {
        let item = option.series[0]
        var obj = {
          series: {
            radius: item.radius ? item.radius : ['0%', '70%'],
            roseType: item.roseType === 'radius'
          }
        }
      } else if (this.chartType === 6) {
        let item = option.series[0]
        var obj = {
          series: {
            width: item.lineStyle.width
          }
        }
      } else if (this.chartType === 4) {
        let item = option.series[0]
        item.data.forEach((obj, index) => {
          if (!obj.detail) {
            obj.detail = {
              show: false
            }
          }
        })
        var obj = {
          series: {
            axisTick: {
              show: item.axisTick.show === false
            },
            data: [
              {
                value: item.data[0].value,
                detail: {
                  show: item.data[0].detail.show === false
                }
              }
            ]
          }
        }
      }
      this.$nextTick(() => {
        this.otherSetting = obj
      })
    },
    /**************************/
    titleXChange(v) {
      this.titleLeft = '0%'
      let obj = _.deepCopy(this.title, {})
      if (obj.left) {
        delete obj.left
      }
      obj.x = v
      this.title = obj
    },
    titleLeftChange(v) {
      this.titleX = ''
      this.titleLeft = this.strFilter(v)
      let obj = _.deepCopy(this.title, {})
      if (obj.x) {
        delete obj.x
      }
      obj.left = this.titleLeft
      this.title = obj
    },
    titleYChange(v) {
      this.titleTop = '0%'
      let obj = _.deepCopy(this.title, {})
      if (obj.top) {
        delete obj.top
      }
      obj.y = v
      this.title = obj
    },
    titleTopChange(v) {
      this.titleY = ''
      this.titleTop = this.strFilter(v)
      let obj = _.deepCopy(this.title, {})
      if (obj.y) {
        delete obj.y
      }
      obj.top = this.titleTop
      this.title = obj
    },
    legendXChange(v) {
      this.legendLeft = '0%'
      let obj = _.deepCopy(this.legend, {})
      if (obj.left) {
        delete obj.left
      }
      obj.x = v
      this.legend = obj
    },
    legendLeftChange(v) {
      this.legendX = ''
      this.legendLeft = this.strFilter(v)
      let obj = _.deepCopy(this.legend, {})
      if (obj.x) {
        delete obj.x
      }
      obj.left = this.legendLeft
      this.legend = obj
    },
    legendYChange(v) {
      this.legendTop = '0%'
      let obj = _.deepCopy(this.legend, {})
      if (obj.top) {
        delete obj.top
      }
      obj.y = v
      this.legend = obj
    },
    legendTopChange(v) {
      this.legendY = ''
      this.legendTop = this.strFilter(v)
      let obj = _.deepCopy(this.legend, {})
      if (obj.y) {
        delete obj.y
      }
      obj.top = this.legendTop
      this.legend = obj
    },

    /**************************/
    chooseThemeColor(val) {
      this.$emit('updateOptionStr', transformer.color(val), 'color')
      this.color = val
    },
    strFilter(str) {
      let result = _bi.matchNumString(str)
      return result ? `${result}%` : '0%'
    },
    /* 其他设置变化 */
    changeOS(set, type) {
      switch (type) {
        case 'lineOS':
          this.lineOS = set
          break
        case 'rotate':
          this.rotate = set
          break
        case 'isXYFan':
          this.isXYFan = set
          break
        case 'PieOS':
          this.PieOS = set
          break
        case 'RadarOS':
          this.RadarOS = set
          break
        case 'gaugeOS':
          this.gaugeOS = set
          break
        case 'gaugeOSData':
          this.gaugeOSData = set
          break
        default:
          break
      }
    }
  },
  created() {
    this.dataInit(this.eOption)
  }
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
.data-cofig-item {
  display: flex;
  align-items: flex-start;
  padding: 0 10px;
  padding-top: 10px;
  .item-title {
    color: #3b5370;
    min-width: 100px;
    width: 100px;
    display: flex;
    justify-content: flex-end;
    margin-right: 14px;
  }
  .item-config {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    .item-config-child {
      padding-right: 10px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      .themeColor {
        width: 240px;
        .block {
          margin-right: 4px;
          width: 16px;
          height: 16px;
          display: inline-block;
          border-radius: 2px;
          vertical-align: sub;
        }
      }
    }
  }
}
::v-deep .el-color-picker__trigger {
  border: none;
  padding: 6px;
}
::v-deep .el-radio-button--small .el-radio-button__inner {
  padding: 4px 21.2px;
}
::v-deep .el-radio-button--mini .el-radio-button__inner {
  padding: 7px 17.1px;
}
.local-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
  overflow: hidden;
}
</style>
