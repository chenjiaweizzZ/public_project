<template>
  <div class="container-box">
    <div class="center-box">
      <div class="title-style">手术记录</div>
      <collapse-component
        v-if="surgicalRecordList && timeLineSurgicalList"
        @changeCollapse="changeCollapsessjl"
        :list="surgicalRecordList.ssjl"
      >
        <div slot="title" slot-scope="{ data }">
          <div class="collapse-title">
            <span v-if="data.ssmc">手术名称: {{ data.ssmc }}</span>
            <span v-if="data.kssj">开始时间: {{ data.kssj }}</span>
            <span v-if="data.ssjb">手术级别: {{ data.ssjb }}</span>
            <span v-if="data.ssz">手术者: {{ data.ssz }}</span>
          </div>
        </div>
        <div class="inspection-item" slot="content" slot-scope="{ obj }">
          <operation-record :formData="obj" :mode="currentOutpatientOrHospital"></operation-record>
        </div>
      </collapse-component>
      <collapse-component
        v-if="surgicalRecordList.pgcssjl && timeLineSurgicalList"
        @changeCollapse="changeCollapsepgcssjl"
        :list="surgicalRecordList.pgcssjl"
      >
        <div slot="title" slot-scope="{ data }">
          <div class="collapse-title">
            <span>手术名称: 剖宫产手术</span>
            <span>开始时间: {{ data.sskssj }}</span>
            <!-- <span v-if="data.ssjb">手术级别: {{ data.ssjb }}</span> -->
            <span>手术者: {{ data.ssysqm }}</span>
          </div>
        </div>
        <div class="inspection-item" slot="content" slot-scope="{ obj }">
          <caesarean-record :formData="obj" :mode="currentOutpatientOrHospital"></caesarean-record>
        </div>
      </collapse-component>
      <collapse-component
        v-if="surgicalRecordList.mzjl && timeLineSurgicalList"
        @changeCollapse="changeCollapsemzjl"
        :list="surgicalRecordList.mzjl"
      >
        <div slot="title" slot-scope="{ data }">
          <div class="collapse-title">
            <span>麻醉方法: {{ data.mzff }}</span>
            <span>麻醉医师: {{ data.mzysqm }}</span>
            <span>开始时间: {{ data.mzkssj }}</span>
          </div>
        </div>
        <div class="inspection-item" slot="content" slot-scope="{ obj }">
          <anesthesia-record
            :formData="obj"
            :mode="currentOutpatientOrHospital"
          ></anesthesia-record>
        </div>
      </collapse-component>
      <nodata-component
        v-if="
          currentOutpatientOrHospital == '0' &&
            ((surgicalRecordList.ssjl.lengh == 0 && surgicalRecordList.mzjl.length == 0) ||
              timeLineSurgicalList.length == 0)
        "
      ></nodata-component>
      <nodata-component
        v-if="
          currentOutpatientOrHospital != '0' &&
            ((surgicalRecordList.ssjl.lengh == 0 &&
              surgicalRecordList.mzjl.length == 0 &&
              surgicalRecordList.pgcssjl.length == 0) ||
              timeLineSurgicalList.length == 0)
        "
      ></nodata-component>
    </div>
    <div class="right-box">
      <Timeline
        v-if="timeLineSurgicalList.length"
        :timeLineList="timeLineSurgicalList"
        :activeTimeLine="activeSurgicalRecord"
        :id="currentOutpatientOrHospital === '0' ? 'mjzh' : 'zyh'"
        @cardClick="timelineMediRecordClick"
      ></Timeline>
      <nodata-component v-else></nodata-component>
    </div>
  </div>
