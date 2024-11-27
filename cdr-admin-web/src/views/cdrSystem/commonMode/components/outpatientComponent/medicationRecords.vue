<template>
  <div class="container-box">
    <div class="center-box">
      <div class="title-style">
        用药记录
      </div>
      <collapse-component
        v-if="realUseList.length && timeLineMedicalRecord.length"
        @changeCollapse="changeCollapse"
        :list="realUseList"
      >
        <div slot="title" slot-scope="{ data }">
          <div class="collapse-title">
            <div class="collapse-ywmc">
              <div style="margin-right:9px">药品名称：{{ data.ypmc }}</div>
              <div v-if="data.yplx === '西药'" class="tag-style">西药</div>
              <div v-else class="tagZn-style">中药</div>
            </div>

            <span style="margin-right:66px">用法: {{ data.yyff }}</span>
            <span v-if="data.yplx === '中药' && data.mx">明细: {{ data.mx }}</span>
          </div>
        </div>
        <div slot="content" slot-scope="{ obj }">
          <div class="medical-box">
            <div v-for="item in obj.list" :key="item.index" class="medical-item">
              <div>
                <span>就诊时间</span>
                <span>{{ item.jzsj ? item.jzsj.split(' ')[0] : '' }}</span>
              </div>
              <div>
                <span>{{ item.yplx === '西药' ? '规格' : '剂数' }}</span>
                <span v-if="item.gg || item.js">{{
                  item.yplx === '西药' ? item.gg : item.js + '剂'
                }}</span>
              </div>
              <div v-if="item.yplx === '西药'">
                <span>每次剂量</span>
                <span>{{ item.mcjl }}</span>
              </div>
              <div class="medical-itemLast">
                <div>
                  <span>频率</span>
                  <span>{{ item.yypc }}</span>
                </div>
                <div>
                  <span>天数</span>
                  <span>{{ item.ts }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </collapse-component>
      <nodata-component v-else></nodata-component>
    </div>
    <div class="right-box">
      <Timeline
        v-if="timeLineMedicalRecord.length"
        :timeLineList="timeLineMedicalRecord"
        :activeTimeLine="activeTimelineMedicalRecord"
        id="mjzh"
        @cardClick="timelineMediRecordClick"
      ></Timeline>
      <nodata-component v-else></nodata-component>
    </div>
  </div>
</template>
<script>
import PatientMedicalRecords from '../../../components/PatientMedicalRecords'
import CollapseComponent from '../common/CollapseComponent.vue'
import { mapState } from 'vuex'
import { selectDataList } from '@/service/patientView'
import Timeline from '../../components/common/Timeline.vue'
import NodataComponent from '../../components/common/NodataComponent.vue'

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
      realUseList: [],
      timeLineMedicalRecord: [],
      activeTimelineMedicalRecord: ''
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
          this.getTimelineList()
        }
      },
      deep: true
    },
    '$route.query'() {
      if (this.$route.query.hzid) {
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
        apiCode: 'JK20010',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: {
          hzid: this.currentHzid,
          kssj: this.currentDateList.length ? this.currentDateList[0] : undefined,
          jssj: this.currentDateList.length ? this.currentDateList[1] : undefined
        }
      }).then(res => {
        console.log(res, 'ressss')
        if (res.data && res.data.length) {
          this.timeLineMedicalRecord = [{ label: '全部', flag: true, mjzh: 'all' }, ...res.data]
          this.activeTimelineMedicalRecord = this.timeLineMedicalRecord[0].mjzh
          // this.getMediclRecordList()
          this.timelineMediRecordClick(this.timeLineMedicalRecord[0], true)
        } else {
          this.timeLineMedicalRecord = []
        }
      })
    },
    changeCollapse(item) {
      console.log(item, '11111')
      this.realUseList.forEach((obj, index) => {
        if (item.indexOf(index) > -1) {
          this.realUseList[index].isActive = true
        } else {
          this.realUseList[index].isActive = false
        }
      })
      this.realUseList.splice()
    },
    getMediclRecordList() {
      selectDataList({
        apiCode: 'JK20004',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: {
          mjzh: this.activeTimelineMedicalRecord
        }
      }).then(res => {
        console.log(res, 'resssshhh')
        if (res.data && res.data.length) {
          this.realUseList = res.data
          this.realUseList.forEach(item => {
            item.isHighLight = false
          })
        }
      })
    },
    getAllMediclList() {
      selectDataList({
        apiCode: 'JK20016',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: {
          hzid: this.currentHzid,
          kssj: this.currentDateList.length ? this.currentDateList[0] : undefined,
          jssj: this.currentDateList.length ? this.currentDateList[1] : undefined
        }
      }).then(res => {
        console.log(res, 'resssshhh')
        if (res.data && res.data.length) {
          this.realUseList = res.data
          this.realUseList.forEach(item => {
            item.isHighLight = false
          })
        }
      })
    },
    timelineMediRecordClick(item, flag) {
      if (!flag && this.activeTimelineMedicalRecord === item.mjzh) return
      this.activeTimelineMedicalRecord = item.mjzh
      item.flag ? this.getAllMediclList() : this.getMediclRecordList()
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
    flex: 8.5;
    // width: 100%;
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
      .collapse-ywmc {
        display: flex;
        margin-right: 30px;
        align-items: center;
        .tagCommon-style {
          width: 40px;
          height: 20px;
          line-height: 20px;
          border-radius: 10px;
          text-align: center;
        }
        .tag-style {
          background-color: #e9f7f0;
          color: #00982d;
          @extend .tagCommon-style;
        }
        .tagZn-style {
          line-height: 20px;
          background-color: #e8f2fd;
          color: #0075ff;
          @extend .tagCommon-style;
        }
      }
    }
    .medical-box {
      display: flex;
      flex-wrap: wrap;
      padding: 16px 16px 6px 16px;
      .medical-item {
        width: 254px;
        border: 1px solid #d7dae0;
        margin-right: 10px;
        margin-bottom: 10px;
        padding: 8px;
        font-size: 14px;
        span:first-child {
          color: #475e79;
          margin-right: 10px;
        }
        span:second-child {
          color: #111111;
        }
        .medical-itemLast {
          display: flex;
          justify-content: space-between;
        }
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
