<template>
  <section class="ready-inGroup-list">
    <div class="queryConditionsBox">
      <div class="queryConditions">
        <p>计划</p>
        <el-select class="width200" v-model="search.planId" @change="onSearch" placeholder="随访计划">
          <el-option
            v-for="item in planList"
            :key="item.serialNo"
            :value="item.serialNo"
            :label="item.planName"
          ></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <p>人群标签</p>
        <el-select
          multiple
          class="width200"
          v-model="search.crowdType"
          @change="onSearch"
          placeholder="人群标签"
        >
          <el-option
            v-for="item in crowdTypeList"
            :key="item.dict_code"
            :value="item.dict_code"
            :label="item.dict_name"
          ></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <div class="flex">
          <el-select
            class="margin-left10 width110px select-time-key"
            v-model="search.searchTimeKey"
          >
            <el-option
              v-for="item in timeKeyList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
          <el-date-picker
            class="select-time-val"
            type="daterange"
            v-model="search.searchTimeValue"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            clearable
            @change="onSearch"
          ></el-date-picker>
        </div>
      </div>
      <div class="queryConditions">
        <p>状态</p>
        <el-select
          class="width200"
          v-model="search.status"
          @change="onSearch"
          placeholder="状态"
          clearable
        >
          <el-option
            v-for="item in statusList.filter(x=>x.value !=-1)"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            @change="onSearch"
          ></el-option>
        </el-select>
      </div>
      <div class="queryConditions">
        <el-input
          class="margin-left10 width200px limiting"
          style="margin-right: 10px"
          v-model="search.searchValue"
          maxlength="20"
          show-word-limit
          clearable
        >
          <el-select class="width120px" v-model="search.searchKey" slot="prepend">
            <el-option
              v-for="item in searchKeyList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>
      </div>
      <div class="butBox">
        <el-button
          type="info"
          :disabled="importEnable"
          @click="groupPlan(multipleSelection,1)"
          plain
        >批量入组</el-button>
        <el-button
          type="warning"
          :disabled="importEnable"
          @click="groupPlan(multipleSelection,-1)"
          plain
        >批量忽略</el-button>
      </div>
    </div>
    <div>
      <el-row>
        <div class="font-size2 color-333">
          <img style="margin-left: 10px;" src="~@/assets/images/icon/setting.png" alt="设置" />
          <el-button @click="ruleSetting" :disabled="!search.planId" type="text">规则设置</el-button>
        </div>
      </el-row>
    </div>
    <el-table
      class="bdert"
      style="margin-top:20px"
      :data="mainList"
      highlight-current-row
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" :selectable="checkSelect"></el-table-column>
      <el-table-column show-overflow-tooltip width="70" type="index" label="序号"></el-table-column>
      <el-table-column label="患者姓名">
        <template slot-scope="scope">
          <!-- 缺少patientTypeCode故屏蔽 -->
          <!-- <el-button
            @click="onView(scope.row)"
            type="text"
          >-->
          {{ scope.row.patientName | hideInfo('name') }}
          <!-- </el-button> -->
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item,index) in baseColumnsV2"
        :key="index"
        :prop="item.fieldName"
        :label="item.displayName"
        :formatter="item.formatter"
      ></el-table-column>
      <el-table-column fixed="right" width="130" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="groupPlan([scope.row.id],1)"
            :disabled="scope.row.status!=0"
            type="text"
          >入组计划</el-button>
          <el-button
            @click="groupPlan([scope.row.id],-1)"
            :disabled="scope.row.status!=0"
            type="text"
          >忽略</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageBottom"
      v-if="mainList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="search.pageNo"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="search.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>
    <RuleSetting v-if="dialogVisible" :planId="search.planId" :show.sync="dialogVisible"></RuleSetting>
  </section>
</template>

