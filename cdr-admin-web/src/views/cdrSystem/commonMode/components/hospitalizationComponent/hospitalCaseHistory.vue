<template>
  <div class="container-box">
    <div class="center-box">
      <div>
        <div class="title-style">
          病历
        </div>
        <navigation
          v-if="list.length && timeLineList.length"
          :list="list"
          height="calc(100vh - 265px)"
          :activeIndex="activeNavigation"
          @seletedData="seletedData"
        >
          <div style="padding:24px 60px">
            <keep-alive>
              <component v-bind:is="currentCaseComponent" :formData="formData"></component>
            </keep-alive>
          </div>
        </navigation>
        <div v-else style="padding-top:10%">
          <nodata-component></nodata-component>
        </div>
      </div>
    </div>
    <div class="right-box">
      <!-- {{ activeTimeLine }}1111 -->
      <Timeline
        v-if="timeLineList.length"
        :timeLineList="timeLineList"
        :activeTimeLine="activeTimelineHosCase"
        id="zyh"
        @cardClick="timelineHospitalCaseClick"
      ></Timeline>
      <nodata-component v-else></nodata-component>
    </div>
  </div>
</template>
<script>
import InhospitalAbstract from '../../../components/InhospitalAbstract'
import MedicalRecordHomePage from '../../../components/paperwork/Docum_BASY'
import navigation from '../../../components/navigation'
import Timeline from '../../components/common/Timeline.vue'
import { selectDataList } from '@/service/patientView'
import NodataComponent from '../../components/common/NodataComponent.vue'
import _ from '@/utils'
import { mapState } from 'vuex'
import DischargeAbstract from '../../../components/DischargeAbstract.vue'
export default {
  name: '',
  components: {
    // PatientMedicalRecords,
    InhospitalAbstract,
    MedicalRecordHomePage,
    navigation,
    Timeline,
    DischargeAbstract,
    NodataComponent
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
    currentHzid() {
      if (this.currentHzid) {
        console.log('我watchhhhhh')
        this.getTimeLine()
      }
    }
  },
  data() {
    return {
      activeTimelineHosCase: '',
      timeLineList: [],
      activeNavigation: 0,
      list: [],
      currentCaseComponent: 'InhospitalAbstract',
      formData: {}
    }
  },
  created() {
    this.getTimeLine()
  },
  methods: {
    getTimeLine() {
      selectDataList({
        apiCode: 'JK1009',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: {
          hzid: this.currentHzid,
          kssj: this.currentDateList ? this.currentDateList[0] : undefined,
          jssj: this.currentDateList ? this.currentDateList[1] : undefined
        }
      }).then(res => {
        if (res.data && res.data.length) {
          this.timeLineList = res.data
          this.activeTimelineHosCase = this.timeLineList[0].zyh
          this.getAdmissionSummary()
        } else {
          this.timeLineList = []
        }
      })
    },
    //获取入院记录和出院小结
    getAdmissionSummary() {
      selectDataList({
        apiCode: 'JK1016',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: { zyh: this.activeTimelineHosCase }
      }).then(res => {
        if (
          (res.data.ryjl && res.data.ryjl.length) ||
          (res.data.cyxj && res.data.cyxj.length) ||
          (res.data.basy && res.data.basy.length)
        ) {
          if (res.data.ryjl && res.data.ryjl.length) {
            this.list = [
              { title: '入院记录', time: res.data.ryjl[0].rysj, content: { ...res.data.ryjl[0] } }
            ]
          }
          if (res.data.cyxj && res.data.cyxj.length) {
            this.list.push({
              title: '出院小结',
              time: res.data.cyxj[0].cysj,
              content: { ...res.data.cyxj[0] }
            })
          }
          if (res.data.basy && res.data.basy.length) {
            this.list.push({
              title: '病案首页',
              time: res.data.basy[0].rysj,
              content: { ...res.data.basy[0] }
            })
          }
          this.seletedData({ index: 0, item: this.list[0] })
          console.log(this.list, '77777')
          this.formData = _.deepCopy(this.list[0].content, {})
        } else {
          this.list = []
        }
        console.log(this.list, 'listlist', this.formData)
      })
    },
    seletedData(item) {
      console.log(item, 'itemmmmm')
      this.activeNavigation = item.index
      // this.formData =
      //   this.activeNavigation === 0
      //     ? _.deepCopy(this.list[0].content, {})
      //     : _.deepCopy(this.list[1].content, {})
      // console.log(this.formData, 'formData')
      // this.currentCaseComponent =
      //   this.activeNavigation === 0 ? 'InhospitalAbstract' : 'DischargeAbstract'
      switch (this.activeNavigation) {
        case 0:
          this.formData = _.deepCopy(this.list[0].content, {})
          this.currentCaseComponent = 'InhospitalAbstract'
          break
        case 1:
          this.formData = _.deepCopy(this.list[1].content, {})
          this.currentCaseComponent = 'DischargeAbstract'
          break
        case 2:
          this.formData = _.deepCopy(this.list[2].content, {})
          if (this.formData.zdjl.length < 5) {
            for (let i = this.formData.zdjl.length; i < 5; i++) {
              this.formData.zdjl.push({
                jbbm: '',
                rybq: '',
                sfzzd: '否',
                zdmc: ''
              })
            }
          }
          this.currentCaseComponent = 'MedicalRecordHomePage'
          break
      }
      console.log(this.currentCaseComponent, 'this.currentCaseComponent', this.formData)
    },
    timelineHospitalCaseClick(item) {
      if (this.activeTimelineHosCase === item.zyh) return
      console.log('wwwwwww', this.list)
      this.activeNavigation = 0
      // this.$set(this,'activeNavigation',0)
      this.activeTimelineHosCase = item.zyh
      this.getAdmissionSummary()
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
