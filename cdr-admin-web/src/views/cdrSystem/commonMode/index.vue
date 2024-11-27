<template>
  <div class="common-container">
    <!-- 患者信息头部 -->
    <div class="patient-info">
      <patient-header ref="patientInfoRef" @choicePatient="choicePatientChange"></patient-header>
    </div>
    <!-- 中间切换 -->
    <div class="middle-switch">
      <middle-switch
        :middleSwitchList="middleSwitchList"
        :middleSwitchActive="middleSwitchActive"
        @modeChange="modeChange"
      ></middle-switch>
    </div>
    <!-- 主体部分 -->
    <div class="main-container">
      <keep-alive>
        <component v-bind:is="currentTabComponent"></component>
      </keep-alive>
    </div>
    <img
      class="fixed-bottom"
      draggable="true"
      @click="goTo360view"
      src="@svg/360shitu.svg"
      alt=""
      @dragend="dragendImg($event)"
      @dragstart="dragstartImg($event)"
    />
  </div>
</template>

<script>
import PatientHeader from '../components/PatientHeader.vue'
import CollapseComponent from './components/common/CollapseComponent.vue'
import hospitalizationIndex from './hospitalizationIndex.vue'
import PatientMedicalRecords from '../components/PatientMedicalRecords'
import outpatientIndex from './outpatientIndex.vue'
import LeftNav from './components/common/LeftNav.vue'
import MiddleSwitch from './components/common/MiddleSwitch'
import { mapState, mapMutations } from 'vuex'
import _ from '@/utils'
export default {
  components: {
    MiddleSwitch,
    LeftNav,
    PatientHeader,
    hospitalizationIndex,
    outpatientIndex,
    CollapseComponent,
    PatientMedicalRecords
  },
  data() {
    return {
      leftNavActive: '0', //门诊左侧导航
      leftNavHosipitalActive: '0', //住院左侧导航
      middleSwitchActive: '0',
      currentTabComponent: 'outpatientIndex',
      collapseList: [],
      centerTitle: '病历',
      dragData: {
        x: 0,
        y: 0
      },
      middleSwitchList: [
        { label: '门诊', value: '0' },
        { label: '住院', value: '1' }
      ]
    }
  },
  computed: {
    ...mapState('commonMode', {
      outpatientOrHospital: state => state.outpatientOrHospital,
      dateList: state => state.dateList
    })
  },
  watch: {
    '$route.query'() {
      if (this.$route.query.hzid) {
        console.log('我watchhhhhh')
        this.SETCURRENTHZID(this.$route.query.hzid)
      }
    }
  },
  created() {
    console.log('我indexcreated')
    console.log(this.$route, 'route')
    //更新患者id
    if (this.$route.query.hzid) {
      this.SETCURRENTHZID(this.$route.query.hzid)
    }
    //第一次进来的时候更新门诊住院的切换状态
    //为什么要写在父组件？因为middleSwitchActive通过父组件传给子组件
    //TODO 在关闭当前患者的视图标签的时候，是否可以清空当前患者相关的commonMode，不清空会导致，关闭标签以后在从患者列表打开相同患者，会保持原有的状态
    //因为在created的时候判断有当前患者的状态数据，就会保持对应状态数据。如下
    // let index = this.outpatientOrHospital.findIndex(i => {
    //   return i.hzid === this.$route.query.hzid
    // })
    // if (index > -1) {
    //   this.modeChange({value:'0'})
    // } else {
    //   let obj = {
    //     hzid: this.$route.query.hzid,
    //     model: '0'
    //   }
    //   let newVal = _.deepCopy(this.outpatientOrHospital, [])
    //   newVal.push(obj)
    //   this.SETOUTPATIENTORHOSPITAL(newVal)
    // }
  },
  methods: {
    ...mapMutations('commonMode', ['SETDATELIST', 'SETOUTPATIENTORHOSPITAL', 'SETCURRENTHZID']),
    goTo360view() {
      this.$router.push({
        name: 'panoramicVIew',
        query: { ...this.$route.query }
      })
    },
    dragstartImg(e) {
      this.dragData.x = e.screenX
      console.log(e)
    },
    dragendImg(e) {
      console.log(e)
      if (e.screenX - this.dragData.x > 20) {
        e.target.style.right = '20px'
        e.target.style.left = ''
      } else if (e.screenX - this.dragData.x < -20) {
        e.target.style.left = '20px'
        e.target.style.right = ''
      }
    },
    leftNavClick(item) {
      this.centerTitle = item.label
      if (this.middleSwitchActive === '0') {
        this.leftNavActive = item.value
      } else {
        this.leftNavHosipitalActive = item.value
      }
    },
    choicePatientChange(item) {
      this.$router.push({
        name: 'commonMode',
        query: {
          ...item
        }
      })
      this.$refs.patientInfoRef.getUserInfo() //TODO
      location.reload()
    },
    modeChange(item) {
      this.middleSwitchActive = item.value
      if (this.middleSwitchActive === '0') {
        this.currentTabComponent = 'outpatientIndex'
      } else {
        this.currentTabComponent = 'hospitalizationIndex'
      }
      console.log(this.middleSwitchActive, 'middleSwitchActive')
    }
  }
}
</script>
<style lang="scss" scoped>
.common-container {
  padding: 0px 10px;
  .patient-info {
    background-color: #fff;
    // height: 74px;
    margin-top: 10px;
  }
  .middle-switch {
    background-color: #fff;
    padding: 12px 10px;
    margin-top: 10px;
  }
  .main-container {
    display: flex;
    margin-top: 10px;
    background-color: #e5e5e5;
    height: calc(100vh - 80px - 30px - 52px - 40px);
  }
}

::v-deep.el-timeline {
  padding-left: 10px;
}
::v-deep .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
  display: block;
}
::v-deep .el-timeline-item__node--normal {
  width: 7px;
  height: 7px;
  left: 1px;
}

::v-deep .el-date-editor .el-range__icon {
  line-height: 22px;
}
::v-deep .el-date-editor .el-range-separator {
  line-height: 22px;
  padding: 0px;
}

::v-deep .el-date-editor .el-range__close-icon {
  line-height: 22px;
}
.fixed-bottom {
  position: fixed;
  bottom: 30px;
  right: 20px;
  cursor: pointer;
}
</style>
