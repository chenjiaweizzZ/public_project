<template>
  <div class="container-box">
    <div class="center-box">
      <div class="title-style">
        诊断
      </div>
      <case-history-table
        :columns="getTableColumns()"
        :data="timeLineList.length ? tableData : []"
      ></case-history-table>
    </div>
    <div class="right-box">
      <Timeline
        v-if="timeLineList.length"
        :timeLineList="timeLineList"
        :id="currentOutpatientOrHospital === '0' ? 'mjzh' : 'zyh'"
        :activeTimeLine="activeTimelineDiagnosis"
        @cardClick="timelineOutpatientDiagnosis"
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
      activeTimelineDiagnosis: '',
      tableColumns: [
        {
          label: '诊断名称',
          prop: 'zdmc'
        },
        {
          label: '主诊断',
          prop: 'sfzzd'
        },
        {
          label: '诊断时间',
          prop: 'zdsj'
        }
      ],
      tableData: []
    }
  },
  computed: {
    ...mapState('commonMode', {
      dateList: state => state.dateList,
      outpatientOrHospital: state => state.outpatientOrHospital,
      currentHzid: state => state.currentHzid
    }),
    currentOutpatientOrHospital() {
      let tmpObj = this.outpatientOrHospital.find(item => {
        return item.hzid === this.currentHzid
      })
      // if (tmpObj) {
      return tmpObj.model
      // }
    },

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
    getTableColumns() {
      if (this.currentOutpatientOrHospital === '0') {
        return this.tableColumns
      } else {
        let tmp = _.deepCopy(this.tableColumns, [])
        tmp.splice(1, 0, {
          label: '诊断类型',
          prop: 'zdlx'
        })
        return tmp
      }
    },
    getTimeLine() {
      selectDataList({
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20011' : 'JK1015',
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
          this.timeLineList = [
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
          console.log(this.timeLineList, '1122222')
          this.activeTimelineDiagnosis = this.timeLineList[0].mjzh
          this.timelineOutpatientDiagnosis(this.timeLineList[0])
        } else {
          this.timeLineList = []
        }
      })
    },
    getAllDiagnosis() {
      selectDataList({
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20017' : 'JK1017',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: {
          hzid: this.currentHzid,
          kssj: this.currentDateList[0],
          jssj: this.currentDateList[1]
        }
      }).then(res => {
        this.tableData = res.data
        console.log(this.tableData, 'this.tableData')
        // this.getTimeLine(true)
      })
    },
    getDiagnosis() {
      selectDataList({
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20005' : 'JK1008',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: Object.assign(
          {},
          this.currentOutpatientOrHospital === '0'
            ? {
                mjzh: this.activeTimelineDiagnosis
              }
            : {
                zyh: this.activeTimelineDiagnosis
              }
        )
      }).then(res => {
        this.tableData = res.data
        console.log(this.tableData, 'this.tableData')
      })
    },
    timelineOutpatientDiagnosis(item) {
      this.activeTimelineDiagnosis = this.currentOutpatientOrHospital === '0' ? item.mjzh : item.zyh
      console.log(this.activeTimelineDiagnosis, 'activeTimelineDiagnosis')
      if (item.flag) {
        this.getAllDiagnosis()
      } else {
        this.getDiagnosis()
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
