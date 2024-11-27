<!-- 配置 -->
<template>
  <div class="deployAttribute" :class="{ fold: foldAttribute }">
    <div class="side" @click="foldAttributeSide">
      <img v-if="foldAttribute" src="~@/assets/images/bi/fold.png" width="16" height="16" alt />
      <img v-else src="~@/assets/images/bi/fold_close.png" width="16" height="16" alt />
      属性配置
    </div>
    <div v-if="!foldAttribute" class="attributeSide">
      <!-- 大屏基础属性设置 -->
      <div v-if="attributeType == '1'">
        <el-collapse v-model="screenActive">
          <el-collapse-item name="1">
            <template slot="title">
              <i class="shortline"></i>
              基础设置
            </template>
            <div class="content">
              <label>大屏名称</label>
              <div class="detail">
                <el-input v-model="screenData.name" placeholder="请输入大屏名称" maxlength="30"></el-input>
              </div>
            </div>
            <div class="content">
              <label>大屏说明</label>
              <div class="detail">
                <el-input type="textarea" :rows="2" placeholder="请输入大屏说明" v-model="screenData.remark" maxlength="50"></el-input>
              </div>
            </div>
            <div class="content">
              <label>大屏比例</label>
              <div class="detail">{{ screenData.bgrateX + ":" + screenData.bgrateY }}</div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <i class="shortline"></i>
              全局颜色设置
            </template>
            <div class="content">
              <label>默认主题色</label>
              <div class="detail">
                <el-switch v-model="screenData.defaultTheme" class="defaultTheme"></el-switch>
              </div>
            </div>
            <div class="content">
              <label style="margin-top:10px">图例主题色</label>
              <div class="detail">
                <div v-for="(m, index) in configOpt.colorOption" :key="m.id" class="themeColor">
                  <el-radio v-model="screenData.themeColor" :label="m.value" @change="chooseThemeColor">
                    <span v-for="(n, index) in m.value.split(',')" :key="index" :style="{ backgroundColor: n }" class="block"></span>
                  </el-radio>
                </div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <i class="shortline"></i>
              背景设置
            </template>
            <div class="content" style="margin-bottom:0">
              <div class="systemBox">
                <el-col class="colBox" :span="12" v-for="(m, index) in systemBackground" :class="{ itemActive: backgroundIndex == index }" :key="index">
                  <div class="screenBox">
                    <div class="backgroundBox" @click="backgroundSelect(m, index)">
                      <div class="backgroundContent">
                        <img :src="m.backGround" />
                      </div>
                    </div>
                    <div class="backgroundDesc">
                      <div class="backgroundName">{{ m.name }}</div>
                      <div class="backgroundRatio">{{ m.ratio }}</div>
                    </div>
                  </div>
                </el-col>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- 文字设置 -->
      <div v-if="attributeType == '2'">
        <el-collapse v-model="textActive">
          <el-collapse-item name="1">
            <template slot="title">
              <i class="shortline"></i>
              文字设置
            </template>
            <div class="content">
              <label>文字内容</label>
              <div class="detail">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="usedTargetData[targetIndex].name"></el-input>
              </div>
            </div>
            <div class="content">
              <label>文字字体</label>
              <div class="detail">
                <el-select class="textsize" v-model="usedTargetData[targetIndex].textsize">
                  <el-option v-for="item in configOpt.fontSizeOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select class="textstyle" v-model="usedTargetData[targetIndex].textweight">
                  <el-option v-for="item in configOpt.fontWeightOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <div class="textcolor">
                  <!-- <el-color-picker v-model="usedTargetData[targetIndex].textcolor"></el-color-picker> -->
                  <el-color-picker v-model="usedTargetData[targetIndex].textcolor" show-alpha slot="prefix" size="mini"></el-color-picker>
                  <span class="colorcode">{{usedTargetData[targetIndex].textcolor}}</span>
                  <!-- <el-input v-model="usedTargetData[targetIndex].opacity" class="coloropacity"></el-input> -->
                </div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <i class="shortline"></i>
              尺寸及位置设置
            </template>
            <div class="content">
              <label>宽</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.width" :min="1" :max="screenData.width" :precision="0" label="请输入"></el-input-number>
              </div>
            </div>
            <div class="content">
              <label>高</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.height" :min="1" :max="screenData.height" :precision="0" label="请输入"></el-input-number>
              </div>
            </div>
            <div class="content">
              <label>X轴位置</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.x" :min="1" :max="screenData.width" :precision="0" label="请输入"></el-input-number>
              </div>
            </div>
            <div class="content">
              <label>Y轴位置</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.y" :min="1" :max="screenData.height" :precision="0" label="请输入"></el-input-number>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- 指标设置 -->
      <div v-if="attributeType == '3'" class="attributeType3">
        <!-- 文字指标 -->
        <TextBasicsConfigure
          v-if="chartType==3"
          :targetRemark="usedTargetData[targetIndex].baseData.remark"
          :styleObj="textStyleObj"
          :mode="'screen'"
          @changeTextStyleObj="changeTextStyleObj"
          class="textTarget"
        >
          <template #locationSetting>
            <div class="content">
              <label>宽</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.width" :precision="0" :min="1" :max="screenData.width" label="请输入"></el-input-number>
              </div>
            </div>
            <div class="content">
              <label>高</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.height" :precision="0" :min="1" :max="screenData.height" label="请输入"></el-input-number>
              </div>
            </div>
            <div class="content">
              <label>X轴位置</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.x" :precision="0" :min="1" :max="screenData.width" label="请输入"></el-input-number>
              </div>
            </div>
            <div class="content">
              <label>Y轴位置</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.y" :precision="0" :min="1" :max="screenData.height" label="请输入"></el-input-number>
              </div>
            </div>
          </template>
        </TextBasicsConfigure>
        <!-- 除文字以外的其他指标 -->
        <BasicsConfigure
          v-else
          :warp="false"
          :eOption="eOption"
          :remark.sync="usedTargetData[targetIndex].baseData.remark"
          :hData="handledData"
          :chartType="chartType"
          @updateOptionStr="updateBasicOptionStr"
          :enable="false"
        >
          <template #locationSetting>
            <div class="content">
              <label>宽</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.width" :precision="0" :min="1" :max="screenData.width" label="请输入"></el-input-number>
              </div>
            </div>
            <div class="content">
              <label>高</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.height" :precision="0" :min="1" :max="screenData.height" label="请输入"></el-input-number>
              </div>
            </div>
            <div class="content">
              <label>X轴位置</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.x" :precision="0" :min="1" :max="screenData.width" label="请输入"></el-input-number>
              </div>
            </div>
            <div class="content">
              <label>Y轴位置</label>
              <div class="detail">
                <el-input-number v-model="usedTargetData[targetIndex].positionData.y" :precision="0" :min="1" :max="screenData.height" label="请输入"></el-input-number>
              </div>
            </div>
          </template>
        </BasicsConfigure>
      </div>
    </div>
  </div>
