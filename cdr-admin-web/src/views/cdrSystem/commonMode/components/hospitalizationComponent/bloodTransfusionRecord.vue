<template>
  <div class="container-box">
    <div class="center-box">
      <div class="title-style">
        输血记录
      </div>
      <collapse-component
        v-if="timeLineBloodList.length && checkList.length"
        @changeCollapse="changeCollapse"
        :list="checkList"
      >
        <div slot="title" slot-scope="{ data }">
          <div class="collapse-title">
            <span v-if="data.sxrq">输血时间：{{ data.sxrq }}</span>
          </div>
        </div>
        <div class="check-item" slot="content" slot-scope="{ obj }">
          <TransfusionRecord :formData="obj"></TransfusionRecord>
        </div>
      </collapse-component>
      <nodata-component v-else></nodata-component>
      <!-- <patient-medical-records mode="common" :medicalInfo="medicalInfo"> </patient-medical-records> -->
    </div>
    <div class="right-box">
      <Timeline
        v-if="timeLineBloodList.length"
        :timeLineList="timeLineBloodList"
        :activeTimeLine="activeTimelineBlood"
        id="zyh"
        @cardClick="timelineBloodClick"
      ></Timeline>
      <nodata-component v-else></nodata-component>
    </div>
  </div>
</template>
<script>
import PatientMedicalRecords from '../../../components/PatientMedicalRecords'
import TransfusionRecord from '../../../components/TransfusionRecord'
import CollapseComponent from '../common/CollapseComponent.vue'
import { selectDataList } from '@/service/patientView'
import { mapState } from 'vuex'
import tooHigh from '@svg/patientCommonMode/tooHigh.svg'
import tooLow from '@svg/patientCommonMode/tooLow.svg'
import positive from '@svg/patientCommonMode/positive.svg'
import NodataComponent from '../../components/common/NodataComponent.vue'
import Timeline from '../../components/common/Timeline.vue'
export default {
  name: '',
  components: {
    PatientMedicalRecords,
    CollapseComponent,
    Timeline,
    NodataComponent,
    TransfusionRecord
  },
  data() {
    return {
      tooHigh,
      tooLow,
      positive,
      activeTimelineBlood: 'all',
      timeLineBloodList: [],
      checkList: []
    }
  },
  computed: {
    ...mapState('commonMode', {
      outpatientOrHospital: state => state.outpatientOrHospital,
      dateList: state => state.dateList,
      currentHzid: state => state.currentHzid
    }),
    currentDateList() {
      let tmpObj = this.dateList.find(item => {
        return item.hzid === this.currentHzid
      })
      if (tmpObj) {
        return tmpObj.timeArr
      } else {
        return []
      }
    }
  },
  watch: {
    dateList: {
      handler: function(val) {
        // console.log("我选择日期了");
        console.log(val, 'val')
        this.getTimelineList()
      },
      deep: true
    }
  },
  created() {
    this.getTimelineList()
  },
  methods: {
    getTimelineList() {
      selectDataList({
        apiCode: 'JK1014',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: {
          hzid: this.currentHzid,
          kssj: this.currentDateList[0],
          jssj: this.currentDateList[1]
        }
      }).then(res => {
        if (res.data && res.data.length) {
          this.timeLineBloodList = [{ label: '全部', flag: true, zyh: 'all' }, ...res.data]
          console.log(this.timeLineBloodList, 'this.timeLineBloodList')
          this.timelineBloodClick(this.timeLineBloodList[0])
        } else {
          this.timeLineBloodList = []
        }
      })
    },
    changeCollapse(item) {
      this.checkList.forEach((obj, index) => {
        if (item.indexOf(index) > -1) {
          this.checkList[index].isActive = true
        } else {
          this.checkList[index].isActive = false
        }
      })
      this.checkList.splice()
    },
    getAllBloodList() {
      selectDataList({
        apiCode: 'JK1018',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: {
          hzid: this.currentHzid,
          kssj: this.currentDateList[0],
          jssj: this.currentDateList[1]
        }
      }).then(res => {
        if (res.data && res.data.length) {
          this.checkList = res.data
          this.checkList.forEach(item => {
            item.isActive = false
          })
        }
      })
    },
    getBloodList() {
      selectDataList({
        apiCode: 'JK1007',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: {
          hzid: this.currentHzid,
          zyh: this.activeTimelineBlood
        }
      }).then(res => {
        if (res.data && res.data.length) {
          this.checkList = res.data
          this.checkList.forEach(item => {
            item.isActive = false
          })
        }
      })
    },

    timelineBloodClick(item) {
      this.activeTimelineBlood = item.zyh
      if (item.flag) {
        this.getAllBloodList()
      } else {
        this.getBloodList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container-box {
  display: flex;
  height: 100%;
  flex: 1;
  .center-box {
    height: 100%;
    background-color: #fff;
    width: 100%;
    flex: 8.5;
    // flex-direction: column;
    overflow: scroll;
    padding: 10px;
    margin-right: 10px;
    .title-style {
      border-left: 4px solid #0075ff;
      padding-left: 5px;
      margin-bottom: 16px;
    }
    .collapse-title {
      display: flex;
      // padding: 10px;
      span {
        margin-right: 30px;
        font-size: 14px;
      }
    }
    .check-item {
      padding: 24px 50px;
      .label {
        color: #475e79;
        flex-shrink: 0;
        margin-right: 10px;
      }
      .value {
        color: #111;
        flex-flow: 1;
      }
    }
  }
  .right-box {
    flex: 1.5;
    background-color: #fff;
    overflow-y: scroll;
    padding: 10px;
    .timeLine-card {
      :first-child {
        color: #111;
        font-size: 14px;
      }
      .timeline-sub {
        color: #666 !important;
        font-size: 12px !important;
      }
    }
  }
}
</style>
