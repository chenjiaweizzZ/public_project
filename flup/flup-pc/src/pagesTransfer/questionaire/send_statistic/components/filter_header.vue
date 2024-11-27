<template>
  <div class="flex-align-spacebetween margin-bottom10 header" style="flex-direction:row-reverse;">
    <div class="flex-align-justify query">
      <!-- 出院/入院 -->
      <strong>患者类型：</strong>
      <el-select class="query-item width130px" v-model="query.type" placeholder="选择患者类型">
        <el-option
          v-for="(item, i) in patientTypeList"
          :key="i"
          :label="item.patientTypeName"
          :value="item.id"
        ></el-option>
      </el-select>
      <!-- 时间间隔 -->
      <div v-show="query.type==2">
        <strong class="margin-left10">出院时间：</strong>
        <el-date-picker
          v-model="query.date"
          clearable
          :editable="false"
          class="query-item"
          style="width:230px"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>

      <!-- <el-select
        class="query-item width140px"
        clearable
        v-model="query.state"
        placeholder="选择发送状态"
      >
        <el-option
          v-for="item in stateList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>-->

      <el-select
        class="query-item width140px"
        clearable
        v-model="query.deptName"
        :placeholder="query.type == 1 ? '选择当前科室' : '选择出院科室'"
      >
        <el-option
          v-for="item in deptOptions"
          :key="item.value"
          :label="item.Text"
          :value="item.Value"
        ></el-option>
      </el-select>

      <!-- <el-input
        class="query-input width130px"
        clearable
        v-model="query.patientName"
        placeholder="请输入姓名"
        @keyup.enter.native="onSearch"
      ></el-input>-->

      <el-button class="query-item" type="primary" @click="onSearch(false)">查询</el-button>
      <el-popover ref="popover" placement="top" width="300" v-model="advanVisible">
        <el-form label-width="80px">
          <el-form-item label="发送状态">
            <el-select class="query-item" clearable v-model="query.state" placeholder="选择发送状态">
              <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="query.patientName" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <div class="text-align-center">
            <el-button type="primary" size="mini" @click="onSearch(true)">确定</el-button>
          </div>
        </el-form>
      </el-popover>
      <el-button type="primary" class="margin-left10" v-popover:popover>高级查询</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    deptOptions: {
      type: Array,
      default() {
        return []
      },
    },
    dateRange: {
      type: Array,
    },
  },
  data() {
    return {
      query: {
        type: 2,
        deptName: '',
        date: [],
        patientName: '',
        state: '',
      },
      stateList: [
        { label: '已发送', value: 1 },
        { label: '未发送', value: 0 },
      ],
      advanVisible: false,
      patientTypeList: [],
    }
  },
  created() {
    this.query.date = this.dateRange
    this.$apis.queryPatientTypeAll().then((res) => {
      this.patientTypeList = res
    })
  },
  methods: {
    onSearch(isAdvance) {
      console.log(isAdvance)
      if (!isAdvance) {
        this.query.state = ''
        this.query.patientName = ''
      }
      let query = {
        startDate: this.query.date ? this.query.date[0] : '',
        endDate: this.query.date ? this.query.date[1] : '',
        deptName: this.query.deptName,
        patientName: this.query.patientName,
        type: this.query.type,
        state: this.query.state,
      }
      this.$emit('onSearch', query)
      this.advanVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  background-color: #eee;
  padding: 20px 10px;
}
.query {
  // width: 900px;
  // flex-wrap: wrap;
  .query-item,
  .query-input {
    margin-left: 10px;
  }
}
</style>
