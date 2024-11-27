<template>
  <div class="marginX20">
    <OperationHeader style="margin-bottom:20px">
      <template v-slot:right>
        <div class="bold">随访科室</div>
        <el-select class="marginX10" v-model="deptId" @change="getqueryTemplateList" clearable>
          <el-option v-for="item in newDeptOptions" :key="item.serialNo" :label="item.deptName" :value="item.serialNo"></el-option>
        </el-select>
        <div class="bold">专科模板</div>
        <el-select class="marginX10" v-model="templateId" filterable @change="getquerySampleList">
          <el-option v-for="item in queryTemplateList" :key="item.serialNo" :label="item.questionnaireName" :value="item.serialNo"></el-option>
        </el-select>
        <div class="bold">随访完成日期</div>
        <el-date-picker class="marginX10" v-model="daterange" type="daterange" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" @change="getquerySampleList"></el-date-picker>
        <el-button type="primary" @click="getquerySampleList" plain>查询</el-button>
        <el-button type="primary" @click="exportFile" :disabled="!templateId">导出</el-button>
        <el-popover ref="popover" class="marginX10 flex-column" placement="bottom" width="250" @hide="delSearch" trigger="click">
          <div class="flex flex-align">
            <el-input v-model="searchQuestionList" placeholder="请输入搜索内容"></el-input>
            <i class="el-icon-search proportion-icon"></i>
          </div>
          <el-checkbox class="margin-top10" :indeterminate="isIndeterminate" :value="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group class="proportion-selectQuestion" v-model="selection">
            <el-checkbox class="flex-align" v-for="(item,i) in showCheckBox" :key="i" :label="item.title">{{item.title}}</el-checkbox>
          </el-checkbox-group>
        </el-popover>
        <el-button class="line-ellipsis" v-popover:popover>{{popoverText}}</el-button>
      </template>
    </OperationHeader>

    <el-table :data="tableData" v-if="tableData.length>0" stripe border style="width: 100%">
      <el-table-column v-for="(item, index) in listn" :key="index" :prop="item.options" :label="item.title">
        <template slot-scope="scope">
          <p v-for="(itemx, index) in scope.row" :key="index">{{item.options == itemx.key ?itemx.value:''}}</p>
        </template>
      </el-table-column>
    </el-table>
    <div class="fpimgbox" v-if="tableData.length == 0">
      <img src="~@/assets/images/zwsj.png" alt="暂无数据" />
    </div>
  </div>
</template>

<script>
import DeptList from '@/mixins/deptList'

export default {
  mixins: [DeptList],
  data() {
    return {
      daterange: [],
      selection: [],
      list: [],
      searchQuestionList: '',
      totalList: [],
      deptId: '',
      templateId: '',
      pageNo: 1,
      pageSize: 10,
      queryTemplateList: [],
      headerlist: {},
      tableData: [],
      listn: [],
    }
  },
  watch: {
    totalList: function () {
      // console.log(this.totalList)
    },
    selection: function () {
      this.listn = []
      // this.selection.forEach((element) => {
      for (var i in this.totalList) {
        // if (element == this.totalList[i].title) {
        this.listn.push(this.totalList[i])
        console.log(111, this.listn)
        // }
      }
      // })
    },
  },
  computed: {
    //显示统计数据
    showTable() {
      return this.totalList.filter((element) => {
        return (
          element.title.indexOf(this.searchQuestionList) > -1 &&
          this.selection.indexOf(element.title) > -1
        )
      })
    },
    //题目筛选
    showCheckBox() {
      return this.totalList.filter((element) => {
        return element.title.indexOf(this.searchQuestionList) > -1
      })
    },
    //显示筛选内容
    popoverText() {
      if (this.showTable.length === 0) {
        return '点击筛选'
      }
      if (this.showTable.length === this.totalList.length) {
        return `全选(${this.showTable.length})`
      }
      return this.showTable.length === 1
        ? this.showTable
            .map((item) => {
              return item.title
            })
            .join('、')
        : `(已选${this.showTable.length}条)${this.showTable
            .map((item) => {
              return item.title
            })
            .join('、')}`
    },
    //全选
    checkAll() {
      return this.selection.length === this.totalList.length
    },
    isIndeterminate() {
      return (
        this.selection.length !== this.totalList.length &&
        this.selection.length !== 0
      )
    },
  },
  async created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    // this.$startLoading()
    await this.getAllNewDept()
    // this.getquerySampleList()
    this.getqueryTemplateList()
    // this.$stopLoading()
  },
  methods: {
    getqueryTemplateList() {
      this.templateId = ''
      this.$apis
        .templatequeryTemplateList({
          hospitalId: this.hospitalId,
          deptId: this.deptId == 'ALL' ? '' : this.deptId,
          pageNo: 1,
          pageSize: 999,
          type: 1,
        })
        .then((res) => {
          this.queryTemplateList = res.list
          if (res.list.length > 0) {
            this.templateId = res.list[0].serialNo
          }
          this.getquerySampleList()
        })
    },
    //获取统计数据
    getquerySampleList() {
      let query = {
        hospitalId: this.hospitalId,
        deptId: this.deptId,
        templateId: this.templateId,
        pageNo: this.pageNo,
        pageSize: 1000,
      }
      if (this.daterange && this.daterange.length > 0) {
        query.beginDate = this.daterange[0]
        query.endDate = this.daterange[1]
      }

      this.$apis.querySampleHeaderExt({ ...query }).then((res) => {
        this.headerlist = res

        if (!res) {
          return
        }
        this.totalList = []
        res.forEach((element) => {
          this.totalList.push({
            title: element.label,
            options: element.key,
          })
        })
        this.selection = []
        for (let i in this.totalList) {
          this.selection.push(this.totalList[i].title)
        }
        this.$apis
          .querySampleListExt({
            ...query,
          })
          .then((res) => {
            if (!res || !res.list) {
              this.selection = []
              this.tableData = []
            } else {
              this.tableData = res.list
              this.tableData.forEach((element) => {
                for (var key in element) {
                  element[key]['' + element[key].key] = element[key].value
                }
              })
            }
          })
      })
    },
    //全选
    handleCheckAllChange(val) {
      if (val) {
        let selection = []
        for (let i in this.totalList) {
          selection.push(this.totalList[i].title)
        }
        this.selection = selection
      } else {
        this.selection = []
      }
    },
    //清空搜索框
    delSearch() {
      this.searchQuestionList = ''
    },
    exportFile() {
      let query = {
        hospitalId: this.hospitalId,
        deptId: this.deptId,
        templateId: this.templateId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }
      if (this.daterange && this.daterange.length > 0) {
        query.beginDate = this.daterange[0]
        query.endDate = this.daterange[1]
      }
      if(this.tableData.length > 0){
          location.href =
          this.$baseURL.ICDMApiUrl +
          '/s/statistics/exportSampleListExt?' +
          this.$qs.stringify({
            ...query,
        })
      }else{
				this.$message({
          type: 'warning',
          message: '暂无数据!'
        })        
        return
      }
    },
  },
}
</script>
<style lang="scss">
.proportion-selectQuestion {
  .el-button {
    width: 250px;
  }

  .el-checkbox,
  .el-checkbox + .el-checkbox {
    margin: 10px 0;
  }

  .el-checkbox__label {
    width: 200px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.fpimgbox {
  width: 100%;
  padding-top: 50px;
  img {
    width: 300px;
    height: 350px;
    display: block;
    margin: 0 auto;
  }
}
</style>

<style scoped>
.proportion-icon {
  font-size: 20px;
  margin-left: 10px;
}
</style>
