<template>
  <div class="marginX20">
    <OperationHeader>
      <template v-slot:right>
        <div class="bold">随访科室</div>
        <el-select class="marginX10" v-model="deptId" clearable @change="getqueryTemplateList">
          <el-option
            v-for="item in newDeptOptions"
            :key="item.serialNo"
            :label="item.deptName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
        <div class="bold">专科模板</div>
        <el-select class="marginX10" v-model="templateId" filterable>
          <el-option
            v-for="item in queryTemplateList"
            :key="item.serialNo"
            :label="item.questionnaireName"
            :value="item.serialNo"
          ></el-option>
        </el-select>
        <div class="bold">随访完成日期</div>
        <el-date-picker
          class="marginX10"
          v-model="daterange"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-button type="primary" @click="getstatisticsqueryRatioList" plain>查询</el-button>
        <el-button type="primary" @click="exportFile" :disabled="!templateId">导出</el-button>
        <el-popover
          ref="popover"
          class="marginX10 flex-column"
          placement="bottom"
          width="250"
          @hide="delSearch"
          trigger="click"
        >
          <div class="flex flex-align">
            <el-input v-model="searchQuestionList" placeholder="请输入搜索内容"></el-input>
            <i class="el-icon-search proportion-icon"></i>
          </div>
          <el-checkbox
            class="margin-top10"
            :indeterminate="isIndeterminate"
            :value="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <el-checkbox-group class="proportion-selectQuestion" v-model="selection">
            <el-checkbox
              class="flex-align"
              v-for="(item,i) in showCheckBox"
              :key="i"
              :label="item.title"
            >{{item.title}}</el-checkbox>
          </el-checkbox-group>
        </el-popover>
        <el-button class="line-ellipsis" v-popover:popover>{{popoverText}}</el-button>
      </template>
    </OperationHeader>

    <el-tabs v-model="activeName">
      <el-tab-pane label="图表展示" name="1">
        <div class="fpimgbox" v-if="showTable.length == 0">
          <img src="~@/assets/images/zwsj.png" alt="暂无数据" />
        </div>
        <ve-histogram v-else-if="activeName==1" :data="chartData"></ve-histogram>
      </el-tab-pane>
      <el-tab-pane label="列表展示" name="2">
        <div v-for="(item,index) in showTable" :key="index" class="margin20X">
          <el-row class="bold">{{item.title}}</el-row>
          <el-table :data="item.options" stripe border class="margin20X width75">
            <el-table-column
              show-overflow-tooltip
              v-for="item1 in thList"
              :prop="item1.value"
              :key="item1.value"
              :label="item1.key"
            ></el-table-column>
          </el-table>
        </div>
        <div class="fpimgbox" v-if="showTable.length == 0">
          <img src="~@/assets/images/zwsj.png" alt="暂无数据" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import histogram from 'v-charts/lib/histogram.common'
import DeptList from '@/mixins/deptList'

export default {
  components: {
    [histogram.name]: histogram,
  },
  mixins: [DeptList],
  data() {
    return {
      questionnaireId: '',
      questionaireList: [],
      daterange: [],
      version: '',
      versionList: [],
      selection: [],
      list: [],
      searchQuestionList: '',
      totalList: [],
      thList: [
        { value: 'option', key: '选项' },
        { value: 'amount', key: '小计' },
        { value: 'percentage', key: '百分比' },
      ],
      deptId: '',
      templateId: '',
      pageNo: 1,
      pageSize: 10,
      queryTemplateList: [],
      flupGroupList: [],
      chartData: {
        columns: [],
        rows: [],
      },
      activeName: '2',
    }
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
    await this.$apis
      .groupgetFlupGroupList({
        hospitalId: this.hospitalId,
        pageNo: 1,
        pageSize: 9999,
      })
      .then((res) => {
        this.flupGroupList = res.list
      })
    this.getqueryTemplateList()
    // this.$stopLoading()
  },
  methods: {
    getqueryTemplateList() {
      this.$apis
        .templatequeryTemplateList({
          hospitalId: this.hospitalId,
          deptId: this.deptId == 'ALL' ? '' : this.deptId,
          pageNo: 1,
          pageSize: 999,
          type: 1,
        })
        .then((res) => {
          this.templateId = null
          this.queryTemplateList = res.list
          if (res.list.length > 0) {
            this.templateId = res.list[0].serialNo
          }
        })
    },
    //获取统计数据
    getstatisticsqueryRatioList() {
      this.chartData = {
        columns: [],
        rows: [],
      }
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
      return this.$apis
        .statisticsqueryRatioList({
          ...query,
        })
        .then((res) => {
          console.log(res)
          this.list = []
          this.totalList = []
          this.selection = []
          if (!res) {
            return
          }
          res.forEach((element) => {
            console.log(element)
            this.totalList.push({
              title: element.selectBoxName,
              options: element.optionList,
            })
          })
          for (let i in this.totalList) {
            this.selection.push(this.totalList[i].title)
          }
          this.chartData.columns = ['题目', '选项数量']
          res.forEach((item) => {
            this.chartData.rows.push({
              题目: item.selectBoxName,
              选项数量: item.optionCount,
            })
          })
        })
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
      location.href =
        this.$baseURL.ICDMApiUrl +
        '/s/statistics/exportRatioReport?' +
        this.$qs.stringify({
          ...query,
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
