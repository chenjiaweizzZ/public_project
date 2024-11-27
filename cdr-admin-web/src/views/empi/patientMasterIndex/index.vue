<!-- 患者主索引 -->
<template>
  <div class="container-style">
    <div class="header-style">
      <el-form :inline="true" :model="searchObj" class="demo-form-inline">
        <el-form-item label="患者姓名">
          <el-input v-model="searchObj.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="searchObj.idCard" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="searchObj.birthDay"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="searchObj.sex" clearable placeholder="请选择">
            <el-option
              v-for="item in genderArray"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="索引状态">
          <el-radio-group v-model="searchObj.indexStatus">
            <el-radio :label="3">全部</el-radio>
            <el-radio :label="2">合并</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="searchObj" class="demo-form-inline">
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
                <el-button type="primary" plain class="search_btn search-style" @click="getIndexList(true)">
        <img src  />
      </el-button>

        </el-form-item>
      </el-form>
    </div>
    <div class="main-style">
      <div class="table-style">
        <el-table
          ref="multipleTable"
          :data="tableData"
          row-key="pid"
          border
          height="calc(100vh - 110px - 20px - 30px - 64px)"
          stripe
          tooltip-effect="dark"
          style="height: 90%;margin-left:10px"
          @select="handleSelectionChange"
          @select-all="handleAllChange"
        >
          <el-table-column type="selection" width="40" :reserve-selection="true"></el-table-column>
          <el-table-column header-align="center" label="操作" width="50">
            <template slot-scope="scope">
              <img :src="patientIndexCZ" @click="operatePatient(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            prop="pid"
            label="PID"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="indexStatus"
            width="80px"
            header-align="center"
            label="索引状态"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            label="患者姓名"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="idcardNo"
            header-align="center"
            label="身份证号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="birthDate"
            label="出生日期"
            header-align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            header-align="center"
            prop="sex"
            width="80px"
            label="性别"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="currAddress"
            label="现住址"
            header-align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="operationTime"
            label="操作时间"
            header-align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <el-pagination
          align="right"
          style="margin-top:24px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchObj.pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchObj.pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
      <div v-if="!showDrawer" class="right-box" v-loading="rightLoading">
        <div class="right-top">
          <img :src="patientIndex" @click="openDrawer" />
        </div>
        <div class="right-content">
          <el-button
            style="width: 64px; height: 24px; line-height: 1px"
            type="success"
            plain
            :disabled="!selectTableData.length"
            @click="gotoHebing"
            ><span class="hbText-style">合并</span>  </el-button
          >
          <el-table
            v-if="selectRightTableData.length"
            :data="selectRightTableData"
            :height="rightTableHeight"
            header-align="center"
            max-height="calc(100vh - 110px - 20px - 30px - 90px)"
            :span-method="objectSpanMethod"
            border
            style="margin-top: 10px;overflow-x:hidden;"
          >
            <el-table-column label="操作" width="50px">
              <template slot-scope="scope">
                <i
                  class="el-icon-delete"
                  style="color: #0075ff"
                  @click="deleteRightTableData(scope.row)"
                ></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              :show-overflow-tooltip="true"
              label="患者姓名"
            ></el-table-column>
          </el-table>
          <div v-else class="nodata-style">
            <img :src="patientIndexNodata" />
          </div>
        </div>
      </div>
      <div v-else class="right-boxDrawer">
        <el-drawer
          :show-close="false"
          :modal="false"
          :visible.sync="showDrawer"
          :direction="direction"
        >
          <div class="boxDrawer-top">
            <img :src="patientIndex" @click="closeDrawer" />
          </div>
          <div class="boxDrawer-main">
            <el-button
              style="width: 64px; height: 24px; line-height: 1px"
              type="success"
              :disabled="!selectTableData.length"
              plain
              @click="gotoHebing"
              >合并</el-button
            >
            <el-table
              v-if="selectRightTableData.length"
              :data="selectRightTableData"
              :height="rightTableHeight"
              max-height="calc(100vh - 110px - 20px - 30px - 84px)"
              :span-method="objectSpanMethod"
              border
              header-align="center"
              style="margin-top: 10px"
            >
              <el-table-column label="操作" width="50px">
                <template slot-scope="scope">
                  <i
                    class="el-icon-delete"
                    style="color: #0075ff"
                    @click="deleteRightTableData(scope.row)"
                  ></i>
                </template>
              </el-table-column>
              <el-table-column prop="indexStatus" width="80px" label="索引状态"></el-table-column>
              <el-table-column
                prop="name"
                :show-overflow-tooltip="true"
                label="患者姓名"
              ></el-table-column>
              <el-table-column
                prop="idcardNo"
                :show-overflow-tooltip="true"
                label="身份证号"
              ></el-table-column>
              <el-table-column
                prop="birthDate"
                :show-overflow-tooltip="true"
                label="出生日期"
              ></el-table-column>
              <el-table-column prop="sex" label="性别"></el-table-column>
            </el-table>
            <div v-else style="text-align:center">
              <img :src="patientIndexNodata" style="margin-top:20%" />
            </div>
          </div>
        </el-drawer>
      </div>
    </div>
  </div>
