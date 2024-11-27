<!-- 大屏展示部分 -->
<template>
  <div class="screenContent" :style="{'pointerEvents':!enable ?'none':''}">
    <div class="scroll" ref="scroll" :style="{'overflow':!enable ?'hidden':'auto',bottom:!enable ?'0px':'30px'}">
      <div class="contentArea" ref="contentArea" id="contentArea">
        <div class="screenBg" :style="setBgColor()" ref="screenBg" id="screen" @click="openSide">
          <vue-draggable-resizable
            v-if="usedTargetData.length!=0"
            v-for="(item,index) in usedTargetData"
            :key="index"
            :id="index"
            :x="item.positionData.x"
            :y="item.positionData.y"
            :w="item.positionData.width"
            :h="item.positionData.height"
            :parent="true"
            :debug="false"
            :min-width="item.positionData.minWidth"
            :min-height="item.positionData.minHeight"
            :isConflictCheck="false"
            :snap="true"
            :snapTolerance="1"
            :targetData="item"
            :active.sync="item.active"
            @refLineParams="getRefLineParams($event)"
            :class="{'targetItem':item.targetType==1||item.targetType==3,'targetText':item.targetType==2}"
            @dragstop="onDragstop"
            @resizestop="onResizstop"
            @activated="active(item,index)"
            @deactivated="deactivated"
            :ref="'target_'+index"
          >
            <template>
              <div class="refreshNew" @click="refreshTarget(item,index)" v-if="item.targetType!=2">
                <img src="~@/assets/images/bi/refresh.png" alt />
              </div>
              <div @click="removeTarget(item)" class="remove">
                <img src="~@/assets/images/bi/remove.png" alt />
              </div>
              <div
                v-if="item.targetType==2"
                class="text"
                :style="{fontSize:item.textsize+'px',fontWeight:item.textweight,color:item.textcolor,lineHeight:item.positionData.height+'px'}"
              >{{item.name}}</div>
              <div v-if="item.targetType==1">
                <echarts
                  :ref="'echartsContent_' +index"
                  :width.sync="item.positionData.width"
                  :height.sync="item.positionData.height"
                  :id="'target_'+index"
                  :targetData.sync="item"
                  @refreshTarget="refreshTarget(item,index)"
                ></echarts>
              </div>
              <div v-if="item.targetType==3">
                <TextComponent
                  :styleObj="item.baseData.configJson.textStyle"
                  :handledData="gethandleData(item)"
                  :TextItem="item"
                  :id="'text_'+index"
                  :textMap="item.baseData.configJson.textMap"
                  :width="item.positionData.width+'px'"
                  :height="item.positionData.height+'px'"
                  @refreshTarget="refreshTarget(item,index)"
                ></TextComponent>
              </div>
            </template>
          </vue-draggable-resizable>
          <!--辅助线-->
          <span class="ref-line v-line" v-for="item in vLine" :key="item.id" v-show="item.display" :style="{ left: item.position, top: item.origin, height: item.lineLength}" />
          <span class="ref-line h-line" v-for="item in hLine" :key="item.id" v-show="item.display" :style="{ top: item.position, left: item.origin, width: item.lineLength}" />
          <!--辅助线END-->
        </div>
      </div>
    </div>
    <div class="zoom" v-if="enable">
      <div class="zoomRight" style="float: right;">
        <img src="~@/assets/images/bi/ratio.png" alt class="ratio" @click="auto()" />
        <span class="changeZoom" @click="changeZoom(0)">
          <img src="~@/assets/images/bi/reduce.png" alt />
        </span>
        <el-slider v-model="size" width="180px" :min="50" :max="200" :format-tooltip="formatTooltip"></el-slider>
        <span class="changeZoom" @click="changeZoom(1)">
          <img src="~@/assets/images/bi/add.png" alt />
        </span>
        <span class="zoomValue">{{size}}%</span>
      </div>
    </div>
  </div>
