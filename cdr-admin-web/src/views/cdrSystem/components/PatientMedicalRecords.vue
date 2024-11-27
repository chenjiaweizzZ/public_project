<template>
  <!-- 门诊病历公用组件 -->
  <section :class="[mode === 'common' ? 'person-medical' : 'person-medicalTimeLine']">
    <div class="medical-title">门诊病历</div>
    <div class="patient-infoStyle">
      <div class="patient-row">
        <div class="patient-item ">
          <span>姓名</span>
          <span>{{ medicalInfo.xm }}</span>
        </div>
        <div class="patient-item ">
          <span>性别</span>
          <span>{{ medicalInfo.xb }}</span>
        </div>
        <div class="patient-item ">
          <span>年龄</span>
          <span>{{ medicalInfo.nl }}</span>
        </div>
        <div class="patient-item ">
          <span>出生日期</span>
          <span>{{ medicalInfo.csrq && medicalInfo.csrq.slice(0, 10) }}</span>
        </div>
      </div>
      <div class="patient-row">
        <div class="patient-item ">
          <span>门诊号</span>
          <span>{{ medicalInfo.mjzh }}</span>
        </div>
        <div class="patient-item ">
          <span>科室</span>
          <span>{{ medicalInfo.ks }}</span>
        </div>
        <div class="patient-item ">
         
        </div>
        <div class="patient-item ">
           <span>就诊日期</span>
          <span>{{ medicalInfo.jzrq && medicalInfo.jzrq.slice(0, 10) }}</span>
        </div>
      </div>
    </div>
    <div class="patient-item ">
      <span>主诉</span>
      <span>{{ medicalInfo.zs }}</span>
    </div>
    <div class="patient-item ">
      <span>现病史</span>
      <span>{{ medicalInfo.xbs }}</span>
    </div>
    <div class="patient-item ">
      <span>既往史</span>
      <span>{{ medicalInfo.jws }}</span>
    </div>
    <div class="patient-item ">
      <span>体格检查</span>
      <div>{{ medicalInfo.tgjc }}</div>
    </div>
    <div class="patient-item ">
      <span>辅助检查</span>
      <div>{{ medicalInfo.fzjc }}</div>
    </div>
    <div class="patient-item ">
      <span>诊断</span>
      <div>{{ medicalInfo.zd }}</div>
    </div>
    <div class="patient-item ">
      <span>医嘱</span>
      <div>{{ medicalInfo.yz }}</div>
    </div>
    <div class="bottom-style">
      <div>
        <span class="bottom-label">医生签名</span>
        <span>{{ medicalInfo.ysqm }}</span>
      </div>
      <div style="margin-left:40px">
        <span class="bottom-label">签名日期</span>
        <span>{{ medicalInfo.qmrq }}</span>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    medicalInfo: {
      type: Object
    },
    //普通模式：common   时间轴： timeLine
    mode: {
      type: String
    }
  },
  data() {
    return {}
  },
  created() {
    // console.log(this.medicalInfo,"medicalInfo");
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.medical-title {
  text-align: center;
  margin-bottom: 8px;
}
.patient-infoStyle {
  border-top: 1px solid #666;
  padding-right: 90px;
  border-bottom: 1px solid #666;
  .patient-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
}
.patient-content {
  display: flex;
  :first-child {
    max-width: 120px;
  }
}

.patient-item {
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  flex: 1;
  :first-child {
    color: #475e79;
    margin-right: 10px;
    flex-shrink: 0;
  }
  :last-child {
    color: #111;
    flex-flow: 1;
  }
}

.bottom-style {
  margin-top: 18%;
  padding-top: 8px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #666;
  font-size: 14px;
  .bottom-label {
    margin-right: 10px;
    color: #475e79;
  }
  .bottom-value {
    color: #111111;
  }
}
.person-medical {
  border: 1px solid #e6e6e6;
  padding: 24px 60px 30px 60px;
  // @extend .medical-title
}
.person-medicalTimeLine {
  padding: 16px 10px;
  // @extend .medical-title;
}
</style>
