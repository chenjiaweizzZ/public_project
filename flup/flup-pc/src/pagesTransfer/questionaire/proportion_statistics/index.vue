<template>
  <div class="marginX20">
    <OperationHeader style="margin-bottom:20px">
      <template v-slot:right>
        <!-- <div class="bold">随访科室</div>
        <el-select class="marginX10" @change="getQuestionaireList" v-model="dept">
          <el-option v-for="item in newDeptOptions" :key="item.serialNo" :label="item.deptName" :value="item.serialNo"></el-option>
        </el-select>
        <div class="bold marginX10">随访计划</div>
        <el-select @change="getFollowList" v-model="plan" placeholder="请选择">
          <el-option v-for="item in newplanOptions" :key="item.serialNo" :label="item.planName" :value="item.serialNo"></el-option>
        </el-select>-->
        <div class="bold">随访问卷</div>
        <el-select
          class="marginX10"
          v-model="questionnaireId"
          @change="getTemplateVersion"
          filterable
        >
          <el-option
            v-for="item in questionaireList"
            :key="item.serialNo"
            :label="item.questionnaireName"
            :value="item.serialNo"
          >
            <span style="float:left">{{item.questionnaireName}}</span>
            <span style="float:right">({{$utils.getDeptNameByQuV2(item.flupDept, newDeptOptions)}})</span>
          </el-option>
        </el-select>
        <div class="bold">回收日期</div>
        <el-date-picker
          @change="toGetStatisticsList"
          class="marginX10"
          v-model="daterange"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-button type="primary" plain @click="toGetStatisticsList">查询</el-button>
        <el-button type="primary" @click="exportFile">导出</el-button>
      </template>
    </OperationHeader>
    <el-row class="width100 flex-align margin10X">
      <el-col :span="3">总发送量：{{totalSend || 0}}</el-col>
      <el-col :span="3">自动回收量：{{automaticRecycling || 0}}</el-col>
      <el-col :span="3">电话回收量：{{phoneRecycling || 0}}</el-col>
      <el-col :span="3">未回收量：{{noRecycling || 0}}</el-col>
      <el-col class="flex-align-end flex-align proportion-selectQuestion" :span="12">
        <div class="bold">版本号</div>
        <el-select @change="toGetStatisticsList" v-model="version" class="marginX20">
          <el-option v-for="item in versionList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <div class="bold">题目筛选</div>
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
      </el-col>
    </el-row>
    <div v-for="(item,index) in showTable" :key="index" class="margin20X">
      <el-row class="bold">{{item.title}}</el-row>
      <el-table :data="item.options" stripe border class="margin20X width75">
        <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          v-for="item1 in thList"
          :prop="item1.value"
          :key="item1.value"
          :label="item1.key"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questionnaireId: '',
      questionaireList: [],
      daterange: [],
      totalSend: 0,
      automaticRecycling: 0,
      phoneRecycling: 0,
      noRecycling: 0,
      version: '',
      versionList: [],
      selection: [],
      list: [],
      searchQuestionList: '',
      totalList: [],
      thList: [
        { value: 'label', key: '选项' },
        { value: 'count', key: '小计' },
        { value: 'proportion', key: '百分比' },
      ],
      newDeptOptions: [],
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
        return '点击筛选题目'
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
        : `(已选${this.showTable.length}题)${this.showTable
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
    // await this.getAllNewDept()
    await this.$apis
      .departmentgetFlupDeptByHospitalId({
        hospitalId: this.$global.hospital_id,
      })
      .then((res) => {
        this.newDeptOptions = res
        this.newDeptOptions.push({ deptName: '全院', serialNo: 'ALL' })
      })
    this.dept = ''
    await this.getQuestionaireList()
    await this.getMainList()
    // this.$stopLoading()
  },
  methods: {
    //获取问卷下拉框
    getQuestionaireList() {
      this.loading = true
      this.plan = ''
      this.questionnaireId = ''
      var de = this.dept
      if (this.dept == 'ALL') {
        de = ''
      }
      return this.$apis
        .queryFlupPlanListByDeptId({
          hospitalId: this.hospitalId,
          deptId: de,
        })
        .then((res) => {
          console.log(111, res)
          this.newplanOptions = res
          this.loading = false
          // this.getMainList()
          this.search()
        })
    },
    //获取随访计划下拉框
    getFollowList() {
      var de = this.dept
      if (this.dept == 'ALL') {
        de = ''
      }
      this.$apis
        .queryFollowUpContents({
          name: '调查问卷',
          deptId: de,
          hospitalId: this.hospitalId,
          planId: this.plan,
        })
        .then((res) => {
          console.log(999, res)
          this.questionaireList = res
          if (this.questionaireList.length) {
            this.questionnaireId = this.questionaireList[0].serialNo
          } else {
            this.questionnaireId = ''
          }
          this.search()
          this.getMainList()
        })
    },
    getMainList() {
      return this.$apis
        .flupPathqueryFollowUpContent({
          name: '调查问卷',
          deptId: this.dept,
          hospitalId: this.hospitalId,
        })
        .then(async (res) => {
          this.questionaireList = res
          if (this.questionaireList.length) {
            this.questionnaireId = this.questionaireList[0].serialNo
            await this.getTemplateVersion()
          } else {
            this.version = ''
            this.versionList = []
            this.questionnaireId = ''
            this.list = []
            this.totalList = []
            this.selection = []
            this.totalSend = 0
            this.automaticRecycling = 0
            this.phoneRecycling = 0
            this.noRecycling = 0
          }
        })
    },
    //获取版本号
    getTemplateVersion() {
      return this.$apis
        .templatequeryTemplateVersion(this.questionnaireId)
        .then(async (res) => {
          this.versionList = res
          if (this.versionList.length) {
            this.version = this.versionList[0]
            await this.toGetStatisticsList()
          } else {
            this.version = ''
            this.versionList = []
            this.list = []
            this.totalList = []
            this.selection = []
            this.totalSend = 0
            this.automaticRecycling = 0
            this.phoneRecycling = 0
            this.noRecycling = 0
          }
        })
    },
    //查询
    search() {
      if (this.questionnaireId) {
        this.pageIndex = 1
        this.getMainList()
      } else {
        this.list = []
      }
    },
    //获取统计数据
    toGetStatisticsList() {
      let query = {
        type: 2,
        questionnaireId: this.questionnaireId,
        versionNumber: this.version,
        startDate: '',
        endDate: '',
        deptCode: this.dept,
      }
      if (this.daterange && this.daterange.length > 0) {
        query.startDate = this.daterange[0]
        query.endDate = this.daterange[1]
      }
      return this.$apis
        .questionnaireQuestionnaireStatistic({
          ...query,
        })
        .then((res) => {
          console.log(res)

          this.list = []
          this.totalList = []
          this.selection = []
          if (res.length != 0) {
            let totalSends = 0
            let automaticRecycling = 0
            let phoneCount = 0
            let noAnswerCount = 0
            res.forEach((v) => {
              totalSends += v.totalCount
              automaticRecycling += v.autoCount
              phoneCount += v.phoneCount
              noAnswerCount += v.totalCount - v.answerCount
            })

            this.totalSend = totalSends
            this.automaticRecycling = automaticRecycling
            this.phoneRecycling = phoneCount
            this.noRecycling = noAnswerCount
          } else {
            this.totalSend = 0
            this.automaticRecycling = 0
            this.phoneRecycling = 0
            this.noRecycling = 0
          }
          if (res.length == 0 || !res) {
            return
          }
          // let title = new Set(
          //   res.data.map(element => {
          //     return element.option
          //   })
          // )
          // let titleList = Array.from(title)
          // titleList.forEach(element => {
          //   let list = res.data.filter(e => {
          //     return e.option == element
          //   })
          //   this.totalList.push({
          //     title: element,
          //     options: list
          //   })
          // })
          res[0].optionsAccountList.forEach((element) => {
            if (element.label) {
              this.totalList.push({
                title: element.label,
                options: element.options,
              })
            }
          })

          for (let i in this.totalList) {
            if (this.totalList[i].title) {
              this.selection.push(this.totalList[i].title)
            }
          }
        })
    },
    //导出
    exportFile() {
      let query = {
        type: 2,
        questionnaireId: this.questionnaireId,
        versionNumber: this.version,
        startDate: '',
        endDate: '',
      }
      if (this.daterange && this.daterange.length > 0) {
        query.startDate = this.daterange[0]
        query.endDate = this.daterange[1]
      }
      location.href =
        this.$baseURL.ICDMApiUrl +
        '/b/questionnaire/questionnaireStatisticExport?' +
        this.$qs.stringify({
          ...query,
          versionNumber: this.version,
          type: 2,
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
</style>

<style scoped>
.proportion-icon {
  font-size: 20px;
  margin-left: 10px;
}
</style>