</template>
<script>
import '../components/vue-draggable-resizable/utils/vue-draggable-resizable.css';
import VueDraggableResizable from '../components/vue-draggable-resizable/utils/vue-draggable-resizable.vue';
import * as _api from '@/service/biTools';
import html2canvas from 'html2canvas';
import TextComponent from '@/components/TextComponent.vue';
import _bi from '@/utils/biUtils';
// import VueDraggableResizable from 'vue-draggable-resizable-gorkys';
// import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css';
export default {
  name: 'screenContent',
  components: {
    VueDraggableResizable,
    html2canvas,
    TextComponent,
    echarts: () => import('./insertEcharts.vue'),
  },
  props: {
    changeBG: {
      type: Boolean,
      default: false,
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
    parentW: {
      type: Number,
      default: null,
    },
    parentH: {
      type: Number,
      default: null,
    },
    enable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      vLine: [],
      hLine: [],
      size: 100,
      screenBgX: null, //背景宽
      screenBgY: null, //背景高
    };
  },
  watch: {
    changeBG(newVal, oldVal) {
      if (newVal) {
        this.setBgColor();
        this.calculateScope();
      }
    },
    parentW(newVal, oldVal) {
      if (newVal) {
        this.calculateScope();
      }
    },
    parentH(newVal, oldVal) {
      if (newVal) {
        this.calculateScope();
      }
    },
    size() {
      this.zoomIn(this.size / 100);
    },
    screenData(newVal) {
      if (newVal) {
        this.setBgColor();
        this.calculateScope();
      }
    },
    usedTargetData(newVal) {
      if (newVal) {
        this.setBgColor();
      }
    },
  },
  created() {
    this.$nextTick(function () {
      this.calculateScope();
    });
  },
  methods: {
    // 辅助线回调事件
    getRefLineParams(params) {
      const { vLine, hLine } = params;
      let id = 0;
      this.vLine = vLine.map((item) => {
        item['id'] = ++id;
        item['id'] = item['id'] + '*';
        return item;
      });
      this.hLine = hLine.map((item) => {
        item['id'] = ++id;
        item['id'] = item['id'] + '-';
        return item;
      });
    },
    //拖拽事件
    onDragstop(x, y, item) {
      // console.log(x, y, item);
      this.usedTargetData[item.positionData.key].positionData.x = x;
      this.usedTargetData[item.positionData.key].positionData.y = y;
      this.$emit('updateTargetData', this.usedTargetData);
    },
    //缩放事件
    onResizstop(x, y, width, height, item) {
      // console.log(x, y, width, height, item);
      this.usedTargetData[item.positionData.key].positionData.x = x;
      this.usedTargetData[item.positionData.key].positionData.y = y;
      this.usedTargetData[item.positionData.key].positionData.width = width;
      this.usedTargetData[item.positionData.key].positionData.height = height;
      // console.log(this.usedTargetData);
      this.$emit('updateTargetData', this.usedTargetData);
    },
    //选中指标
    active(val, index) {
      // e.stopPropagation();
      this.usedTargetData.forEach((i) => {
        i.active = false;
      });
      this.usedTargetData[index].active = true;
      this.$emit('openSide', { value: true, data: val }, index);
    },
    //当前指标失焦
    deactivated() {
      // console.log('deactivated');
      this.$emit('openSide', { value: true, attributeType: '1' });
    },
    //大屏区域样式设置
    setBgColor() {
      // console.log(this.screenData);
      return {
        backgroundImage: 'url(' + this.screenData.backgroundUrl + ')',
        // background: 'no-repeat center center',
        backgroundSize: 'contain',
        // border: this.screenData.border ? '1px solid #0075ff' : none,
        position: this.screenData.position,
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
      };
    },
    //移除指标
    removeTarget(item) {
      this.$confirm('将会删除当前指标，请确认是否操作', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
      })
        .then(() => {
          let index = this.usedTargetData.findIndex((i) => i == item);
          this.usedTargetData.splice(index, 1);
          this.$emit('openSide', { value: true, attributeType: '1' });
        })
        .catch(() => {});
    },
    //根据容器大小计算大屏实际尺寸
    calculateScope(status) {
      this.$refs.contentArea.style.paddingTop = '0px';
      this.$refs.contentArea.style.paddingLeft = '0px';
      let oldX = this.$refs.screenBg.offsetWidth;
      let oldY = this.$refs.screenBg.offsetHeight;
      var parentX = this.parentW ? this.parentW : this.$refs.contentArea.clientWidth;
      var parentY = this.parentH ? this.parentH : this.$refs.contentArea.clientHeight;
      // console.log('容器尺寸！', parentX, parentY);
      if (this.screenData.bgrateX / this.screenData.bgrateY < parentX / parentY) {
        this.screenBgY = parentY;
        this.screenBgX = Math.round((parentY / this.screenData.bgrateY) * this.screenData.bgrateX);
      } else if (this.screenData.bgrateX / this.screenData.bgrateY > parentX / parentY) {
        this.screenBgX = parentX;
        this.screenBgY = Math.round((parentX / this.screenData.bgrateX) * this.screenData.bgrateY);
      } else {
        this.screenBgX = parentX;
        this.screenBgY = this.screenBgY = parentY;
      }
      // console.log('大屏尺寸！', this.screenBgX, this.screenBgY);
      this.$refs.contentArea.style.paddingTop = parentY > this.screenBgY ? (parentY - this.screenBgY) / 2 + 'px' : '0px';
      this.$refs.contentArea.style.paddingLeft = parentX > this.screenBgX ? (parentX - this.screenBgX) / 2 + 'px' : '0px';
      this.$refs.screenBg.style.width = this.screenBgX + 'px';
      this.$refs.screenBg.style.height = this.screenBgY + 'px';
      this.screenData.width = this.screenData.width ? this.screenData.width : this.screenBgX;
      this.screenData.height = this.screenData.height ? this.screenData.height : this.screenBgY;
      this.$emit('calculate', this.screenBgX, this.screenBgY);
      if (status) {
        this.$emit('backgroundChange', false, this.screenBgX, this.screenBgY, this.screenData.width, this.screenData.height);
      } else {
        this.$emit('backgroundChange', false, this.screenBgX, this.screenBgY, oldX, oldY);
      }
      //指标可移动范围重新计算
      this.usedTargetData.forEach((i, index) => {
        this.$refs['target_' + index][0].checkParentSize();
      });
    },
    formatTooltip(val) {
      return val + '%';
    },
    //大屏缩放事件
    changeZoom(add) {
      if (add) {
        this.size = this.size + 10;
      } else {
        this.size = this.size - 10;
      }
    },
    zoomIn(size) {
      this.$refs.screenBg.style.zoom = size;
      // this.$refs.screenBg.style.transform = 'scale(' + size + ')';
      this.calculateScope();
    },
    //一键适配当前显示器
    auto() {
      // this.$refs.screenBg.style.zoom = 1;
      this.size = 100;
      this.$refs.screenBg.style.transform = 'scale(1)';
      this.calculateScope();
    },
    //屏幕快照
    doCut() {
      let screenShot = '';
      screenShot = html2canvas(this.$refs.screenBg, {
        useCORS: true,
        // width: window.screen.availWidth,
        // height: window.screen.availHeight,
        // windowWidth: document.body.scrollWidth,
        // windowHeight: document.body.scrollHeight,
        x: 0,
        y: window.pageYOffset,
      }).then(function (canvas) {
        // console.log(canvas.toDataURL('image/png'));
        let database = canvas.toDataURL('image/png');
        // var dataUrl = canvas.toDataURL('image/png', 1.0); //图片转为下载路径
        // var a = document.createElement('a'); //创建a标签
        // a.href = dataUrl;
        // a.download = 'screenShot.png'; //设置图片名称
        // a.click();
        return database;
      });
      return screenShot;
    },
    //选中大屏
    openSide() {
      if (this.usedTargetData == []) {
        this.$emit('openSide', { value: true, attributeType: '1' });
      }
    },
    //指标刷新
    refreshTarget(item, index) {
      // console.log(item);
      _api
        .getStatisticsDetail({
          id: item.baseData.statisticsId ? item.baseData.statisticsId : item.baseData.id,
        })
        .then((res) => {
          this.usedTargetData[index].baseData.apiParameterVos = res.apiParameterVos;
          this.usedTargetData[index].baseData.apiCode = res.apiCode;
          if (item.baseData.typeId != 3) {
            this.refreshEcharts(index);
          }else{
            this.gethandleData(this.usedTargetData[index])
          }
        });
    },
    //重新渲染图表
    refreshEcharts(index) {
      this.$refs['echartsContent_' + index][0].refresh(index, true);
    },
    //文字指标数据获取
    setTextData() {
      let conJ = this.currentTargetData.baseData.configJson;
      this.textStyleObj = conJ.textStyle;
    },
    //数据源转换
    gethandleData(item) {
      let obj = _bi.dynamic(item.baseData.apiParameterVos[0].result.rsp.data, item.baseData.apiCode);
      if (obj.status) {
        return obj.data;
      } else {
        _.showMessage('error', `handledCode dynamic代码执行失败，请检查SourceData以及handleCode。`);
      }
    },
  },
  mounted() {},
};
</script>
<style lang='scss' scoped>
.screenContent {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .scroll {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    background: #2a2c33;
    .contentArea {
      // position: absolute;
      width: 100%;
      height: 100%;
      // bottom: 32px;
      background: #2a2c33;
      .screenBg {
        .targetItem {
          // background: linear-gradient(180deg, rgba(51, 157, 255, 0.4) 0%, rgba(51, 157, 255, 0) 100%);
          .remove,
          .refreshNew {
            display: none;
          }
        }
        .targetText {
          .remove,
          .refreshNew {
            display: none;
          }
          .text {
            word-break: break-all;
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
        }
        .vdractive {
          .remove {
            cursor: pointer;
            display: inherit;
            position: absolute;
            top: -8px;
            right: -8px;
            z-index: 1000;
          }
          .refreshNew {
            cursor: pointer;
            display: inherit;
            position: absolute;
            top: -8px;
            left: -8px;
            z-index: 1000;
          }
          .refreshNew,
          .remove {
            img {
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
  }

  .zoom {
    overflow: hidden;
    height: 32px;
    width: 100%;
    background: #1e2024;
    position: absolute;
    bottom: 0px;
    .zoomRight {
      float: right;
      img {
        vertical-align: top;
        cursor: pointer;
        width: 16px;
        height: 16px;
        margin: 6px 0;
      }
      .ratio {
        margin-right: 20px;
      }
      .changeZoom {
        cursor: pointer;
        display: inline-block;
      }
      .el-slider {
        width: 180px;
        display: inline-block;
        margin: 0 10px;
        .el-slider__runway {
        }
      }
      .zoomValue {
        color: #fff;
        font-size: 12px;
        margin: 6px 0 0 20px;
      }
    }
  }
}
</style>
<style lang='scss'>
.screenContent {
  .scroll {
    .contentArea {
      .screenBg {
        .targetText {
          .text {
          }
        }
      }
    }
  }
  .zoom {
    .el-slider {
      .el-slider__runway {
        background-color: #000;
        margin: 0;
        .el-slider__bar {
          background: rgba(255, 255, 255, 0.8);
        }
        .el-slider__button-wrapper {
          // width: 32px;
          // height: 32px;
          .el-slider__button {
            background: #ffffff;
            border: 1.1px solid #ffffff;
            width: 14px;
            height: 14px;
            &:hover {
              transform: scale(1);
            }
          }
        }
      }
    }
  }
}
</style>