</template>
<script>
import { getLargeScreenList, getDictionaryByType } from '@/service/biTools';
import transformer from '@/utils/transformer';
import BasicsConfigure from '@/components/BasicsConfigure/index.vue';
import TextBasicsConfigure from '@/components/TextBasicsConfigure/index.vue';
import _bi from '@/utils/biUtils';
import _ from '@/utils';
import configOpt from '@/utils/BIUIConfiguration';
export default {
  name: 'deployAttribute',
  components: {
    BasicsConfigure,
    TextBasicsConfigure,
  },
  props: {
    foldAttribute: {
      type: Boolean,
      default: true,
    },
    attributeType: {
      type: String,
      default: '1',
    },
    screenData: {
      type: Object,
      default: {},
      require: true,
    },
    usedTargetData: {
      type: Array,
      default: [],
    },
    currentTargetData: {
      type: Object,
      default: {},
    },
    currentTargetIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      themeColorArr: [],
      // radio: '',
      backgroundIndex: '', //当前选中的大屏背景图索引
      systemBackground: [], //大屏背景图list
      targetData: this.currentTargetData,
      targetIndex: this.currentTargetIndex,
      textActive: ['1', '2'],
      screenActive: ['1', '2', '3'],
      configOpt,
      eOption: null,
      handledData: null,
      chartType: this.currentTargetData.targetId, //指标类型
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
        backgroundRadius: '',
      },
    };
  },
  watch: {
    attributeType() {
      if (this.attributeType == '1' && this.systemBackground == []) {
        this.getScreenFormList();
        // this.getThemeColorList();
      } else if (this.attributeType == '3') {
        this.setData();
      }
    },
    currentTargetData() {
      // console.log(this.currentTargetData);
      this.targetData = this.currentTargetData;
    },
    currentTargetIndex() {
      // console.log(this.currentTargetIndex);
      this.targetIndex = this.currentTargetIndex;
      // console.log(this.usedTargetData);
    },
    'screenData.defaultTheme'() {
      if (this.screenData.defaultTheme) {
        this.screenData.themeColor = '';
        this.usedTargetData.forEach((i, index) => {
          if (i.baseData.typeId && i.baseData.typeId != 3 && i.baseData.typeId != 4) {
            let handledCode = i.baseData.apiCode;
            let sourceData = i.baseData.apiParameterVos[0].result.rsp.data;
            let result = _bi.dynamic(sourceData, handledCode);
            let optStr = JSON.parse(i.baseData.configCode).code;
            let newOptionStr = _bi.transferStation('color', optStr, transformer.color(i.color));
            let eOption = _bi.dynamic(result.data, newOptionStr);
            this.eOption = eOption.data;
            i.baseData.configJson.code = newOptionStr;
            i.baseData.configCode = JSON.stringify(i.baseData.configJson);
            this.$emit('targetChange', transformer.color(i.color), 'color', i, index, this.usedTargetData);
          }
        });
      } else {
      }
    },
    'screenData.backgroundUrl'() {
      if (this.systemBackground || this.screenData.backgroundUrl) {
        let index = this.systemBackground.findIndex((i) => i.backGround == this.screenData.backgroundUrl);
        // console.log(index);
        this.backgroundIndex = index;
      }
    },
  },
  created() {
    if (this.attributeType == '1') {
      this.getScreenFormList();
      // this.getThemeColorList();
    }
  },
  mounted() {},
  methods: {
    //属性配置展开收起
    foldAttributeSide() {
      this.$emit('foldAttributeChange', this.foldAttribute);
    },
    //大屏主题色选取事件
    chooseThemeColor(val) {
      this.screenData.themeColor = val;
      this.screenData.defaultTheme = false;
      this.$emit('themeColorChange', transformer.color(val), 'color');
    },
    //获取大屏背景图list
    getScreenFormList() {
      getLargeScreenList({
        status: 0,
        isModel: 1,
      }).then((res) => {
        this.systemBackground = res.list;
        let index = this.systemBackground.findIndex((i) => i.backGround == this.screenData.backgroundUrl);
        this.backgroundIndex = index;
      });
    },
    //获取大屏主题色list（已弃用）
    getThemeColorList() {
      getDictionaryByType({
        dictionaryType: 6,
      }).then((res) => {
        this.themeColorArr = res;
      });
    },
    //切换大屏事件
    backgroundSelect(data, index) {
      this.backgroundIndex = index;
      this.$emit('bgChange', data);
    },
    //设置指标配置相关数据
    setData() {
      this.chartType = this.currentTargetData.targetId;
      // console.log(this.currentTargetData);
      if (this.currentTargetData.targetId == 3) {
        let conJ = this.currentTargetData.baseData.configJson;
        this.textStyleObj = conJ.textStyle;
      } else {
        let handledCode = this.currentTargetData.baseData.apiCode;
        if (!this.currentTargetData.baseData.apiParameterVos[0].result.rsp) return _.showMessage('error', '该指标数据异常');
        let sourceData = this.currentTargetData.baseData.apiParameterVos[0].result.rsp.data;
        let result = _bi.dynamic(sourceData, handledCode);
        if (!result.status) return _.showMessage('error', 'handledCode执行失败');
        this.handledData = result.data;
        let eOption = _bi.dynamic(this.handledData, JSON.parse(this.currentTargetData.baseData.configCode).code);
        if (!eOption.status) return _.showMessage('error', 'eOptionCode执行失败');
        this.eOption = eOption.data;
      }
    },
    //指标配置修改事件
    updateBasicOptionStr(val, type) {
      // console.log(val, type);
      let optStr = JSON.parse(this.currentTargetData.baseData.configCode).code;
      /* 得到最新的echart option字符串 */
      let newOptionStr = _bi.transferStation(type, optStr, val);
      let eOption = _bi.dynamic(this.handledData, newOptionStr);
      this.eOption = eOption.data;
      this.usedTargetData[this.currentTargetIndex].baseData.configJson.code = newOptionStr;
      this.usedTargetData[this.currentTargetIndex].baseData.configCode = JSON.stringify(this.usedTargetData[this.currentTargetIndex].baseData.configJson);
      this.$emit('targetChange', val, type, this.currentTargetData, this.currentTargetIndex, this.usedTargetData);
    },
    /* 接收文字类型指标说明改变 */
    changeTextStyleObj(val) {
      this.textStyleObj = _.deepCopy(val, {});
      this.usedTargetData[this.currentTargetIndex].baseData.configJson.textStyle = this.textStyleObj;
      this.usedTargetData[this.currentTargetIndex].baseData.configCode = JSON.stringify(this.usedTargetData[this.currentTargetIndex].baseData.configJson);
      // console.log(this.usedTargetData[this.currentTargetIndex]);
    },
  },
};
</script>
<style lang="scss" scoped>
.deployAttribute {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #1e2024;
  transition: width 0.5s;
  -moz-transition: width 0.5s; /* Firefox 4 */
  -webkit-transition: width 0.5s; /* Safari and Chrome */
  -o-transition: width 0.5s; /* Opera */
  width: 400px;
  .attributeSide {
    width: 370px;
    // overflow: scroll;
  }
  .side {
    width: 30px;
    padding: 10px 6px;
    font-family: 'Microsoft YaHei';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    color: #ffffff;
    text-align: center;
    box-shadow: inset -1px 0px 0px rgba(255, 255, 255, 0.25);
    img {
      cursor: pointer;
      margin-bottom: 6px;
    }
  }
}
.fold {
  width: 30px;
}
</style>
<style lang="scss">
.deployAttribute {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #1e2024;
  transition: width 0.5s;
  -moz-transition: width 0.5s; /* Firefox 4 */
  -webkit-transition: width 0.5s; /* Safari and Chrome */
  -o-transition: width 0.5s; /* Opera */
  width: 400px;
  .attributeSide {
    overflow: scroll;
    overflow-x: hidden;
    width: 370px;
    height: 100%;
    display: block;
    .attributeType3 {
      .el-collapse-item {
        // .el-collapse-item__wrap {
        //   &:first-child() {
        //     padding-bottom: 10px;
        //   }
        // }
        .data-cofig-item {
          padding: 0px !important;
        }
        &:first-child {
          .el-collapse-item__wrap {
            padding-bottom: 10px;
          }
        }
        .el-radio {
          line-height: 26px;
        }
        .el-select {
          margin-right: 0px;
        }
        .el-input--prefix .el-input__inner {
          margin-left: 0px;
        }
      }
    }
    .el-collapse-item {
      margin-bottom: 0 !important;
      background: #1e2024;
      color: #ffffff;
      .el-collapse-item__header {
        background: #1e2024 !important;
        border: none !important;
        border-bottom: 0.5px solid rgba(255, 255, 255, 0.2) !important;
        color: #ffffff !important;
        // box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.2);

        .collapse-title {
          font-size: 14px;
        }
        .shortline {
          width: 4px;
          height: 16px;
          background: #0075ff;
          margin-right: 10px;
        }
        .is-active {
          transform: rotate(180deg) !important;
        }
        .el-collapse-item__arrow:before {
          content: '';
          background: url(../../../../assets/images/bi/arrow-up.png) no-repeat;
          background-size: cover;
          display: block;
          width: 8px;
          height: 8px;
        }
      }
      .el-collapse-item__content {
        color: #ffffff !important;
        padding: 0 14px;
        .data-cofig-item {
          width: 100%;
          .item-title {
            font-size: 14px;
            color: #ffffff;
          }
          .item-config {
            width: 100%;
          }
          .item-config-child {
            margin-bottom: 14px;
            padding-right: 0px;
            display: flex;
            flex-wrap: nowrap;
            width: 100%;
            .el-select {
              width: 100% !important;
            }
            .el-input {
              width: 100% !important;
            }
            .el-radio-group {
              display: flex;
              .is-disabled {
                .el-radio-button__inner:hover {
                  color: #b2b2b2;
                }
              }
              .el-radio-button {
                border: 1px solid #000000;
                flex: 1;
                display: flex;
                box-sizing: border-box;
              }
              .is-active {
                border: 1px solid #0075ff;
                color: #0075ff !important;
                .el-radio-button__inner {
                  color: #0075ff;
                }
              }
              .el-radio-button__inner {
                font-size: 14px;
                color: #b2b2b2;
                background: #000000;
                border: none;
                width: 100%;
                padding: 7px 0px;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .el-radio-button__inner:hover {
                color: #0075ff;
              }
            }
            .el-color-picker__mask {
              display: none;
            }
            .el-radio__label {
              color: #ffffff;
            }
          }
          input,
          textarea {
            background: #000000;
            border-radius: 4px;
            border: none;
            color: #fff;
          }
        }
        .content {
          display: flex;
          margin-bottom: 10px;
          label {
            width: 108px;
            text-align: right;
            margin-right: 14px;
            flex: none;
          }
          .detail {
            width: 100%;
            .el-select {
              margin-bottom: 10px;
              width: 100%;
            }
            input,
            textarea {
              background: #000000;
              border-radius: 4px;
              border: none;
              color: #fff;
            }
            .el-input-number {
              line-height: 28px;
              width: 100%;
              .el-input-number__decrease,
              .el-input-number__increase {
                width: 36px;
                height: 28px;
                background: #f5f7fa;
                color: #ffffff;
                background: #3a3d42;
                top: 0;
                border: none;
                // border-radius: 0px 4px 4px 0px;
              }
              .el-input-number__decrease {
                left: 0;
              }
              .el-input-number__increase {
                right: 0;
              }
            }
            .defaultTheme {
              .el-switch__core {
                background-color: #55585c;
                border: 1px solid #55585c;
              }
            }
            .defaultTheme.is-checked {
              .el-switch__core {
                background-color: #0075ff;
                border: 1px solid #0075ff;
              }
            }
            .themeColor {
              margin: 14px 0;
              display: inline-block;
              width: 100%;
              height: 16px;
              .el-radio {
                width: 20px;
                height: 16px;
                vertical-align: top;
                .el-radio__inner {
                  width: 16px;
                  height: 16px;
                }
                .el-radio__label {
                  padding-left: 16px;
                }
              }
              .block {
                margin-right: 4px;
                width: 16px;
                height: 16px;
                display: inline-block;
                border-radius: 2px;
                vertical-align: sub;
              }
              &:last-child {
                margin-bottom: 0px;
              }
            }
            .textcolor {
              background: #000000;
              border-radius: 4px;
              height: 28px;
              .el-color-picker {
                height: 16px;
                .el-color-picker__trigger {
                  margin: 6px 8px;
                  height: 16px;
                  width: 16px;
                  padding: 0;
                  border: none;
                  .el-color-picker__color {
                    border: none;
                    .el-color-picker__color-inner {
                      border-radius: 2px;
                    }
                  }
                }
              }
              .colorcode {
                vertical-align: top;
                line-height: 22px;
                display: inline-block;
                margin-top: 3px;
              }
              .coloropacity {
                width: 80px;
                float: right;
                color: #fff;
              }
            }
            .el-radio-group {
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              .el-radio {
                width: 74px;
                color: #ffffff;
                display: flex;
                justify-content: flex-start;
              }
            }
          }
          .systemBox {
            .colBox {
              height: 156px;
              width: 166px;
              .screenBox {
                height: 100%;
                .backgroundBox {
                  height: 120px;
                  background: #000;
                  position: relative;
                  cursor: pointer;
                  .backgroundContent {
                    position: absolute;
                    top: 20px;
                    bottom: 20px;
                    left: 8px;
                    right: 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img {
                      height: 100%;
                    }
                  }
                }
                .backgroundDesc {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  padding: 4px 0 10px 0;
                  .backgroundName {
                    color: #b2b2b2;
                    font-size: 14px;
                  }
                  .backgroundRatio {
                    background: #3a3d42;
                    color: #b2b2b2;
                    font-size: 12px;
                    width: 41px;
                    height: 20px;
                    border-radius: 10px;
                    text-align: center;
                    line-height: 20px;
                  }
                }
              }
              &:nth-child(2n + 1) {
                padding-right: 5px;
              }
              &:nth-child(2n) {
                padding-left: 5px;
              }
              &.itemActive {
                .backgroundBox {
                  height: 120px;
                  position: relative;
                  cursor: pointer;
                  border: 2px solid #0075ff;
                  border-radius: 4px;
                }
              }
              // &:nth-child(2n + 1) {
              //   margin-right: 10px;
              // }
            }
          }

          .ratio-group {
            height: 28px;
            display: flex;
            height: 28px;
            width: 100%;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 10px;
            .ratio {
              flex: 1;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #000000;
              font-size: 14px;
              color: #b2b2b2;
              cursor: pointer;
              border: 1px solid #000000;
              overflow: hidden;
              &.ratioSelect {
                flex: 1;
                border: 1px solid #0075ff;
                color: #0075ff;
              }
              &:nth-child(1) {
                border-bottom-left-radius: 4px;
                border-top-left-radius: 4px;
              }
              &:last-child {
                border-bottom-right-radius: 4px;
                border-top-right-radius: 4px;
              }
            }
          }
        }
      }
      .el-collapse-item__wrap {
        background: #1e2024;
        border-bottom: 0.5px solid rgba(255, 255, 255, 0.2) !important;
        padding-top: 10px;
      }
      &:last-child {
        .el-collapse-item__wrap {
          border-bottom: none !important;
        }
      }
    }
  }
}
</style>
