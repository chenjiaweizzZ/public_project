<!-- 大屏编辑 -->
<template>
  <div class="biScreensEditor" v-loading="isLoading" :ref="'biScreensEditor_'+screenData.id">
    <div class="screensHeader">
      <!-- <el-button plain size="mini" type="primary" @click="addText">添加</el-button> -->
      <el-dropdown @command="handleCommand">
        <!-- <span class="el-dropdown-link">
          <img src="../../../assets/images/screenList/drop-down.png" />
        </span>-->
        <el-button plain size="mini" type="primary" class="el-dropdown-link">添加</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">文字</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" size="mini" @click="saveData(true,'0','')" class="right">保存</el-button>
      <el-button plain type="primary" size="mini" class="right" @click="previewScreen">预览</el-button>
      <el-button plain type="primary" size="mini" class="right" @click="goback">返回</el-button>
    </div>
    <div class="screensMain" ref="screensMain">
      <!-- 指标列表 -->
      <div class="targetMain">
        <targetList @useTarget="chooseTarget" :fold="fold" @foldChange="foldChange"></targetList>
      </div>
      <!-- 大屏 -->
      <div
        class="screen"
        ref="screenSize"
        :style="{'width': !fold ?(foldAttribute? 'calc(100% - 300px)':'calc(100% - 670px)' ):(foldAttribute? 'calc(100% - 60px)':'calc(100% - 430px)' ) }"
      >
        <screenContent
          ref="screenContent"
          :enable="true"
          :usedTargetData.sync="usedTargetData"
          :screenData.sync="screenData"
          :changeBG.sync="changeBG"
          :parentW.sync="parentW"
          :parentH.sync="parentH"
          @updateTargetData="updateTargetData"
          @backgroundChange="backgroundChange"
          @openSide="openSide"
        ></screenContent>
      </div>
      <!-- 属性配置 -->
      <div class="attributeMain">
        <deployAttribute
          :foldAttribute="foldAttribute"
          @foldAttributeChange="foldAttributeChange"
          :attributeType="attributeType"
          :screenData.sync="screenData"
          :usedTargetData.sync="usedTargetData"
          :currentTargetData.sync="currentTargetData"
          :currentTargetIndex.sync="currentTargetIndex"
          @bgChange="bgChange"
          @targetChange="targetChange"
          @themeColorChange="themeColorChange"
        ></deployAttribute>
      </div>
    </div>
    <el-dialog :visible.sync="isShowBackDia" width="360px">
      <template #title>
        <BlueIconTitle :text="'返回'" />
      </template>
      <span>修改未保存，返回将不会保存修改，确认返回吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowBackDia = false" size="mini">取 消</el-button>
        <el-button @click="saveAndBack(false)" size="mini">直接返回</el-button>
        <el-button type="primary" @click="saveAndBack(true)" size="mini">保存并返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import VueDraggableResizable from 'vue-draggable-resizable-gorkys';
