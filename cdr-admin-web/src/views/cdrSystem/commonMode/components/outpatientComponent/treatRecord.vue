<template>
  <div class="container-box">
    <div class="center-box">
      <div class="title-style">
        治疗
      </div>
      <case-history-table v-if="timeLineList.length&&tableData.length" :columns="tableColumns" :data="tableData"></case-history-table>
        <nodata-component v-else></nodata-component>
    </div>
    <div class="right-box">
      <Timeline
        v-if="timeLineList.length"
        :timeLineList="timeLineList"
        id="mjzh"
        :activeTimeLine="activeTimelineTreat"
        @cardClick="timelineOutpatientTreat"
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
import CaseHistoryTable from '../../../components/CaseHistoryTable'
import PatientMedicalRecords from '../../../components/PatientMedicalRecords'
import { selectDataList } from '@/service/patientView'
export default {
  name: '',
  components: {
    PatientMedicalRecords,
    Timeline,
    NodataComponent,
    CaseHistoryTable
  },
  data() {
    return {
      timeLineList: [],
      activeTimelineTreat: '',
      medicalInfo: {},
      tableColumns: [
        {
          label: '操作名称',
          prop: 'czmc'
        },
        {
          label: '部位',
          prop: 'czmbbwmc'
        },
        {
          label: '介入物',
          prop: 'jrwmc'
        },
        {
          label: '操作时间',
          prop: 'czrqsj'
        }
      ],
      tableData: []
    }
  },
  computed: {
    ...mapState('commonMode', {
      dateList: state => state.dateList,
      currentHzid:state => state.currentHzid
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
  },
  activated() {
    this.getTimeLine()
  },
  methods: {
    getTimeLine() {
      selectDataList({
        apiCode: 'JK20009',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: { hzid: this.currentHzid, kssj: this.currentDateList.length ? this.currentDateList[0] : undefined, jssj: this.currentDateList.length ? this.currentDateList[1] : undefined,}
      }).then(res => {
        if (res.data && res.data.length) {
          this.timeLineList = [{ label: '全部', flag: true,mjzh:"all" }, ...res.data]
          console.log(this.timeLineList, '1122222')
          this.activeTimelineTreat = this.timeLineList[0].mjzh
          this.timelineOutpatientTreat(this.timeLineList[0])

        } else {
          this.timeLineList = []
        }
      })
    },
    getAllTreat() {
      selectDataList({
        apiCode: 'JK20015',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: { hzid: this.currentHzid, kssj: this.currentDateList.length ? this.currentDateList[0] : undefined, jssj: this.currentDateList.length ? this.currentDateList[1] : undefined, }
      }).then(res => {
        this.tableData = res.data
        // this.getTimeLine(true)
      })
    },
    getTreat() {
      selectDataList({
        apiCode: 'JK20003',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: { mjzh: this.activeTimelineTreat }
      }).then(res => {
        this.tableData = res.data
      })
    },
    timelineOutpatientTreat(item) {
      if (item.flag) {
        this.getAllTreat()
      } else {
        this.activeTimelineTreat = item.mjzh
        this.getTreat()
      }
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
