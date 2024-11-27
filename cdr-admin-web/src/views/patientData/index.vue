<!-- 患者数据查询 -->
<template>
  <div class="patient-data">
    <div class="top-box">
      <el-form :inline="true" :model="commonSearch" class="demo-form-inline">
        <el-form-item label="患者ID">
          <el-input v-model="commonSearch.patientId" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="患者姓名">
          <el-input v-model="commonSearch.patientName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="commonSearch.idCard" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            icon="el-icon-search"
            style="height:28px"
            @click="patientTableClassVo(commonSearch)"
            type="primary"
            plain
          >
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom-box">
      <div class="left-box" v-loading="showLeftLoading">
        <div class="left-subBox">
          <tree-menu
            :defaultExpandedKeys="defaultExpandedKeys"
            :nodeKey="'id'"
            :menuList="menuList"
            :activeTableId="activeTableId"
            @clickTable="clickTable"
          ></tree-menu>
        </div>
      </div>
      <div v-if="!showNodata" v-loading="showRightLoading" class="right-box">
        <div class="rightTop-btn">
          <el-button type="success" @click="customQuery" plain>自定义查询</el-button>
          <el-button type="success" plain @click="exportResult">导出结果</el-button>
          <el-button type="success" @click="reset" plain>重置</el-button>
        </div>
        <el-table border center height="80%" :data="tableData">
          <el-table-column
            v-for="item in tableList"
            :key="item.id"
            :prop="item.name"
            :label="item.nameCn"
            width="150"
          >
          </el-table-column>
        </el-table>
        <div class="pagination-style">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="commonSearch.pageNo"
            background
            :page-sizes="[10, 20, 30, 40]"
            :page-size="commonSearch.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <div v-else class="right-box">
        <div class="nodata-img">
          <img src="~@/assets/images/noTable.png" alt="" width="100%" />
        </div>
      </div>
    </div>
    <custom-condition-dialog
      :conditionList="conditionList"
      :activeTableId="activeTableId"
      :showCustomConditionDialog.sync="showCustomConditionDialog"
      @addCondition="addCondition"
      @confirmCustom="confirmCustom"
      @deleteCondition="deleteCondition"
      @closeDialog="showCustomConditionDialog = false"
    ></custom-condition-dialog>
  </div>
