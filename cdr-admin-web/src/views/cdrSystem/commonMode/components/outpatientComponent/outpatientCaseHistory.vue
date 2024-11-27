<template>
  <div class="container-box">
    <div class="center-box">
      <div class="title-style">
        病历
      </div>
      <patient-medical-records
        v-if="timeLineList.length && !showLeftNodata"
        mode="common"
        :medicalInfo="medicalInfo"
      >
      </patient-medical-records>
      <nodata-component v-else></nodata-component>
    </div>
    <div class="right-box">
      <Timeline
        v-if="timeLineList.length"
        :timeLineList="timeLineList"
        id="mjzh"
        :activeTimeLine="activeTimelineOutpatientHistory"
        @cardClick="timelineOutpatientCasehistoryClick"
      ></Timeline>
      <nodata-component v-else></nodata-component>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import _ from '@/utils'
import Timeline from '../../components/common/Timeline.vue'
import NodataComponent from '../../components/common/NodataComponent.vue'
import PatientMedicalRecords from '../../../components/PatientMedicalRecords'
import { selectDataList } from '@/service/patientView'
export default {
  name: '',
  components: {
    PatientMedicalRecords,
    Timeline,
    NodataComponent
  },
  data() {
    return {
      timeLineList: [],
      activeTimelineOutpatientHistory: '',
      medicalInfo: {},
      showLeftNodata: false
    }
  },
  computed: {
    ...mapState('commonMode', {
      dateList: state => state.dateList,
      currentHzid: state => state.currentHzid,
      dateList: state => state.dateList
    }),
            currentDateList() {
      let tmpObj = this.dateList.find(item => {
        return item.hzid === this.currentHzid
      })
      if (tmpObj) {
        return this.dateList.find(item => {
          return item.hzid === this.currentHzid
        }).timeArr
      } else {
        return []
      }
    }
  },
  watch: {
    dateList: {
      handler: function(val, oldVal) {
        let num = val.findIndex(item => {
          return item.hzid === this.$route.query.hzid
        })
        console.log('我当前的日期变了', val, oldVal)

        if (val[num].timeArr != oldVal[num].timeArr) {
          this.getTimeLine()
        }
      },
      deep: true
    },
    //需要监听当前患者id来调接口获取数据，否则就是上一个的数据
    //todo 频繁调接口真的好吗
    currentHzid() {
      if (this.currentHzid) {
        console.log('我watchhhhhh')
        this.getTimeLine()
      }
    }
  },
  created() {
    this.getTimeLine()
  },
  methods: {
    getTimeLine() {
      selectDataList({
        apiCode: 'JK20002',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: {
          hzid: this.currentHzid,
          kssj: this.currentDateList.length ? this.currentDateList[0] : undefined,
          jssj: this.currentDateList.length ? this.currentDateList[1] : undefined,
        }
      }).then(res => {
        this.timeLineList = res.data
        if (this.timeLineList && this.timeLineList.length) {
          this.activeTimelineOutpatientHistory = this.timeLineList[0].mjzh
          this.getMedicalCaseHhistory()
        } else {
          this.timeLineList = res.data
        }
      })
    },
    getMedicalCaseHhistory() {
      selectDataList({
        apiCode: 'JK20001',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: { mjzh: this.activeTimelineOutpatientHistory }
      }).then(res => {
        console.log(res, 'yyyyy')
        if (res.data && res.data.length) {
          this.showLeftNodata = false
          this.medicalInfo = _.deepCopy(res.data[0], {})
        } else {
          this.showLeftNodata = true
        }
      })
    },
    timelineOutpatientCasehistoryClick(item) {
      if (this.activeTimelineOutpatientHistory === item.mjzh) return
      this.activeTimelineOutpatientHistory = item.mjzh
      this.getMedicalCaseHhistory()
    }
  }
}
</script>
<style lang="scss" scoped>
.container-box {
  display: flex;
  height: 100%;
  .center-box {
    background-color: #fff;
    flex: 8.5;
    flex-direction: column;
    overflow: scroll;
    padding: 10px;
    margin-right: 10px;
    .title-style {
      border-left: 4px solid #0075ff;
      padding-left: 5px;
      margin-bottom: 16px;
    }
    .patient-medicalBox {
      height: 100%;
      // border: 1px solid #e6e6e6;
      // padding: 24px 60px 30px 60px;
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
