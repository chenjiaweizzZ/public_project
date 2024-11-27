<template>
  <div class="hospitalization-box">
    <div class="left-container">
      <left-nav :menuList="hospitalizedMenuList" :leftNavActive="activeValue" @leftNavClick="itemClick"></left-nav>
    </div>
    <div class="right-container">
      <keep-alive>
        <component v-bind:is="currentComponent"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import hospitalCaseHistory from './components/hospitalizationComponent/hospitalCaseHistory';
import medicationOrder from './components/hospitalizationComponent/medicationOrder';
import LeftNav from './components/common/LeftNav.vue';
import inspectionReport from './components/outpatientComponent/inspectionReport.vue';
import diagnosisRecord from './components/outpatientComponent/diagnosisRecord.vue';
import checkReport from './components/outpatientComponent/checkReport.vue';
import bloodTransfusionRecord from './components/hospitalizationComponent/bloodTransfusionRecord';
import surgicalRecord from './components/outpatientComponent/surgicalRecord.vue';

export default {
  name: '',
  components: {
    LeftNav,
    hospitalCaseHistory,
    medicationOrder,
    inspectionReport,
    diagnosisRecord,
    checkReport,
    surgicalRecord,
    bloodTransfusionRecord,
  },
  props: {
    menuList: {
      type: Array,
    },
    leftNavActive: {
      type: String,
    },
  },
  watch: {
    //切换患者的时候左侧导航永远都默认第一个
    '$route.query'() {
      if (this.$route.query.hzid) {
        console.log('我watchhhhhh');
        this.itemClick({ value: '0', label: '病历' });
      }
    },
  },
  data() {
    return {
      activeValue: '0',
      currentComponent: 'hospitalCaseHistory',
      hospitalizedMenuList: [
        { label: '病历', value: '0', url: require('@svg/patientCommonMode/menzhenbingli.svg') },
        { label: '药嘱', value: '1', url: require('@svg/patientCommonMode/commonNavigation.svg') },
        { label: '检验报告', value: '2', url: require('@svg/patientCommonMode/menzhenjianyanbaogao.svg') },
        {
          label: '检查报告',
          value: '3',
          url: require('@svg/patientCommonMode/menzhenjianchabaogao.svg'),
        },
        {
          label: '手术记录',
          value: '4',
          url: require('@svg/patientCommonMode/menzhenshoushujilu.svg'),
        },
        {
          label: '输血记录',
          value: '5',
          url: require('@svg/patientCommonMode/zhuyuanshuxuejilu.svg'),
        },
        { label: '诊断', value: '6', url: require('@svg/patientCommonMode/zhuyuanzhenduan.svg') },
      ],
    };
  },

  created() {},
  methods: {
    itemClick(item) {
      this.activeValue = item.value;
      this.centerTitle = item.label;
      this.getCurrentComponent(this.activeValue);
      // this.$emit('leftNavClick', val)
    },
    getCurrentComponent(str) {
      switch (str) {
        case '0':
          this.currentComponent = 'hospitalCaseHistory';
          break;
        case '1':
          this.currentComponent = 'medicationOrder';
          break;
        case '2':
          this.currentComponent = 'inspectionReport';
          break;
        case '3':
          this.currentComponent = 'checkReport';
          break;
        case '4':
          this.currentComponent = 'surgicalRecord';
          break;
        case '5':
          this.currentComponent = 'bloodTransfusionRecord';
          break;
        case '6':
          this.currentComponent = 'diagnosisRecord';
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// .left-nav {
//   .nav-item {
//     height: 48px;
//     font-weight: 700;
//     font-size: 14px;
//     color: #333;
//     justify-content: space-around;
//     background-color: #f9fbfe;
//     padding: 14px 18px;
//     img {
//       vertical-align: middle;
//     }
//     span {
//       margin-left: 13px;
//     }
//   }
//   .active-item {
//     background-color: #e3eafc;
//     border-right: 3px solid #0075ff;
//     color: #0075ff;
//   }
// }
.hospitalization-box {
  display: flex;
  width: 100%;
  .left-container {
    background-color: #fff;
    width: 140px;
    margin-right: 10px;
  }
  .right-container {
    flex: 1;
  }
}
</style>
