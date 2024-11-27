<template>
  <section ref="section" class="ncdReportDetail">
    <iframe
      style="height:100vh"
      :src="urlx + '/#/thereportpreview?reportId=' + funcsDetailid +'&hospitalId='+hospitalId +'&riskType='+riskType+'&from=phone'"
      width="100%"
      frameborder="0"
    ></iframe>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      urlx: '',
      funcsDetailid: '',
      hospitalId: '',
      riskType: '',
      patientId: '',
    };
  },
  created() {
    if (location.pathname) {
      this.urlx = location.origin + location.pathname.replace(/h5/, 'pc');
    } else {
      this.urlx = location.origin + '/pc';
    }
    this.funcsDetailid = this.$route.query.funcsDetailid;
    this.riskType = this.$route.query.riskType;
    this.hospitalId = this.$route.query.riskType;
    this.patientId = this.$route.query.patientId;
  },
  methods: {},
  beforeDestroy() {
    // console.log(333333333333333);
    sessionStorage.setItem('currentPatientId', this.patientId);
  },
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.fff {
  background: #fff;
}
.ncdReportDetail {
  position: relative;
  width: 100%;
  height: 100%;
  &::before {
    content: '';
    display: table;
  }
}
</style>
