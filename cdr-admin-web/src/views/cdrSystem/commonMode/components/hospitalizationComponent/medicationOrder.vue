<template>
  <div class="container-box">
    <div class="center-box">
      <div class="title-style">
        <div style="margin-right:20px">药嘱</div>
        <div style="display:flex">
          <div
            v-for="item in medicationOrderList"
            :key="item.value"
            :class="['mode-item', active === item.value ? 'mode-active' : '']"
            @click="modeChange(item)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
      <case-history-table :columns="tableColumns" :data="timeLineList.length ? tableData : []"></case-history-table>
    </div>
    <div class="right-box">
      <Timeline
        v-if="timeLineList.length"
        :timeLineList="timeLineList"
        :activeTimeLine="activeTimelineMedicationRecord"
        id="zyh"
        @cardClick="timelineMediRecordClick"
      ></Timeline>
      <nodata-component v-else></nodata-component>
    </div>
  </div>
</template>
<script>
import PatientMedicalRecords from '../../../components/PatientMedicalRecords'
import CaseHistoryTable from '../../../components/CaseHistoryTable'
import Timeline from '../../components/common/Timeline.vue'
import { mapState } from 'vuex'
import NodataComponent from '../../components/common/NodataComponent.vue'

import { selectDataList } from '@/service/patientView'
export default {
  name: '',
  components: {
    PatientMedicalRecords,
    CaseHistoryTable,
    Timeline,
    NodataComponent
  },
  data() {
    return {
      medicationOrderList: [
        { label: '全部', value: '0' },
        { label: '长期', value: '1' },
        { label: '临时', value: '2' }
      ],
      active: '0',
      timeLineList: [],
      tableColumns: [
        {
          label: '长/临',
          prop: 'longShortTerm',
          width: '90px'
        },
        {
          label: '项目内容',
          prop: 'ypmcAndMx',
          width: '300px'
        },
        {
          label: '类型',
          prop: 'yplx',
          width: '90px'
        },
        {
          label: '开始时间',
          prop: 'kssj'
        },
        {
          label: '停止时间',
          prop: 'tzsj'
        },
        {
          label: '用法',
          prop: 'yyff',
          width: '90px'
        },
        {
          label: '频率',
          prop: 'yypc',
          width: '90px'
        },
        {
          label: '每次剂量',
          prop: 'mcjl',
          width: '90px'
        },
        {
          label: '剂数',
          prop: 'js',
          width: '90px'
        }
      ],
      tableAllData: [],
      tableData: [],
      activeTimelineMedicationRecord: ''
    }
  },
  computed: {
    ...mapState('commonMode', {
      dateList: state => state.dateList,
      currentHzid: state => state.currentHzid
    }),
    currentDateList() {
      let tmpObj = this.dateList.find(item => {
        return item.hzid === this.currentHzid
      })
      if (tmpObj) {
       return  tmpObj.timeArr
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
    modeChange(item) {
      this.active = item.value
      switch (item.value) {
        case '0':
          this.tableData = this.tableAllData
          break
        case '1':
          this.tableData = this.tableAllData.filter(item => {
            return item.clbs === '1'
          })
          break
        case '2':
          this.tableData = this.tableAllData.filter(item => {
            return item.clbs === '0'
          })
          break
      }
    },
    getTimelineList() {
      selectDataList({
        apiCode: 'JK1010',
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
          this.timeLineList = res.data
          this.activeTimelineMedicationRecord = this.timeLineList[0].zyh
          this.getMedicalRecord()
        }else{
           this.timeLineList=[]
        }
      })
    },
    getMedicalRecord() {
      selectDataList({
        apiCode: 'JK1004',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: { zyh: this.activeTimelineMedicationRecord }
      }).then(res => {
        if (res.data && res.data.length) {
          this.tableAllData = res.data
          this.tableData = this.tableAllData
          this.tableData.forEach(item => {
            if (item.clbs) {
              item.longShortTerm = item.clbs === '1' ? '长期' : '临时'
            } else {
              item.longShortTerm = ''
            }
            item.ypmcAndMx = item.mx ? item.ypmc + '(' + item.mx + ')' : item.ypmc
          })
          console.log(this.tableData, '7777777this.tableData')
        }else{
          this.tableAllData=[]
          this.tableData=[]
        }
      })
    },
    timelineMediRecordClick(item) {
      console.log(item, 'medicalItem')
      this.activeTimelineMedicationRecord = item.zyh
      this.getMedicalRecord()
    }
  }
}
</script>
<style lang="scss" scoped>
.container-box {
  display: flex;
  height: 100%;
  .center-box {
    height: 100%;
    background-color: #fff;
    flex: 8.5;
    flex-direction: column;
    overflow-y: scroll;
    padding: 10px;
    margin-right: 10px;
    .title-style {
      display: flex;
      border-left: 4px solid #0075ff;
      padding-left: 5px;
      margin-bottom: 16px;
    }
    .mode-item {
      width: 64px;
      height: 24px;
      line-height: 24px;

      font-weight: 700;
      border: 1px solid #c4cbd4;
      text-align: center;
    }
    .mode-active {
      background-color: #0075ff;
      color: #fff;
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
