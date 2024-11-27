<!-- 大屏呈现主页面 -->
<template>
  <div class="biScreensPreview" ref="screensMain">
    <div class="screen" ref="screenSize" v-if="isExist">
      <screenContent ref="screenContent" :usedTargetData.sync="usedTargetData" :screenData.sync="screenData" :enable="false" @calculate="calculate"></screenContent>
    </div>
    <div v-else class="noData">
      <img src="@/assets/images/bi/targetListNodata.png" />
      <p>链接已失效</p>
    </div>
  </div>
</template>
<script>
import * as _api from '@/service/biTools';
import { getScreenDetail, getStatisticsDetail } from '@/service/biTools';
export default {
  name: '',
  components: {
    screenContent: () => import('@/views/bi/screensEditor/components/screen.vue'),
    // screenContent: () => import('./screen.vue'),
  },
  data() {
    return {
      usedTargetData: [],
      screenData: {
        bgrateX: null,
        bgrateY: null,
        backgroundUrl: '',
        height: null,
        width: null,
        border: true,
        borderColor: '#0075ff',
        position: 'relative',
        margin: ' 0 auto',
        targetType: 1,
      },
      isExist: true,
      _beforeUnload_time: 0,
      _gap_time: 0,
    };
  },
  created() {},
  mounted() {
    if (this.$route.query.opentype == 2) {
      this.getScreenData();
    } else {
      this.getTheme();
    }
    this.$refs.screensMain.style.height = document.documentElement.clientHeight + 'px';
    window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e));
    window.addEventListener('unload', (e) => this.unloadHandler(e));
    var that = this;
    window.addEventListener('storage', function (e) {
      if (e.key && e.key == 'previewScreenData_' + that.$route.query.id && e.newValue) {
        //监听缓存是否变化
        that.getTheme();
        that.$refs.screenContent.calculateScope();
      }
    });
  },
  methods: {
    calculate(w, h) {
      this.usedTargetData.forEach((i) => {
        i.positionData.x = i.positionData.x * (w / this.screenData.width);
        i.positionData.y = i.positionData.y * (h / this.screenData.height);
        i.positionData.width = i.positionData.width * (w / this.screenData.width);
        i.positionData.height = i.positionData.height * (h / this.screenData.height);
        i.positionData.minWidth = i.positionData.minWidth * (w / this.screenData.width);
        i.positionData.minHeight = i.positionData.minHeight * (h / this.screenData.height);
        i.baseData.configJson = i.baseData.configJson ? (i.baseData.configJson.code ? i.baseData.configJson : JSON.parse(JSON.stringify(i.baseData.configJson))) : '';
        document.getElementsByTagName('html')[0].style['font-size'] = 16 * (h / this.screenData.height) + 'px';
        if (i.baseData.type == 1) {
          i.baseData.screenConfig = JSON.parse(i.baseData.screenConfig);
          i.baseData.screenConfig.textsize = i.baseData.screenConfig.textsize * (h / this.screenData.height);
          i.textsize = i.textsize * (h / this.screenData.height);
         
          i.baseData.screenConfig = JSON.stringify(i.baseData.screenConfig);
        } else {
          if (i.baseData.typeId == 3) {
            //  i.baseData.configJson = JSON.parse(i.baseData.configJson);
            console.log(i.baseData.configJson);
              i.baseData.configJson.textStyle.duliangFontSize =i.baseData.configJson.textStyle.duliangFontSize * (w / this.screenData.width)
              i.baseData.configJson.textStyle.weiduFontSize = i.baseData.configJson.textStyle.weiduFontSize * (w / this.screenData.width)
            
            console.log(i.baseData.configJson.textStyle.duliangFontSize);
            // i.baseData.configJson = JSON.stringify(i.baseData.configJson);
            i.baseData.configCode = JSON.stringify(i.baseData.configJson);
          }
        }
      });
      // console.log(this.usedTargetData);
    },
    getTheme() {
      if (localStorage.getItem('previewScreenData_' + this.$route.query.id)) {
        let config = JSON.parse(localStorage.getItem('previewScreenData_' + this.$route.query.id));
        // console.log(config);
        let ratio = config.ratio.split(':');
        this.screenData.bgrateX = Number(ratio[0]);
        this.screenData.bgrateY = Number(ratio[1]);
        this.screenData.id = config.id;
        this.screenData.backgroundUrl = config.backGround;
        this.screenData.isModel = config.isModel;
        this.screenData.isOnline = config.isOnline;
        this.screenData.status = config.status;
        this.screenData.width = config.configJson ? JSON.parse(config.configJson).width : 0;
        this.screenData.height = config.configJson ? JSON.parse(config.configJson).height : 0;
        this.usedTargetData = [];
        if (config.list) {
          config.list.forEach((i, index) => {
            var obj = {};
            obj.active = false;
            obj.name = i.name ? i.name : JSON.parse(i.screenConfig).name;
            // obj.statisticsType = i.type == 0 ? '1' : '0';
            obj.baseData = i;
            obj.positionData = {};
            obj.positionData.x = JSON.parse(i.screenConfig).x;
            obj.positionData.y = JSON.parse(i.screenConfig).y;
            obj.positionData.width = JSON.parse(i.screenConfig).width;
            obj.positionData.height = JSON.parse(i.screenConfig).height;
            obj.positionData.minWidth = JSON.parse(i.screenConfig).width;
            obj.positionData.minHeight = JSON.parse(i.screenConfig).height;
            obj.positionData.key = index;
            obj.id = i.id;
            if (i.type == 0) {
              obj.targetType = i.typeId == 3 ? 3 : 1; // 1：其他指标,2:文本框,3：文字指标
              // obj.targetId = i.statisticsId;
              obj.positionData.minWidth = 20;
              obj.positionData.minHeight = 20;
              obj.baseData.configJson = obj.baseData.configJson;
              obj.baseData.configCode = obj.baseData.configCode;
            } else {
              obj.targetType = 2;
              // obj.targetId = index;
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
      } else {
        this.isExist = false;
      }
      console.log(this.usedTargetData);
    },
    getScreenData() {
      _api
        .getReleaseLargeScreen({
          id: this.$route.query.id,
        })
        .then((res) => {
          if (res.errCode == 30006) {
            this.isExist = false;
            this.$message.error(res.returnMsg);
          } else {
            this.isExist = true;
            localStorage.setItem('previewScreenData_' + this.$route.query.id, JSON.stringify(res));
            this.getTheme();
            setTimeout(()=>{
              this.$refs.screenContent.calculateScope();
            },500)
          }
        });
    },
    beforeunloadHandler(e) {
      this._beforeUnload_time = new Date().getTime();
    },
    unloadHandler(e) {
      this._gap_time = new Date().getTime() - this._beforeUnload_time;
      //判断是窗口关闭还是刷新
      if (this._gap_time <= 5) {
        localStorage.removeItem('previewScreenData_' + this.$route.query.id);
      }
    },
  },
  beforeDestroy() {
    localStorage.removeItem('previewScreenData_' + this.$route.query.id);
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadHandler(e));
    window.removeEventListener('unload', (e) => this.unloadHandler(e));
  },
};
</script>
<style lang='scss' scoped>
.biScreensPreview {
  .screen {
    height: 100%;
  }
  .noData {
    text-align: center;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    img {
      width: 300px;
    }
  }
}
</style>
<style lang='scss' >
.biScreensPreview {
  // height: 937px;
  .screenContent .scroll {
    // height: 500px;
    .screenBg {
    }
  }
}
</style>