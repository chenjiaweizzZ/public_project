<template>
  <div class="marginX20">
    <div class="cxbox">
      <!-- 没有模块部分，故暂时屏蔽 -->
      <!-- <el-select v-model="query.moduleId" clearable placeholder="所属模块">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>-->
      搜索&emsp;
      <el-input
        placeholder="请输入角色名称"
        v-model="query.roleName"
        class="input-with-select limiting"
        maxlength="20"
        show-word-limit
      >
        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
      </el-input>
    </div>
    <el-table
      style="margin-bottom:60px"
      ref="table"
      :data="list"
      stripe
      border
      header-row-class-name="header-height"
    >
      <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="item in thList"
        :key="item.value"
        :label="item.key"
      >
        <template slot-scope="scope">{{scope.row[item.value]}}</template>
      </el-table-column>
    </el-table>
    <div style="margin-top:15px;text-align:right;">
      <el-pagination
        class="pageBottom"
        v-if="list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageQuery.pageNo"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageQuery.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      moduleList: [],
      thList: [
        { value: 'roleName', key: '角色名称' },
        { value: 'moduleName', key: '所属模块' },
        { value: 'description', key: '描述' },
      ],
      list: [],
      query: {
        roleName: '',
        moduleId: '',
      },
      pageQuery: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      options: [
        {
          value: '20170717161709031cad',
          label: ' 管理中心',
        },
        {
          value: '201708211016032106b2',
          label: '随访中心',
        },
        {
          value: '20170907182636153a3d',
          label: '监测中心',
        },
        {
          value: '20170908183514904719',
          label: '客服中心',
        },
        {
          value: '2017101110482002881f',
          label: '宣教中心',
        },
        {
          value: '20180208160714388619',
          label: '预约中心',
        },
        {
          value: '20180208160714388620',
          label: '远程会诊',
        },
        {
          value: '20170717161709031cad',
          label: ' 管理中心',
        },
        {
          value: '2017101110482002881f',
          label: '宣教中心',
        },
        {
          value: '201708211016032106b3',
          label: 'JAVA后端接口',
        },
      ],
    }
  },
  async created() {
    this.$startLoading()
    await this.getList()
    // this.moduleList = await this.getModuleList()
    this.$stopLoading()
  },
  methods: {
    getModuleList() {
      return new Promise((resolve, reject) => {
        this.$apis.getBaseModuleTree().then((res) => {
          if (res) {
            resolve(res)
          }
        })
      })
    },

    getList() {
      return this.$apis
        .rolegetRoles({
          ...this.query,
          ...this.pageQuery,
        })
        .then((res) => {
          this.list = res.list
          this.total = res.total
        })
    },
    handleSizeChange(v) {
      this.pageQuery.pageSize = v
      this.pageQuery.pageNo = 1
      this.getList()
    },
    handleCurrentChange(v) {
      this.getList()
    },
  },
}
</script>
<style lang="scss">
.cxbox {
  width: 100%;
  padding: 15px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  background-color: #f8f8f8;
  .el-input--small {
    margin-right: 10px;
    width: 280px;
  }
}
</style>