<script>
import RuleSetting from './ruleSetting'
import NewPatientAlert from '@/components/newPatientAlert'
export default {
  // mixins: [Pagination],
  components: { RuleSetting, NewPatientAlert },

  data() {
    return {
      importEnable: false,

      dialogVisible: false,
      search: {
        planId: '',
        status: '',
        crowdType: '',
        hospitalId: '',
        searchKey: 'patientName',
        searchValue: '',
        searchTimeKey: 'recordDatetime',
        searchTimeValue: null,
        pageNo: 1,
        pageSize: 10,
      },
      planList: [],
      crowdTypeList: [],
      timeKeyList: [
        { label: '获取时间', value: 'recordDatetime' },
        { label: '处理时间', value: 'processDatetime' },
        { label: '创建时间', value: 'createDatetime' },
      ],
      statusList: [
        { label: '已处理', value: '1' },
        { label: '待处理', value: '0' },
        { label: '忽略', value: '-1' },
      ],
      searchKeyList: [
        { label: '姓名', value: 'patientName' },
        { label: '联系电话', value: 'phone' },
        { label: '病案号', value: 'patientId' },
      ],
      baseColumnsV2: [
        { fieldName: 'sex', displayName: '患者性别' },
        { fieldName: 'age', displayName: '年龄' },
        { fieldName: 'dateOfBirth', displayName: '出生日期' },
        { fieldName: 'phone', displayName: '联系电话' },
        { fieldName: 'createDatetime', displayName: '创建时间' },
        { fieldName: 'patientId', displayName: '病案号' },
        { fieldName: 'recordDatetime', displayName: '获取时间' },
        {
          displayName: '人群标签',
          formatter: this.formateCrowType,
        },
        {
          displayName: '状态',
          formatter: this.formateStatus,
        },
        { fieldName: 'processDatetime', displayName: '处理时间' },
      ],
      mainList: [
        {
          patientName: '小何',
          sex: '1',
          age: '1',
          birth: '1',
          phone: '1',
          createTime: '1',
          patientNo: '1',
          getTime: '1',
          crowdType: '1',
          status: '1',
          dealTime: '1',
        },
      ],
      multipleSelection: [],
      total: 0,
      rule: {},
      form: {},
    }
  },
  async created() {
    await this.$apis.getFlupRulePlanList().then((res) => {
      this.planList = res
      if (this.planList.length > 0) {
        this.search.planId = this.planList[0].serialNo
      }
    })

    await this.$apis
      .BaseDictGetDictItems({
        keyWord: '',
        parentId: '20170915191220011928',
      })
      .then((res) => {
        this.crowdTypeList = res
      })
    this.onSearch()
  },

  methods: {
    ruleSetting() {
      console.log('ruleSetting')
      console.log(this.dialogVisible)
      this.dialogVisible = true
    },
    onView(row) {
      debugger
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }

      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/healtharchives?userId=${row.userId}&name=${
              row.patientName
            }&sex=${row.sex}&age=${this.$utils.getAge(row.dateOfBirth)}&phone=${
              row.phone
            }&dateTime=${this.$utils.formatDate(
              row.createDatetime
            )}&groupDatetime=${this.$utils.formatDate(
              row.recordDatetime
            )}&recordSerialNo=${row.recordSerialNo}&flupPlanId=${
              this.search.flupPlanId
            }&conceal=${true}`,
          title: '健康档案',
        }),
        '*'
      )
    },

    //获取带入组列表
    onSearch() {
      this.search.pageNo = 1
      this.getMainList()
    },
    getMainList() {
      let search = { ...this.search }
      search.crowdType = search.crowdType ? this.search.crowdType.join(',') : ''
      search.searchTimeValue = search.searchTimeValue
        ? this.search.searchTimeValue.join(',')
        : ''
      this.$apis.getFlupPatientPlanQueue(search).then((res) => {
        this.mainList = res.list
        this.total = this.mainList.length
      })
    },
    formateCrowType(row) {
      let crow = this.crowdTypeList.filter((x) => x.dict_code == row.crowdType)
      return crow.length > 0 ? crow[0].dict_name : ''
    },
    formateStatus(row) {
      let status = this.statusList.filter((x) => x.value == row.status)
      return status.length > 0 ? status[0].label : ''
    },
    //入组计划
    groupPlan(id, status) {
      if (id.length == 0) {
        this.$message.warning('请选择待入组患者')
        return
      }
      if (status == 1) {
        //入组
        this.$apis
          .addGroupQueue({ id: id.join(','), status: status })
          .then((res) => {
            let succeedCount = 0
            let errorList = []
            for (let i in res) {
              if (res[i].groupCount == 0) {
                errorList.push(res[i])
              } else {
                succeedCount += res[i].groupCount
              }
            }
            if (succeedCount > 0) {
              this.$message({
                message: '操作成功，共生成 ' + succeedCount + ' 条任务',
                type: 'success',
              })
            }
            if (errorList.length > 0) {
              const h = this.$createElement
              this.$notify.error({
                title: '失败',
                duration: 0,
                message: h('NewPatientAlert', {
                  props: {
                    errorList,
                  },
                }),
              })
            }
            this.multipleSelection = []
            this.getMainList()
          })
      } else {
        //忽略
        this.$apis
          .ignoreQueue({ id: id.join(','), status: status })
          .then((res) => {
            if (res) {
              this.$message.success('忽略成功')
              this.multipleSelection = []
              this.getMainList()
            }
          })
      }
    },
    //判断选项框是否可以选择
    checkSelect(row) {
      return row.status.toString() == '0'
    },
    //选中行变化
    handleSelectionChange(val) {
      this.multipleSelection = val.map((x) => x.id)
    },
    handleSizeChange(pageSize) {
      this.search.pageSize = pageSize
      this.getMainList()
    },
    handleCurrentChange(pageNo) {
      this.search.pageNo = pageNo
      this.getMainList()
    },
  },
}
</script>

<style lang="scss">
</style>