</template>
<script>
import TreeMenu from './components/TreeMenu.vue'
import _ from '@/utils'
import CustomConditionDialog from './components/CustomConditionDialog.vue'
import {
  patientTableClassVo,
  getPatientPageResponse,
  getPatientTableData,
  exportPatientPageResponse
} from '@/service/patientData'
const conditionDefaultList = [
  {
    condition: '',
    list: [
      {
        condition: '',
        tableFieldName: '',
        value: ''
      }
    ]
  }
]
export default {
  name: 'patientData',
  components: {
    TreeMenu,
    CustomConditionDialog
  },
  data() {
    return {
      commonSearch: {
        patientId: '',
        patientName: '',
        idCard: '',
        pageNo: 1,
        pageSize: 20
      },
      activeTableId: 0,
      showNodata: false,
      conditionList: conditionDefaultList,
      showCustomConditionDialog: false,
      currentPage4: 0,
      menuList: [],
      defaultExpandedKeys: [],
      total: 0,
      tableData: [],
      tableList: [],
      showLeftLoading: false,
      showRightLoading: false,
      isCurrentCustom: false //当前是否为自定义查询
    }
  },
  created() {
    this.patientTableClassVo()
  },
  methods: {
    patientTableClassVo(obj) {
      this.showLeftLoading = true
      patientTableClassVo(obj).then(res => {
        this.menuList = res
        this.menuList.some(item => {
          if (item.list && item.list.length != 0) {
            this.defaultExpandedKeys = [item.id]
            // console.log(item.list[0], 'item.list[0]')
            this.activeTableId = item.list[0].id
            if (item.list[0].count === 0) {
              this.showNodata = true
              return true
            } else {
              this.getPatientTableData()
              this.showNodata = false
              return true
            }
          }
          // console.log(this.defaultExpandedKeys, 'defaultExpandedKeys')
        })
        this.showLeftLoading = false
      })
    },
    handleNodeClick(data) {
      // console.log(data)
    },
    customQuery() {
      this.showCustomConditionDialog = true
    },
    exportResult() {
      this.$message({
        message: '开始导出数据请稍后',
        type: 'success'
      })
      exportPatientPageResponse({
        list: this.conditionList === conditionDefaultList ? null : this.conditionList,
        tableId: this.activeTableId
      }).then(res => {
        _.download(res, 'hh')
      })
    },
    reset() {
      this.conditionList = conditionDefaultList
      this.isCurrentCustom = false
      this.commonSearch.pageSize = 20
      this.commonSearch.pageNo = 1
      this.getPatientTableData()
    },
    addCondition(list) {
      this.conditionList = list.concat(conditionDefaultList)
    },
    confirmCustom(list) {
      this.conditionList = list
      this.isCurrentCustom = true
      this.commonSearch.pageNo=1
      this.commonSearch.pageSize=20
      this.getPatientPageResponse()
    },
    getPatientPageResponse(flag) {
      this.showRightLoading = true
      getPatientPageResponse({
        list: flag ? null : this.conditionList,
        tableId: this.activeTableId,
        pageSize: this.commonSearch.pageSize,
        pageNo: this.commonSearch.pageNo
      }).then(res => {
        this.showCustomConditionDialog = false
        this.tableData = res.list
        this.tableList = res.parameter
        this.total = res.total
        this.showRightLoading = false
      })
    },

    clickTable(obj) {
      this.activeTableId = obj.id
      this.isCurrentCustom = false
      this.conditionList = conditionDefaultList
      this.commonSearch.pageNo = 1
      this.commonSearch.pageSize = 20
      if (obj.count === 0) {
        this.showNodata = true
      } else {
        this.showNodata = false
        this.getPatientTableData()
      }
    },
    getPatientTableData() {
      // console.log(this.activeTableId, 'this.activeTable.id')
      this.showRightLoading = true
      getPatientTableData(Object.assign(this.commonSearch, { tableId: this.activeTableId })).then(
        res => {
          // console.log(res, 'ressshhh')
          this.tableData = res.list
          this.tableList = res.parameter
          this.total = res.total
          this.showRightLoading = false
        }
      )
    },
    deleteCondition(index) {
      if (this.conditionList.length === 1 && index === 0) {
        this.conditionList = conditionDefaultList
      } else {
        this.conditionList.splice(index, 1)
      }
    },
    handleSizeChange(val) {
      this.commonSearch.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.commonSearch.pageNo = val
      this.getData()
    },
    getData() {
      if (this.isCurrentCustom) this.getPatientPageResponse()
      else this.getPatientTableData()
    }
  }
}
</script>
<style lang="scss" scoped>
.patient-data {
  padding: 10px;
  background-color: #e5e5e5;
  .top-box {
    background-color: #fff;
    height: 48px;
    // line-height: 48px;
    margin: 0 auto;
    color: #3b5370;
    padding: 6px 12px;
    // .search-btn {
    //   width: 28px !important;
    //   height: 28px !important;
    //   // padding: 0px  auto;
    //   .search-icon {
    //     width: 16px;
    //     height: 16px;
    //     border: 0px;
    //     background: url('~@/assets/images/searchBlue@3x.png') center no-repeat;
    //   }
    // }
    // .search-icon:hover {
    //     background: url('~@/assets/images/searchWhite.png') center no-repeat;
    // }
  }
  .bottom-box {
    display: flex;
    height: calc(100vh - 108px);
    margin-top: 10px;
    .left-box {
      background-color: #fff;
      margin-right: 10px;
      padding: 10px;
      // flex: 1;
      // min-width: 350px;
      width: 314px;
      .left-subBox {
        border: 1px solid #e6e6e6;
        padding: 10px;
        overflow-y: scroll;
        height: 100%;
      }
    }
    .right-box {
      background-color: #fff;
      flex: 1;
      padding: 10px;
      overflow-y: scroll;
      .rightTop-btn {
        margin-bottom: 11px;
        .el-button {
          height: 24px;
          line-height: 1px;
          text-align: center;
        }
      }

      .pagination-style {
        margin-top: 51px;
        width: 100%;
      }
      .nodata-img {
        width: 28%;
        min-width: 320px;
        margin: 0 auto;
        margin-top: 20%;
      }
    }
  }
}
// .el-icon-my-searchBlue{
//   background: url("~@/assets/images/searchBlue.png") center no-repeat;
// }
// .el-icon-my-searchBlue:before{
//   content:"\8d3a";
// font-size: 14px;
// visibility: hidden;
// }
::v-deep .el-input__inner {
  height: 28px;
}

::v-deep .el-button--mini {
  padding: 4px 6px !important;
}
::v-deep .el-message--success {
  background: #f3faf5;
}

::v-deep .el-pagination {
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-table__body-wrapper {
  height: 90% !important;
}
::v-deep .el-tree{
  color: #111;
}
</style>
