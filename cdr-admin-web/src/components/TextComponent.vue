<!--  -->
<template>
  <div
    class="box-style"
    ref="targetDiv"
    :style="{
      backgroundColor: realObj.backgroundColor,
      borderRadius: realObj.backgroundRadius,
      width: width,
      height: height,
      position: 'relative'
    }"
    :class="[realObj.alignment === '1']"
  >
    <!-- {{realHandledData}}111 -->
    <div
      :style="{
        position: 'absolute',
        top: realObj.topSpace,
        left: realObj.leftSpace,
        bottom: realObj.bottomSpace,
        right: realObj.rightSpace,
      }"
    >
      <div :style="{
        display:realObj.alignment === '2' ?'inline-block':'block'
      }">
        <span
          id="textWeidu"
          :style="{
            color: realObj.weiduColor,
            fontSize: `${realObj.weiduFontSize}px`,
            fontWeight: realObj.weiduFontWeight
          }"
        >
          {{ realHandledData[0] ? realHandledData[0].value : ''
          }}
          <span v-show="realObj.isShowMaohao" id="maohao">：</span>
        </span>
      </div>
      <div
        :style="{
          color: realObj.duliangColor,
          fontSize: `${realObj.duliangFontSize}px`,
          fontWeight: realObj.duliangFontWeight,
          display:realObj.alignment === '2' ?'inline-block':'block'
        }"
      >
        <span id="textDuliang">{{ realHandledData[1] ? realHandledData[1].value : '' }}</span>
        <span id="textDuliang">{{ realObj.duliangDanwei }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import _bi from '@/utils/biUtils';
import _ from '@/utils';
import html2canvas from 'html2canvas';
export default {
  props: {
    textMap: {
      type: Array,
    },
    handledData: {
      type: Array | Object,
    },
    styleObj: {
      type: Object,
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    TextItem: {
      type:Object
    },
    id: {
      type:String
    }
  },
  watch: {
    textMap: {
      handler: function (val) {
        val ? (this.realHandledData = _bi.getTextData(val, this.handledData)) : '';
      },
      deep: true,
      immediate: true,
    },
    handledData: {
      handler: function (val) {
        // console.log(val, '8520')
        this.textMap ? (this.realHandledData = _bi.getTextData(this.textMap, val)) : '';
      },
      deep: true,
      immediate: true,
    },
    styleObj: {
      handler: function (val) {
        this.realObj = _.deepCopy(val, {});
        console.log(this.styleObj, 'TextComponent的styleObj');
      },
      deep: true,
      immediate: true,
    },
    realHandledData(newVal){
    }
  },
  data() {
    return {
      realHandledData: [],
      realObj: {},
      timerconfigSon:{}
    };
  },

  components: {},
  created() {
    console.log(this.handledData, 'handle', this.textMap);
    
  },
  mounted(){
    if (this.$route.query.opentype == 1 || this.$route.query.opentype == 2) {
      console.log(this.TextItem,'TextItem1')
      this.timerconfigSon = this.TextItem.baseData.configJson.timer;
      this.autorefresh();
    }
  },
  computed: {},

  methods: {
    //屏幕快照
    divCut() {
      let targetShot = '';
      targetShot = html2canvas(this.$refs.targetDiv, {
        useCORS: true,
        backgroundColor:'#fbfbfb'
      }).then(function (canvas) {
        let url = canvas.toDataURL('image/xml');
        console.log(canvas, url, '快照url');
        return url;
      });
      console.log(targetShot, 'targetShot');
      return targetShot;
    },
    init(){
      let index = this.id.split('_')[1];
      let TextItem=this.TextItem
      this.$emit('refreshTarget', TextItem, index);
    },
    autorefresh() {
      //预览、发布自动刷新
      if (this.timerconfigSon.isOpen && this.timerconfigSon.type == 1) {
        this.timer = setInterval(() => {
           this.init()
        }, this.timerconfigSon.value * 1000);
      } else if (this.timerconfigSon.isOpen && this.timerconfigSon.type == 2) {
        this.timer = setInterval(() => {
          var hs = new Date().getHours();
          var ms = new Date().getMinutes();
          let timeDate = hs + ':' + ms;
          if (timeDate == this.timerconfigSon.value) {
            this.init()
          }
        }, 1000 * 59);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.box-style {
  // width: fit-content;
  // display: flex;
  box-sizing: border-box;
  // align-items: center;
  background: rgba(85, 114, 195, 0.1);
  // min-width: 200px;
}
</style>
