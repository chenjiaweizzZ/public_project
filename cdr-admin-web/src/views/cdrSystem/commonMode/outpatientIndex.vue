<template>
  <!-- 门诊首页 -->
  <div class="outpatient-box">
    <div class="left-container">
      <left-nav :menuList="outpatientMenuList" :leftNavActive="activeValue" @leftNavClick="itemClick"></left-nav>
    </div>
    <div class="right-container">
      <keep-alive>
        <component v-bind:is="currentComponent"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import LeftNav from './components/common/LeftNav.vue';
import outpatientCaseHistory from './components/outpatientComponent/outpatientCaseHistory.vue';
import inspectionReport from './components/outpatientComponent/inspectionReport.vue';
import medicationRecords from './components/outpatientComponent/medicationRecords.vue';
import treatRecord from './components/outpatientComponent/treatRecord.vue';
import diagnosisRecord from './components/outpatientComponent/diagnosisRecord.vue';
import checkReport from './components/outpatientComponent/checkReport.vue';
import surgicalRecord from './components/outpatientComponent/surgicalRecord.vue';
export default {
  name: '',
  components: {
    LeftNav,
    outpatientCaseHistory,
    medicationRecords,
    inspectionReport,
    treatRecord,
    diagnosisRecord,
    checkReport,
    surgicalRecord,
  },
  data() {
    return {
      activeValue: '0',
      centerTitle: '病历',
      currentComponent: 'outpatientCaseHistory',
      outpatientMenuList: [
        { label: '病历', value: '0', url: require('@svg/patientCommonMode/menzhenbingli.svg') },
        {
          label: '用药记录',
          value: '1',
          url: require('@svg/patientCommonMode/commonNavigation.svg'),
        },
        { label: '治疗', value: '2', url: require('@svg/patientCommonMode/menzhenzhiliao.svg') },
        { label: '诊断', value: '3', url: require('@svg/patientCommonMode/menzhenzhenduan.svg') },
        { label: '检验报告', value: '4', url: require('@svg/patientCommonMode/menzhenjianyanbaogao.svg') },
        {
          label: '检查报告',
          value: '5',
          url: require('@svg/patientCommonMode/menzhenjianchabaogao.svg'),
        },
        {
          label: '手术记录',
          value: '6',
          url: require('@svg/patientCommonMode/menzhenshoushujilu.svg'),
        },
      ],
    };
  },

  created() {},
  watch: {
    //切换患者的时候左侧导航永远都默认第一个
    '$route.query'() {
      if (this.$route.query.hzid) {
        console.log('我watchhhhhh');
        this.itemClick({ value: '0', label: '病历' });
      }
    },
  },
  methods: {
    itemClick(item) {
      this.activeValue = item.value;
      this.centerTitle = item.label;
      this.getCurrentComponent(this.activeValue);
    },
    getCurrentComponent(str) {
      switch (str) {
        case '0':
          this.currentComponent = 'outpatientCaseHistory';
          break;
        case '1':
          this.currentComponent = 'medicationRecords';
          break;
        case '2':
          this.currentComponent = 'treatRecord';
          break;
        case '3':
          this.currentComponent = 'diagnosisRecord';
          break;
        case '4':
          this.currentComponent = 'inspectionReport';
          break;
        case '5':
          this.currentComponent = 'checkReport';
          break;
        case '6':
          this.currentComponent = 'surgicalRecord';
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.outpatient-box {
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
