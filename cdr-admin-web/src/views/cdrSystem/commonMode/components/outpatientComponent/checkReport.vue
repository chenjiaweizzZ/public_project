<template>
  <div class="container-box">
    <div class="center-box">
      <div class="title-style">
        检查报告
      </div>
      <collapse-component
        v-if="timeLineCheckReportList.length && checkList.length"
        @changeCollapse="changeCollapse"
        :list="checkList"
      >
        <div slot="title" slot-scope="{ data }">
          <div class="collapse-title">
            <span v-if="data.jcxmmc">检查项目：{{ data.jcxmmc }}</span>
            <span v-if="data.jcrq">检查时间: {{ data.jcrq }}</span>
            <span v-if="data.shysqm">报告医生: {{ data.bgysqm }}</span>
            <span v-if="data.shysqm">审核医生: {{ data.shysqm }}</span>
          </div>
        </div>
        <div class="check-item" slot="content" slot-scope="{ obj }">
          <el-row>
            <el-col :span="24">
              <el-row type="flex" justify="start" class="unit">
                <div class="label">检查所见</div>
                <div class="value">{{ obj.jcsj }}</div>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-row type="flex" justify="start" class="unit">
                <div class="label">检查结论</div>
                <div class="value">{{ obj.jcjl }}</div>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </collapse-component>
      <nodata-component v-else></nodata-component>
      <!-- <patient-medical-records mode="common" :medicalInfo="medicalInfo"> </patient-medical-records> -->
    </div>
    <div class="right-box">
      <Timeline
        v-if="timeLineCheckReportList.length"
        :timeLineList="timeLineCheckReportList"
        :activeTimeLine="activeTimelineCheck"
        :id="currentOutpatientOrHospital === '0' ? 'mjzh' : 'zyh'"
        @cardClick="timelineCheckClick"
      ></Timeline>
      <nodata-component v-else></nodata-component>
    </div>
  </div>
</template>
<script>
import PatientMedicalRecords from '../../../components/PatientMedicalRecords'
import CollapseComponent from '../common/CollapseComponent.vue'
import { selectDataList } from '@/service/patientView'
import { mapState, mapMutations } from 'vuex'
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
    NodataComponent
  },
  data() {
    return {
      tooHigh,
      tooLow,
      positive,
      activeTimelineCheck: 'all',
      timeLineCheckReportList: [],
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
    },
    currentOutpatientOrHospital() {
      let tmpObj = this.outpatientOrHospital.find(item => {
        return item.hzid === this.currentHzid
      })
      // if (tmpObj) {
      return tmpObj.model
      // }
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
          this.getTimelineList()
        }
      },
      deep: true
    },
    currentHzid() {
      if (this.currentHzid) {
        console.log('我watchhhhhh')
        this.getTimelineList()
      }
    }
  },
  created() {
    this.getTimelineList()
  },

  methods: {
    ...mapMutations('commonMode', ['SETCURRENTHZID']),
    getTimelineList() {
      selectDataList({
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20013' : 'JK1012',
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
          this.timeLineCheckReportList = [
            Object.assign(
              { label: '全部', flag: true },
              this.currentOutpatientOrHospital === '0'
                ? {
                    mjzh: 'all'
                  }
                : {
                    zyh: 'all'
                  }
            ),
            ...res.data
          ]
          console.log(this.timeLineCheckReportList, 'this.timeLineCheckReportList')
          this.timelineCheckClick(this.timeLineCheckReportList[0])
        } else {
          this.timeLineCheckReportList = []
        }
      })
    },
    changeCollapse(item) {
      console.log(item, '11111')
      this.checkList.forEach((obj, index) => {
        if (item.indexOf(index) > -1) {
          this.checkList[index].isActive = true
        } else {
          this.checkList[index].isActive = false
        }
      })
      this.checkList.splice()
    },
    getAllCheckList() {
      selectDataList({
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20019' : 'JK1020',
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
        } else {
          this.checkList = []
        }
      })
    },
    getCheckList() {
      selectDataList({
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20007' : 'JK1005',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: Object.assign(
          {
            hzid: this.currentHzid
          },
          this.currentOutpatientOrHospital === '0'
            ? {
                mjzh: this.activeTimelineCheck
              }
            : {
                zyh: this.activeTimelineCheck
              }
        )
      }).then(res => {
        if (res.data && res.data.length) {
          this.checkList = res.data
          this.checkList.forEach(item => {
            item.isActive = false
          })
        } else {
          this.checkList = []
        }
      })
    },

    timelineCheckClick(item) {
      this.activeTimelineCheck = this.currentOutpatientOrHospital === '0' ? item.mjzh : item.zyh
      item.flag ? this.getAllCheckList() : this.getCheckList()
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
