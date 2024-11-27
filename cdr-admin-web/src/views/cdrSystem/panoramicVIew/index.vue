<template>
  <div>
    <div class="content">
      <div class="left">
        <div><PatientCard></PatientCard></div>
        <div><CheckInfo></CheckInfo></div>
        <div><History></History></div>
        <div><VisitRecords></VisitRecords></div>
      </div>
      <div class="right">
        <div class="right-top"><PanoramicView></PanoramicView></div>
        <div class="right-btn">
          <div class="right-btn-left"><MedicineRecords></MedicineRecords></div>
          <div class="right-btn-right"><OperationRecords></OperationRecords></div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button class="nomal" type="success" @click="goToNormalModel">普通模式</el-button>
      <el-button class="timemodel" type="primary" @click="goToTimeModel">时间轴模式</el-button>
    </div>
  </div>
</template>

<script>
import PatientCard from "./components/PatientCard.vue"
import CheckInfo from "./components/CheckInfo.vue"
import History from "./components/Historys.vue"
import PanoramicView from "./components/PanoramicView.vue"
import VisitRecords from "./components/VisitsRecords.vue"
import OperationRecords from "./components/OperationRecords.vue"
import MedicineRecords from "./components/MedicineRecords.vue"
import { mapState, mapMutations } from "vuex"
export default {
  data() {
    return {
      size: 30, //页面大小默认为30
      currentPage: 1, //当前页为1
      recordData: [], //就诊记录数据集
      total: 0,
    }
  },
  computed: {
    ...mapState("project", {
      patientInfo: (state) => state.patientInfo,
    }),
  },
  components: {
    PatientCard,
    CheckInfo,
    History,
    PanoramicView,
    VisitRecords,
    OperationRecords,
    MedicineRecords,
  },
  created() {
    console.log("全景视图")
  },
  methods: {
    ...mapMutations("commonMode", ["SETCURRENTHZID"]),
    goToNormalModel() {
    this.SETCURRENTHZID(this.patientInfo.hzid)
      this.$router.push({name:"commonMode",query:{
        ...this.$route.query
      }})
    },
    goToTimeModel() {
      this.$router.push({name:"timelineMode",query:{
        ...this.$route.query
      }})
    },
  },
}
</script>
<style lang="scss" scoped>
// @media screen and (min-width: 1440px) and (max-width: 1680px) {
//   .card-style {
//     width: 17.9%;
//   }
// }
.content {
  display: flex;
  margin: 10px;
  padding-bottom: 66px;
  .left {
    flex: 1;
    min-width: 467px;
  }
  .right {
    flex: 2;
    min-width: 943px;
    .right-btn {
      display: flex;

      .right-btn-left {
        flex: 1;
        min-width: 467px;
      }
      .right-btn-right {
        flex: 1;
        min-width: 467px;
      }
    }
  }
}
.footer {
  width: 100vw;
  height: 66px;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  background: #ffffff;
  box-shadow: 0px -2px 6px rgba(0, 0, 0, 0.181895);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  button{
    width: 110px;
  }
  .nomal{
    border: #00982D 1px solid;
    background: #32AE57;
  }
  .timemodel{
    border: #0276D7 1px solid;
    background: #0283EF;
  }
}
</style>