// import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css';
import { getScreenDetail, saveLargeScreen } from '@/service/biTools';
import BlueIconTitle from '@/components/BlueIconTitle.vue';
import _bi from '@/utils/biUtils';
import { EventBus } from '@/event-bus';
import _ from '@/utils';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'biScreensEditor',
  components: {
    // VueDraggableResizable,
    screenContent: () => import('./components/screen.vue'),
    targetList: () => import('./components/targetList.vue'),
    deployAttribute: () => import('./components/deployAttribute.vue'),
    BlueIconTitle,
  },
  computed: {
    ...mapState('menu', {
      labelArr: (state) => state.labelArr,
    }),
  },
  data() {
    return {
      screenData: {
        //大屏基础信息
        id: '',
        name: 'xxxxxxx大屏',
        remark: '大屏说明',
        bgrateX: null, //大屏比例-x
        bgrateY: null, //大屏比例-y
        backgroundUrl: '', //
        themeColor: '',
        defaultTheme: true,
        height: null, //大屏实际高
        width: null, //大屏实际宽
        border: true,
        borderColor: '#0075ff',
        position: 'relative',
        margin: ' 0 auto',
      },
      screenDataSaved: {}, //保存的大屏基础信息
      usedTargetData: [], //指标信息
      usedTargetDataSaved: [], //保存的指标信息
      changeBG: false,
      fold: false, //左侧指标列表收起？
      foldAttribute: false, //左侧属性配置收起？
      attributeType: '1', // 1大屏属性配置，2文字设置，3指标配置
      parentW: null, //大屏可用容器宽
      parentH: null, //大屏可用容器高
      currentTargetData: {}, //当前选中指标的数据
      currentTargetIndex: null, //当前选中指标的数据
      screenConfigJson: {},
      isLoading: false,
      isShowBackDia: false,
    };
  },
  watch: {
    '$route.query'() {
      if (this.$route.query.id && this.$route.name == 'biScreensEditor') {
        this.screenData.id = this.$route.query.id;
        this.getScreenData(this.$route.query.id);
      }
    },
  },
  created() {
    if (this.$route.query.id) {
      this.screenData.id = this.$route.query.id;
      this.getScreenData(this.$route.query.id);
    }
    EventBus.$on('changeLabel', (path) => {
      // this.$nextTick(() => {});
      let changeStatus = this.checkScreenContent();
      console.log(changeStatus);
      if (changeStatus) {
        this.$confirm('检测到您有未保存的配置项，是否进行保存，直接跳转数据将会丢失！', '提示', {
          confirmButtonText: '保存并跳转',
          cancelButtonText: '直接跳转',
          type: 'warning',
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
        })
          .then(() => {
            // console.log(path);
            this.saveData(true, '2', path);
          })
          .catch((action) => {
            action === 'cancel' ? this.$router.push(path) : '';
          });
      } else {
        //  console.log(path);
        this.$router.push(path);
      }
    });
  },
  beforeDestroy() {
    console.log('beforeDestroy');
    EventBus.$off('changeLabel');
  },
  methods: {
    //获取大屏详情
    getScreenData(id) {
      getScreenDetail({
        id: id,
      }).then((res) => {
        let ratio = res.ratio.split(':');
        this.screenData.bgrateX = Number(ratio[0]);
        this.screenData.bgrateY = Number(ratio[1]);
        this.screenData.name = res.name;
        this.screenData.id = res.id;
        this.screenData.remark = res.remark;
        this.screenData.backgroundUrl = res.backGround;
        this.screenData.isModel = res.isModel;
        this.screenData.isOnline = res.isOnline;
        this.screenData.status = res.status;
        this.screenData.themeColor = res.configJson ? JSON.parse(res.configJson).themeColor : '';
        this.screenData.defaultTheme = res.configJson ? JSON.parse(res.configJson).defaultTheme : true;
        this.screenData.width = res.configJson ? JSON.parse(res.configJson).width : null;
        this.screenData.height = res.configJson ? JSON.parse(res.configJson).height : null;
        this.screenData.defaultTheme = res.configJson ? JSON.parse(res.configJson).defaultTheme : true;
        this.usedTargetData = [];
        if (res.list) {
          res.list.forEach((i, index) => {
            var obj = {};
            obj.active = false;
            obj.name = i.name ? i.name : JSON.parse(i.screenConfig).name;
            obj.statisticsType = i.typeId;
            obj.baseData = i;
            obj.positionData = {};
            obj.positionData.x = JSON.parse(i.screenConfig).x;
            obj.positionData.y = JSON.parse(i.screenConfig).y;
            obj.positionData.width = JSON.parse(i.screenConfig).width;
            obj.positionData.height = JSON.parse(i.screenConfig).height;
            obj.positionData.key = index;
            obj.id = i.id;
            if (i.type == 0) {
              obj.targetType = i.typeId == 3 ? 3 : 1; // 1：其他指标,2:文本框,3：文字指标
              obj.targetId = i.typeId;
              obj.statisticsType = i.statisticsId;
              obj.positionData.minWidth = 20;
              obj.positionData.minHeight = 20;
              obj.baseData.configJson = obj.baseData.configJson;
              obj.baseData.configCode = obj.baseData.configCode;
              obj.color = i.typeId == 3 ? '' : this.getTargetDefaultColor(i);
            } else {
              obj.targetType = 2;
              obj.targetId = index;
              obj.statisticsType = 0;
              obj.textsize = JSON.parse(i.screenConfig).textsize;
              obj.textweight = JSON.parse(i.screenConfig).textweight;
              obj.textcolor = JSON.parse(i.screenConfig).textcolor;
              obj.opacity = JSON.parse(i.screenConfig).opacity;
              obj.positionData.minWidth = 20;
              obj.positionData.minHeight = 10;
            }
            this.usedTargetData.push(obj);
          });
        }
        let screenDataSaved = JSON.stringify(this.screenData);
        this.screenDataSaved = JSON.parse(screenDataSaved);
        let usedTargetDataSaved = JSON.stringify(this.usedTargetData);
        this.usedTargetDataSaved = JSON.parse(usedTargetDataSaved);
        this.$refs['screenContent'].calculateScope(true);
        // console.log(this.usedTargetData);
      });
    },
    //选择添加某一指标回调
    chooseTarget(parent, item) {
      if (item.apiParameterVos[0].result.rsp) {
        this.usedTargetData.forEach((i) => (i.active = false));
        this.$nextTick(function () {
          var obj = {};
          var positionData = {};
          obj.targetType = item.typeId == 3 ? 3 : 1; // 1：其他指标,2:文本框,3:文字指标
          obj.statisticsType = item.id;
          obj.targetId = item.typeId; // 1：折线图,2:饼状图,3：纯文本,4:仪表盘,5：柱状图,6:雷达图
          obj.url = item.thumbnail;
          obj.name = item.name;
          obj.active = true;
          obj.baseData = item;
          positionData.x = 20;
          positionData.y = 30;
          positionData.minWidth = 50;
          positionData.minHeight = 50;
          positionData.width = item.typeId == 3 ? 445 : item.configJson.boxStyle.width ? item.configJson.boxStyle.width : 300;
          positionData.height = item.typeId == 3 ? 147 : item.configJson.boxStyle.width ? item.configJson.boxStyle.height : 300;
          positionData.key = this.usedTargetData.length;
          obj.positionData = positionData;
          obj.color = item.typeId == 3 ? '' : item.typeId == 4 ? '' : this.getTargetDefaultColor(item);
          this.usedTargetData.push(obj);
          this.currentTargetData = obj;
          this.currentTargetIndex = this.usedTargetData.findIndex((i) => i == obj);
          this.attributeType = '3';
          // console.log(this.currentTargetIndex);
        });
      } else {
        return _.showMessage('error', '该指标数据异常');
      }
    },
    //获取指标默认主题色
    getTargetDefaultColor(item) {
      // console.log(item);
      let handledCode = item.apiCode;
      if (item.apiParameterVos[0].result.rsp) {
        let sourceData = item.apiParameterVos[0].result.rsp.data;
        let result = _bi.dynamic(sourceData, handledCode);
        let optStr = JSON.parse(item.configCode).code;
        let eOption = _bi.dynamic(result.data, optStr);
        return eOption.data.color.join();
      } else {
        return _.showMessage('error', '该指标数据异常');
      }
    },
    //往大屏添加元素
    handleCommand(command) {
      if (command == '1') {
        this.addText();
      }
    },
    //添加文字
    addText() {
      this.usedTargetData.forEach((i) => (i.active = false));
      this.$nextTick(function () {
        var obj = {};
        var positionData = {};
        obj.targetType = 2;
        obj.statisticsType = 0; // 0:添加文字
        obj.targetId = '';
        obj.name = '请输入文本内容';
        obj.textsize = 14;
        obj.textweight = 'normal';
        obj.textcolor = '#0075ff';
        obj.opacity = '100%';
        obj.active = true;
        positionData.x = 100;
        positionData.y = 30;
        positionData.minWidth = 20;
        positionData.minHeight = 10;
        positionData.width = 200;
        positionData.height = 50;
        positionData.key = this.usedTargetData.length;
        obj.positionData = positionData;
        this.usedTargetData.push(obj);
        this.currentTargetData = obj;
        this.currentTargetIndex = this.usedTargetData.findIndex((i) => i == obj);
        // console.log(this.currentTargetIndex);
        this.attributeType = '2';
      });
    },
    updateTargetData(arr) {
      this.usedTargetData = arr;
    },
    //大屏背景图变化回调
    bgChange(val) {
      this.screenData.backgroundUrl = val.backGround;
      this.screenData.bgrateX = val.ratio.split(':')[0];
      this.screenData.bgrateY = val.ratio.split(':')[1];
      this.changeBG = true;
      this.screenData.width = this.$refs.screenSize.offsetWidth;
      this.screenData.height = this.$refs.screenSize.offsetHeight;
    },
    //大屏尺寸变化回调
    backgroundChange(val, w, h, oldw, oldh) {
      // console.log(val, w, h, oldw, oldh);
      this.screenData.width = w;
      this.screenData.height = h;
      this.changeBG = false;
      document.getElementsByTagName('html')[0].style['font-size'] = 16 * (h / oldh) + 'px';
      let usedTargetData = JSON.parse(JSON.stringify(this.usedTargetData));
      this.usedTargetData.forEach((i) => ((i.positionData.x = null), (i.positionData.y = null), (i.positionData.width = null), (i.positionData.height = null)));
      // this.usedTargetData.forEach((i) => (i.positionData = {}));
      this.$nextTick(function () {
        usedTargetData.forEach((i) => {
          i.positionData.x = Math.round(i.positionData.x * (w / oldw));
          i.positionData.y = Math.round(i.positionData.y * (h / oldh));
          i.positionData.width = Math.round(i.positionData.width * (w / oldw));
          i.positionData.height = Math.round(i.positionData.height * (h / oldh));
          i.positionData.minWidth = Math.round(i.positionData.minWidth * (w / oldw));
          i.positionData.minHeight = Math.round(i.positionData.minHeight * (h / oldh));
          if (i.baseData.type == 1) {
            i.baseData.screenConfig = JSON.parse(i.baseData.screenConfig);
            i.baseData.screenConfig.textsize = i.baseData.screenConfig.textsize * (h / this.screenData.height);
            i.textsize = i.textsize * (h / this.screenData.height);
            i.baseData.screenConfig = JSON.stringify(i.baseData.screenConfig);
          } else {
            if (i.baseData.typeId == 3) {
              // i.baseData.configJson.textStyle.duliangFontSize = Math.round(i.baseData.configJson.textStyle.duliangFontSize * (h / oldh));
              // i.baseData.configJson.textStyle.weiduFontSize = Math.round(i.baseData.configJson.textStyle.weiduFontSize * (h / oldh));
              // i.baseData.configCode = JSON.stringify(i.baseData.configJson);
            }
          }
        });
      });
      this.$nextTick(function () {
        this.usedTargetData = usedTargetData;
      });
    },
    //左侧指标列表的收缩状态回调
    foldChange() {
      this.fold = !this.fold;
      this.$nextTick(function () {
        this.parentW = this.$refs.screensMain.clientWidth - (this.fold ? (this.foldAttribute ? 60 : 430) : this.foldAttribute ? 300 : 670);
        this.parentH = this.$refs.screensMain.clientHeight - 32;
        // console.log('容器尺寸111', this.parentW, this.parentH);
        // this.$refs['screenContent'].calculateScope();
      });
    },
    //右侧属性配置的收缩状态回调
    foldAttributeChange() {
      this.foldAttribute = !this.foldAttribute;
      // this.$refs['screenContent'].calculateScope();
      this.$nextTick(function () {
        this.parentW = this.$refs.screensMain.clientWidth - (this.fold ? (this.foldAttribute ? 60 : 430) : this.foldAttribute ? 300 : 670);
        this.parentH = this.$refs.screensMain.clientHeight - 32;
        // console.log('容器尺寸222', this.parentW, this.parentH);
        // this.$refs['screenContent'].calculateScope();
      });
    },
    //大屏当前选中模块回调（大屏本身，指标，文字）
    openSide(data, index) {
      if (index || index == 0) {
        this.attributeType = data.data.targetType == 2 ? '2' : data.data.targetType == 1 || data.data.targetType == 3 ? '3' : '1';
        this.currentTargetData = data.data;
        this.currentTargetIndex = index;
      } else {
        this.attributeType = '1';
        this.currentTargetData = {};
        this.currentTargetIndex = 0;
      }
      this.foldAttribute = false;
    },
    //大屏主题色变化回调
    themeColorChange(val, type) {
      this.usedTargetData.forEach((i, index) => {
        if (i.baseData.typeId && i.baseData.typeId != 3 && i.baseData.typeId != 4) {
          let optStr = JSON.parse(i.baseData.configCode).code;
          /* 得到最新的echart option字符串 */
          let newOptionStr = _bi.transferStation(type, optStr, val);
          i.baseData.configJson.code = newOptionStr;
          i.baseData.configCode = JSON.stringify(i.baseData.configJson);
          this.targetChange(val, type, i, index, this.usedTargetData);
        }
      });
    },
    //指标属性修改回调
    targetChange(val, type, data, index, total) {
      // console.log('指标修改啦！', index);
      if (this.$refs['screenContent'].$refs['echartsContent_' + index]) {
        this.$refs['screenContent'].$refs['echartsContent_' + index][0].echartsDemo(index, false);
      }
    },
    //预览与保存的数据存储与提交
    saveData(status, back, path) {
      // console.log(status, back, path);
      this.isLoading = true;
      if (this.usedTargetData.findIndex((i) => i.active == true) != -1) {
        this.usedTargetData[this.usedTargetData.findIndex((i) => i.active == true)].active = false;
        this.saveData(status, back, path);
      } else {
        this.screenConfigJson.themeColor = this.screenData.themeColor;
        this.screenConfigJson.defaultTheme = this.screenData.defaultTheme;
        this.screenConfigJson.width = this.screenData.width;
        this.screenConfigJson.height = this.screenData.height;
        let params = {};
        this.$nextTick(function () {
          this.$refs['screenContent'].doCut().then((result) => {
            this.screenData.thumbnail = result;
            let targetList = [];
            this.usedTargetData.forEach((i) => {
              var obj = {};
              i.commitData = {};
              obj.x = i.positionData.x;
              obj.y = i.positionData.y;
              obj.width = i.positionData.width;
              obj.height = i.positionData.height;
              if (i.statisticsType == 0) {
                obj.name = i.name;
                obj.textsize = i.textsize;
                obj.textweight = i.textweight;
                obj.textcolor = i.textcolor;
                obj.opacity = i.opacity;
              } else {
              }
              // i.commitData.remark = i.baseData ? i.baseData.remark : '';
              i.commitData.screenConfig = JSON.stringify(obj);
              // i.commitData.configJson = i.statisticsType == 0 ? '' : JSON.stringify(i.baseData.configJson);
              i.commitData.configCode = i.statisticsType == 0 ? '' : i.baseData.configCode;
              i.commitData.largeScreenId = this.screenData.id;
              i.commitData.statisticsId = i.statisticsType == 0 ? null : i.statisticsType;
              i.commitData.type = i.statisticsType == 0 ? 1 : 0;
              if (i.id) {
                i.commitData.id = i.id;
              }
              if (!status) {
                i.commitData.apiCode = i.baseData ? i.baseData.apiCode : '';
                i.commitData.apiJson = i.baseData ? i.baseData.apiJson : '';
                i.commitData.apiParameterVos = i.baseData ? i.baseData.apiParameterVos : '';
                i.commitData.typeId = i.targetId ? i.targetId : '';
                i.commitData.configJson = i.baseData ? i.baseData.configJson : '';
              }
              targetList.push(i.commitData);
            });
            params = {
              configJson: JSON.stringify(this.screenConfigJson),
              id: this.screenData.id,
              isModel: this.screenData.isModel,
              isOnline: this.screenData.isOnline,
              list: targetList,
              name: this.screenData.name,
              ratio: this.screenData.bgrateX + ':' + this.screenData.bgrateY,
              remark: this.screenData.remark,
              status: this.screenData.status,
              backGround: this.screenData.backgroundUrl,
              thumbnail: this.screenData.thumbnail,
            };
            // console.log('大屏保存入参', params);
            if (status) {
              saveLargeScreen(params).then((res) => {
                this.isLoading = false;
                this.screenDataSaved = this.screenData;
                this.usedTargetDataSaved = this.usedTargetData;
                this.$message({
                  message: res,
                  type: 'success',
                });
                if (back == '1') {
                  // 保存并返回
                  let index = this.labelArr.findIndex((i) => i.isActive == true);
                  this.removeLabel(index);
                  this.$router.push({
                    name: 'biScreensList',
                  });
                } else if (back == '2') {
                  //保存并跳转
                  this.$router.push(path);
                }
              });
            } else {
              localStorage.setItem('previewScreenData_' + this.screenData.id, JSON.stringify(params));
              this.isLoading = false;
              //预览大屏
              window.open(window.location.origin + '/bi_display.html#/home?id='+this.$route.query.id+'&opentype=1','displayScreen_'+this.$route.query.id)//opentype:1  预览 2:发布
            }
          });
        });
      }
    },
    //预览大屏
    previewScreen() {
      localStorage.removeItem('previewScreenData_' + this.screenData.id);
      this.saveData(false, '0', '');
    },
    //检测大屏是否修改
    checkScreenContent() {
      let updataArr = [];
      if (
        this.screenDataSaved.name == this.screenData.name &&
        this.screenDataSaved.remark == this.screenData.remark &&
        this.screenDataSaved.backgroundUrl == this.screenData.backgroundUrl &&
        this.screenDataSaved.themeColor == this.screenData.themeColor &&
        this.screenDataSaved.defaultTheme == this.screenData.defaultTheme
      ) {
        if (this.usedTargetData.length != this.usedTargetDataSaved.length) {
          // console.log('改了指标数量');
          updataArr.push(1);
          //  return true;
        } else {
          this.usedTargetData.forEach((i, index) => {
            if (i.baseData.configCode == this.usedTargetDataSaved[index].baseData.configCode) {
              if (
                Math.round(this.usedTargetDataSaved[index].positionData.width * (this.screenData.width / this.screenDataSaved.width)) ==
                  this.usedTargetData[index].positionData.width &&
                Math.round(this.usedTargetDataSaved[index].positionData.x * (this.screenData.width / this.screenDataSaved.width)) == this.usedTargetData[index].positionData.x
              ) {
                // console.log('没');
                updataArr.push(0);
              } else {
                // console.log('有改动大小或坐标');
                updataArr.push(1);
              }
            } else {
              // console.log('有改动配置');
              updataArr.push(1);
            }
          });
        }
      } else {
        // console.log('改了大屏基础信息');
        updataArr.push(1);
      }
      // console.log(updataArr);
      if (updataArr.findIndex((i) => i == 1) != -1) {
        return true;
      } else {
        return false;
      }
    },
    goback() {
      let changeStatus = this.checkScreenContent();
      if (changeStatus) {
        this.isShowBackDia = true;
      } else {
        let index = this.labelArr.findIndex((i) => i.isActive == true);
        this.removeLabel(index);
        this.$router.push({
          name: 'biScreensList',
        });
      }
    },
    ...mapMutations('menu', ['removeLabel']),
    saveAndBack(status) {
      if (status) {
        this.saveData(true, '1', '');
      } else {
        let index = this.labelArr.findIndex((i) => i.isActive == true);
        this.removeLabel(index);
        this.$router.push({
          name: 'biScreensList',
        });
      }
      this.isShowBackDia = false;
    },
  },
  mounted() {
    this.parentW = this.$refs.screensMain.clientWidth - (this.fold ? (this.foldAttribute ? 60 : 430) : this.foldAttribute ? 300 : 670);
    this.parentH = this.$refs.screensMain.clientHeight - 32;
  },
};
</script>
<style lang='scss' scoped>
.biScreensEditor {
  background: #fff;
  margin: 10px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: absolute;
  top: 30px;
  bottom: 0;
  right: 0px;
  left: 0;
  .screensHeader {
    .right {
      float: right;
      margin-left: 10px;
    }
  }
  .screensMain {
    display: flex;
    position: absolute;
    top: 44px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    background: #2a2c33;
    .targetMain {
      // width: 300px;
    }
    .screen {
      // width: calc(100% - 300px);
    }
  }
}
::v-deep .el-button--primary.is-plain {
  background: #fff;
  border: 1px solid #0075ff;
  color: #0075ff;
}
::v-deep .el-button--primary.is-plain:hover {
  background-color: #0075ff;
  color: #fff;
}
</style>