</template>
<script>
// import list from './mock'
import patientIndex from '@svg/patientIndex.svg'
import patientIndexCZ from '@svg/patientIndexCZ.svg'
import _ from '@/utils'
import { EventBus } from '../../../event-bus'
import { listPatientVo, checkMergeList, getEnumList } from '@/service/empi'
import patientIndexNodata from '@svg/patientIndexNodata.svg'
export default {
  name: 'patientMasterIndex',
  components: {},
  data() {
    return {
      patientIndex,
      patientIndexNodata,
      showDrawer: false,
      direction: 'rtl',
      date: [],
      patientIndexCZ,
      total: 0,
      searchObj: {
        pageNum: 1,
        pageSize: 20,
        name: '',
        idCard: '',
        birthDay: '',
        sex: '',
        indexStatus: 3
      },
      selectTableData: [],
      selectTablePidData: [],
      selectRightTableData: [],
      genderArray: [],
      tableData: [],
      rightLoading: false
    }
  },
  watch: {
    selectTableDataListWatch: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal, 'newVal, oldVal')
        // if(newVal.length>oldVal.length){//只有新增才需要
        if (
          newVal.some(item => {
            return item.indexStatus === '合并'
          })
        ) {
          this.checkMergeList()
        } else {
          this.selectRightTableData = newVal
        }
        // }
      }
    },
    $route(to, from) {
      if (from.name === 'separationPatient' || from.name === 'mergePatient') {
        EventBus.$on('initIndex', param => {
          if (param.isInit) {
            this.initPage()
            this.getIndexList()
            this.getEnumList()
            this.toggleSelectionClear()
          }
        })
      }
    }
  },
  computed: {
    rightTableHeight: function() {
      // let tmpHeight=''
      // this.selectRightTableData.length===1? tmpHeight=(this.selectRightTableData.length + 1) * 28.5 + 'px' :tmpHeight= (this.selectRightTableData.length + 1) * 28 + 'px'
      // return tmpHeight
      return (this.selectRightTableData.length + 1) * 28.5 + 'px'
    },
    selectTableDataListWatch: function() {
      return JSON.parse(JSON.stringify(this.selectTableData))
    }
  },
  created() {
    console.log('患者主索引created')
    this.initPage()
    this.getIndexList()
    this.getEnumList()
  },

  methods: {
    //初始化
    initPage() {
      this.selectRightTableData = []
      this.selectTableData = []
      let nowYear = new Date().getFullYear()
      this.date.push(_.formatDate(new Date(nowYear, 0, 1)))
      this.date.push(_.formatDate(new Date()))
      console.log(this.date, '456')
      this.searchObj = {
        pageNum: 1,
        pageSize: 20,
        name: '',
        idCard: '',
        birthDay: '',
        sex: '',
        indexStatus: 3
      }
    },
    getEnumList() {
      getEnumList().then(res => {
        console.log(res, 'qqqq')
        this.genderArray = res.genderArray
      })
    },
    getIndexList(flag) {
      if (flag) {
        this.searchObj.pageNum = 1
        this.searchObj.pageSize = 20
      }
      listPatientVo(
        Object.assign(this.searchObj, {
          startTime: this.date[0],
          endTime: this.date[1]
        })
      ).then(res => {
        console.log(res, 'resss')
        // if (res.returnCode === 'SUCCESS') {
        this.total = res.total
        this.tableData = res.patientVoList
        this.$nextTick(() => {
          console.log('this.selectTableData', this.selectTableData)
          this.tableData.forEach(item => {
            if (this.selectTableData.includes(item)) {
              // console.log('哈哈哈哈哈')
              this.$refs.multipleTable.toggleRowSelection(item, true)
            }
          })
        })
        console.log('this.selectTableData', this.selectTableData)
      })
    },
    toggleSelection(rows) {
      console.log(rows, 'rowsss')
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    openDrawer() {
      this.showDrawer = true
    },
    closeDrawer() {
      this.showDrawer = false
    },
    toggleSelectionClear() {
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val, row) {
      console.log('hhhh', val, row)
      // 勾选
      if (
        this.selectTableData.findIndex(item => {
          return item.pid === row.pid
        }) === -1
      ) {
        this.selectTableData.push(row)
      } else {
        this.selectTableData.forEach((item, index) => {
          if (item.pid === row.pid) {
            this.selectTableData.splice(index, 1)
          }
        })
      }
      console.log(this.selectTableData, 'this.selectTableData勾选后')
      // this.selectTableData = val
    },
    handleAllChange(selecteds) {
      console.log(selecteds, 'selecteds', this.selectTableData)
      //全选
      if (selecteds.length > this.selectTableData.length) {
        selecteds.forEach(item => {
          if (
            this.selectTableData.findIndex(obj => {
              return obj.pid === item.pid
            }) === -1
          ) {
            this.selectTableData.push(item)
          }
        })
        //取消全选
      } else {
        this.tableData.forEach(item => {
          this.selectTableData.forEach((obj, index) => {
            if (obj.pid === item.pid) {
              this.selectTableData.splice(index, 1)
            }
          })
          // if(this.selectTableData.indexOf(item)!=-1)
        })
        console.log(this.selectTableData, 'selectTableData')
      }
    },

    getSelectTablePidData() {
      this.selectTablePidData = []
      this.selectTableData.forEach(item => {
        this.selectTablePidData.push(item.pid)
      })
    },
    checkMergeList() {
      this.rightLoading = true
      this.getSelectTablePidData()
      checkMergeList(this.selectTablePidData).then(res => {
        console.log(res, 'ressssssh')
        this.rightLoading = false
        this.selectRightTableData = res
      })
    },
    handleSizeChange(val) {
      // console.log(val,"vallll");
      this.searchObj.pageSize = val
      this.getIndexList()
      // this.toggleSelection(this.selectTableData)
    },
    handleCurrentChange(val) {
      this.searchObj.pageNum = val
      this.getIndexList()
      //  this.toggleSelection(this.selectTableData)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || (this.showDrawer && columnIndex === 1)) {
        let spanArr = this.getSpanArr(this.selectRightTableData, 'belongPid')
        const _row = spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    //处理合并行的数据
    getSpanArr(data, spanKey) {
      let spanArr = []
      let pos = ''
      data.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
          pos = 0
        } else {
          if (data[index][spanKey] && data[index][spanKey] === data[index - 1][spanKey]) {
            spanArr[pos] += 1
            spanArr.push(0)
          } else {
            spanArr.push(1)
            pos = index
          }
        }
      })
      return spanArr
    },
    gotoHebing() {
      if (this.selectTableData.length < 2) {
        this.$message.error('请选择两条以上记录合并')
        return
      }
      this.getSelectTablePidData()
      console.log(this.selectTablePidData, 'selectTablePidData')
      this.$router.push({
        name: 'mergePatient',
        query: {
          list: this.selectTablePidData
        }
      })
    },
    operatePatient(item) {
      if (item.indexStatus === '合并') {
        this.$router.push({
          name: 'separationPatient',
          query: {
            pid: item.pid,
            empi: item.pid
          }
        })
      } else {
        this.$router.push({
          name: 'patientDetail',
          query: {
            id: item.id,
            empi: item.id
          }
        })
      }
    },
    deleteRightTableData(row) {
      //TODO删除合并的
      if (row.indexStatus === '合并') {
        for (let i = this.selectRightTableData.length - 1; i >= 0; i--) {
          if (row.belongPid === this.selectRightTableData[i].belongPid)
            this.selectRightTableData.splice(i, 1)
        }

        this.selectTableData.forEach((item, index) => {
          // if(item.belongPid){
          if ((row.belongPid && row.belongPid === item.pid) || row.pid === item.pid) {
            this.$refs.multipleTable.toggleRowSelection(item, false)
            this.selectTableData.splice(index, 1)
          }

          // }
        })
      } else {
        //以为watch了所以这里不需要修改selectRightTableData了
        let num1 = this.selectTableData.findIndex(item => {
          return item.pid === row.pid
        })
        this.$refs.multipleTable.toggleRowSelection(this.selectTableData[num1], false)
        console.log(row, this.selectTableData, '7789', num1)

        this.selectTableData.splice(num1, 1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container-style {
  background-color: #fff;
  margin: 10px;
  height: calc(100vh - 30px - 20px);
  .header-style {
    padding: 10px;
  }
  .search-style {
    width: 28px;
    height: 28px;
   margin-top: 6px;
    // color: #0075ff;
    // background-color: #ffffff;
  }
  .main-style {
    display: flex;
    height: calc(100vh - 110px - 20px - 30px);
    width: 100%;
    .table-style {
      flex: 1;
      height: 100%;
      margin-right: 10px;
    }
    .right-box {
      width: 160px;
      // min-width:150px ;
      // background-color: red;

      background: #ffffff;
      border: 1px solid #e6e6e6;
      height: 100%;
      .right-top {
        height: 34px;
        background: #e4f1ff;
        img {
          margin: 10px;
        }
      }
      .right-content {
        padding: 10px;
        .hbText-style{
          margin: 0 -5px;
        }
        .nodata-style {
          text-align: center;
          padding-top: 50%;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .right-boxDrawer {
      .boxDrawer-top {
        height: 34px;
        display: flex;
        justify-content: flex-end;
        background-color: #e4f1ff;
        padding: 10px;
        img {
          transform: rotate(180deg);
        }
      }
      .boxDrawer-main {
        padding: 10px;
      }
    }
  }
}
::v-deep .el-table {
  width: calc(100vw - 20px - 160px - 20px); //根据flex  6:1
}


/* 表格不出现横向滚动条 */
  ::v-deep .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
 }
::v-deep .el-form-item {
  margin-bottom: 5px;
}
::v-deep .el-form--inline .el-form-item {
  margin-right: 20px;
}

::v-deep .el-date-editor .el-range__icon {
  line-height: 26px;
}
::v-deep .el-date-editor .el-range-separator {
  line-height: 26px;
  width: 6%;
}

// ::v-deep .el-table::before{
//   height: ;
// }

::v-deep .el-drawer.rtl {
  height: calc(100vh - 110px - 20px - 30px) !important;
  width: 531px;
  // height: 50% !important;
  bottom: 10px;
  right: 10px;
  top: 150px;
}
::v-deep .el-drawer__header {
  padding: 0px;
  margin: 0px;
}

::v-deep .el-pagination__total {
  float: left;
}
::v-deep .el-pagination__sizes {
  float: left;
}

::v-deep .el-date-editor .el-range-separator {
  line-height: 21px;
}

::v-deep .el-date-editor .el-range__icon {
  line-height: 21px;
}

::v-deep .el-form {
  height: 38px;
}

::v-deep .el-icon-search{
margin: 1px -14px;
}
</style>