</template>
<script>
import PatientMedicalRecords from '../../../components/PatientMedicalRecords'
import CollapseComponent from '../common/CollapseComponent.vue'
import { selectDataList } from '@/service/patientView'
import { mapState } from 'vuex'
import tooHigh from '@svg/patientCommonMode/tooHigh.svg'
import tooLow from '@svg/patientCommonMode/tooLow.svg'
import positive from '@svg/patientCommonMode/positive.svg'
import Timeline from '../../components/common/Timeline.vue'
import OperationRecord from '../../../components/OperationRecord.vue'
import NodataComponent from '../../components/common/NodataComponent.vue'
import AnesthesiaRecord from '../../../components/paperwork/DocumMZJL.vue'
import CaesareanRecord from '../../../components/paperwork/DocumPGCSSJL.vue'
export default {
  name: '',
  components: {
    PatientMedicalRecords,
    CollapseComponent,
    Timeline,
    OperationRecord,
    NodataComponent,
    AnesthesiaRecord,
    CaesareanRecord
  },
  data() {
    return {
      tooHigh,
      tooLow,
      positive,
      activeSurgicalRecord: 'all',
      timeLineSurgicalList: [],
      surgicalRecordList: {
        ssjl: [],
        mzjl: [],
        pgcssjl: []
      }
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
      return tmpObj.model
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
    getTimelineList() {
      selectDataList({
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20014' : 'JK1013',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: {
          hzid: this.currentHzid,
          kssj: this.currentDateList[0],
          jssj: this.currentDateList[1]
        }
      }).then(res => {
        console.log(res)
        if (res.data && res.data.length != 0) {
          this.timeLineSurgicalList = [{ label: '全部', flag: true, mjzh: 'all' }, ...res.data]
          console.log(this.timeLineSurgicalList)
          this.activeSurgicalRecord =
            this.currentOutpatientOrHospital === '0'
              ? this.timeLineSurgicalList[0].mjzh
              : this.timeLineSurgicalList[0].zyh
          this.timelineMediRecordClick(this.timeLineSurgicalList[0], true)
        } else {
          this.timeLineSurgicalList = []
          this.surgicalRecordList = { ssjl: [], mzjl: [], pgcssjl: [] }
          console.log(this.timeLineSurgicalList)
        }
      })
    },
    changeCollapsessjl(item) {
      console.log(item, '11111')
      if (this.surgicalRecordList.ssjl && this.surgicalRecordList.ssjl.length) {
        this.handleCollapseListIsActive(this.surgicalRecordList.ssjl, item)
        this.surgicalRecordList.ssjl.splice()
      }
    },
        changeCollapsepgcssjl(item) {
      if (this.surgicalRecordList.pgcssjl && this.surgicalRecordList.pgcssjl.length) {
        this.handleCollapseListIsActive(this.surgicalRecordList.pgcssjl, item)
        this.surgicalRecordList.pgcssjl.splice()
      }
    },
        changeCollapsemzjl(item) {
      if (this.surgicalRecordList.mzjl && this.surgicalRecordList.mzjl.length) {
        this.handleCollapseListIsActive(this.surgicalRecordList.mzjl, item)
        this.surgicalRecordList.mzjl.splice()
      }
    },
    handleCollapseListIsActive(list, allList) {
      console.log(allList,"allList");
      list.forEach((obj, index) => {
        if (allList.indexOf(index) > -1) {
          obj.isActive = true
        } else {
          obj.isActive = false
        }
      })
    },

    getSurgicalList() {
      selectDataList({
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20022' : 'JK5002',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: Object.assign(
          {
            hzid: this.currentHzid
          },
          this.currentOutpatientOrHospital === '0'
            ? {
                mjzh: this.activeSurgicalRecord
              }
            : {
                zyh: this.activeSurgicalRecord
              }
        )
      }).then(res => {
        if (res.data) {
          this.surgicalRecordList = res.data
          if (this.surgicalRecordList.ssjl) {
            this.surgicalRecordList.ssjl.forEach(item => {
              item.isActive = false
            })
          }
          if (this.surgicalRecordList.mzjl) {
            this.surgicalRecordList.mzjl.forEach(item => {
              item.isActive = false
            })
          }
          if (this.surgicalRecordList.pgcssjl) {
            this.surgicalRecordList.pgcssjl.forEach(item => {
              item.isActive = false
            })
          }
        } else {
          this.surgicalRecordList = {}
          // this.surgicalRecordList.ssjl = [];
          // this.surgicalRecordList.mzjl = [];
          // this.surgicalRecordList.pgcssjl = [];
        }
      })
    },
    getAllSurgicalList() {
      selectDataList({
        // apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20020' : 'JK1019',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20024' : 'JK5035',
        parameters:
          {
            hzid: this.currentHzid,
            kssj: this.currentDateList[0],
            jssj: this.currentDateList[1]
          }
          
      }).then(res => {
        if (res.data) {
          this.surgicalRecordList = res.data
          console.log(this.surgicalRecordList)
          if (this.surgicalRecordList.ssjl) {
            this.surgicalRecordList.ssjl.forEach(item => {
              item.isActive = false
            })
          }
          if (this.surgicalRecordList.mzjl) {
            this.surgicalRecordList.mzjl.forEach(item => {
              item.isActive = false
            })
          }
          if (this.surgicalRecordList.pgcssjl) {
            this.surgicalRecordList.pgcssjl.forEach(item => {
              item.isActive = false
            })
          }
        } else {
          this.surgicalRecordList = {}
        }
      })
    },

    timelineMediRecordClick(item, flag) {
      if (
        !flag &&
        this.activeSurgicalRecord ===
          (this.currentOutpatientOrHospital === '0' ? item.mjzh : item.zyh)
      )
        return
      this.activeSurgicalRecord = this.currentOutpatientOrHospital === '0' ? item.mjzh : item.zyh
      item.flag ? this.getAllSurgicalList() : this.getSurgicalList()
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
