<template>
  <div class="container-box">
    <div class="center-box">
      <div class="title-style">
        检验报告
      </div>
      <collapse-component
        :list="inspectionList"
        @changeCollapse="changeCollapse"
        v-if="timeLineInspecReportList.length && inspectionList.length"
      >
        <div slot="title" slot-scope="{ data }">
          <div class="collapse-title">
            <span v-if="data.list[0].jyxm">检验项目：{{ data.list[0].jyxm }}</span>
            <span v-if="data.list[0].jyrq">检验时间: {{ data.list[0].jyrq }}</span>
            <span v-if="data.list[0].bgys">报告医生: {{ data.list[0].bgys }}</span>
            <span v-if="data.list[0].shys">审核医生: {{ data.list[0].shys }}</span>
          </div>
        </div>
        <div class="inspection-item" slot="content" slot-scope="{ obj }">
          <el-table
            border
            stripe
            :ref="'tableRef' + obj.jyxmid"
            highlight-current-row
            @current-change="handleCurrentChange"
            :data="obj.list"
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              prop="xmmc"
              header-align="center"
              align="left"
              label="项目名称"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="jyjg"
              header-align="center"
              align="left"
              label="检验结果"
              width="180"
            >
            </el-table-column>
            <el-table-column prop="bj" header-align="center" align="left" label="标记">
              <template slot-scope="scope">
                <img v-if="scope.row.bj === 'H'" :src="tooHigh" />
                <img v-else-if="scope.row.bj === 'L'" :src="tooLow" />
                <img v-else-if="scope.row.bj === '1'" :src="positive" />
              </template>
            </el-table-column>
            <el-table-column prop="dw" header-align="center" align="left" label="单位">
            </el-table-column>
            <el-table-column prop="ckz" header-align="center" align="left" label="参考值">
            </el-table-column>
          </el-table>
          <div
            class="abnormal-project"
            :style="{ height: obj.list.length ? `${(obj.list.length + 1) * 28}px` : '' }"
          >
            <div class="abnormal-title">
              异常项目
            </div>
            <div class="abnormal-content">
              <div
                v-for="(item, index) in filterAbnormal(obj.list)"
                :key="index"
                @click="abnormalClick(item, obj)"
              >
                <span class="abnormal-name">{{ item.xmmc }}</span>
                <div class="abnormal-img">
                  <img v-if="item.bj === 'H'" :src="tooHigh" />
                  <img v-else-if="item.bj === 'L'" :src="tooLow" />
                  <img v-else-if="item.bj === '1'" :src="positive" />
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
        v-if="timeLineInspecReportList.length"
        :timeLineList="timeLineInspecReportList"
        :activeTimeLine="activeTimelineInspectionRecord"
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
import _ from '@/utils'
import tooLow from '@svg/patientCommonMode/tooLow.svg'
import positive from '@svg/patientCommonMode/positive.svg'
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
      tooHigh,
      tooLow,
      positive,
      activeTimelineInspectionRecord: '',
      timeLineInspecReportList: [],
      inspectionList: [],
      randomKey: '',
      currentRow: null
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
    abnormalClick(item, obj) {
      console.log(item, 'abnormalClick')
      let index = this.inspectionList.indexOf(obj)
      this.inspectionList[index].list.forEach(obj => {
        obj.isHighLight = false
      })
      console.log('vvv1111', this.inspectionList)
      let listIndex = this.inspectionList[index].list.indexOf(item)
      this.inspectionList[index].list[listIndex].isHighLight = true
      this.setCurrent(this.inspectionList[index].list[listIndex], index)
      console.log(index, listIndex, 'vvv', this.inspectionList)
    },
    setCurrent(row, index) {
      let str = 'tableRef' + this.inspectionList[index].jyxmid
      console.log(str, 'strrr', this.$refs.str)
      this.$refs[str].setCurrentRow(row)
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    getTimelineList() {
      selectDataList({
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20012' : 'JK1011',
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
          this.timeLineInspecReportList = [
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
          this.activeTimelineInspectionRecord =
            this.currentOutpatientOrHospital === '0'
              ? this.timeLineInspecReportList[0].mjzh
              : this.timeLineInspecReportList[0].zyh
          this.timelineMediRecordClick(this.timeLineInspecReportList[0], true)
        } else {
          this.timeLineInspecReportList = []
        }
      })
    },
    getInpectionList() {
      selectDataList({
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20006' : 'JK1001',
        apiVersion: '1.0',
        pageNo: 0,
        pageSize: 0,
        parameters: Object.assign(
          {},
          this.currentOutpatientOrHospital === '0'
            ? {
                mjzh: this.activeTimelineInspectionRecord
              }
            : {
                zyh: this.activeTimelineInspectionRecord
              }
        )
      }).then(res => {
        if (res.data && res.data.length) {
          this.inspectionList = this.handleList(res.data)
          this.inspectionList.forEach(item => {
            item.isActive = false
            item.list.forEach(subItem => {
              subItem.isHighLight = false
            })
          })
          console.log(this.inspectionList, 'test', this.handleList(res.data))
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      console.log(row, 'rowwww')
      if (row.isHighLight) {
        return 'warning-row'
      }
      return ''
    },
    changeCollapse(item) {
      console.log(item, '11111')
      this.inspectionList.forEach((obj, index) => {
        if (item.indexOf(index) > -1) {
          this.inspectionList[index].isActive = true
        } else {
          this.inspectionList[index].isActive = false
        }
      })
      console.log(this.inspectionList, 'this.inspectionList')
      this.inspectionList.splice()
    },
    getAllInpectionList() {
      selectDataList({
        apiCode: this.currentOutpatientOrHospital === '0' ? 'JK20018' : 'JK1021',
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
          this.inspectionList = this.handleList(res.data)
          this.inspectionList.forEach(item => {
            item.isActive = false
            item.list.forEach(subItem => {
              subItem.isHighLight = false
            })
          })
          console.log(this.inspectionList, 'test', this.handleList(res.data))
        }
      })
    },
    filterAbnormal(list) {
      return list.filter(item => {
        return item.bj === 'H' || item.bj === 'L' || item.bj === '1'
      })
    },
    handleList(list) {
      //      return list.filter(item => {
      //   return item.jyxm === obj.jyxm
      // })
      // return list.filter
      let arr = []
      list.map(mapItem => {
        if (!arr.length) {
          arr.push({ jyxmid: mapItem.jyxmid, list: [mapItem] })
        } else {
          let res = arr.some(item => {
            if (item.jyxmid === mapItem.jyxmid) {
              item.list.push(mapItem)
              return true
            }
          })
          !res ? arr.push({ jyxmid: mapItem.jyxmid, list: [mapItem] }) : ''
        }
      })
      return arr
    },
    timelineMediRecordClick(item, flag) {
      if (
        !flag &&
        this.activeTimelineInspectionRecord ===
          (this.currentOutpatientOrHospital === '0' ? item.mjzh : item.zyh)
      )
        return
      this.activeTimelineInspectionRecord =
        this.currentOutpatientOrHospital === '0' ? item.mjzh : item.zyh
      item.flag ? this.getAllInpectionList() : this.getInpectionList()
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
    // width: 100%;
    flex: 8.5;
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
    .inspection-item {
      display: flex;
      //  display: -webkit-box;
      font-size: 14px;
      :first-child {
        flex: 5;
      }
      :last-child {
        flex: 1;
      }
      .abnormal-project {
        display: table-cell;
        padding: 8px 10px 28px 10px;
        // height: 500px;
        overflow-y: scroll;
        .abnormal-title {
          border-left: 3px solid #0075ff;
          padding-left: 9px;
          margin-bottom: 10px;
          height: 15px;
          line-height: 15px;
        }
        .abnormal-content {
          overflow-y: scroll;
          padding-left: 9px;
          display: flex;
          flex-direction: column;
          // min-width: 0;
          div {
            height: 40px;
            display: flex;
            height: 40px;
            line-height: 40px;
            max-width: 200px;
            justify-content: space-around;
            .abnormal-name {
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .abnormal-img {
              flex-basis: 15px;
              img {
                width: 12px;
                height: 12px;
                margin: auto 0;
              }
            }
          }
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

::v-deep .el-table .warning-row {
  background-color: #fbfbfb;
}
::v-deep .el-table thead {
  color: #666;
}
::v-deep .el-table {
  color: #111;
}

// ::v-deep .el-table .success-row {
//   background: #f0f9eb;
// }
</style>
