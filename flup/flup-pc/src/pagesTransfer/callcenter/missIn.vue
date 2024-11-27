<template>
  <section class="routine-new">
    <div class="padding-top0 padding-bottom16 paddingX20">
      <el-row type="flex" align="middle" class="missRow">
        <p>类型</p>
        <el-select class="margin-left14 width170px" v-model="search.status" @change="onClickSearch">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <p>时间</p>
        <el-date-picker
          class="select-time-val margin-left14"
          type="daterange"
          v-model="date"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
          clearable
          @change="onClickSearch"
        ></el-date-picker>

        <el-input
          class="margin-left10 width380px limiting"
          style="margin-right: 10px; margin-left: 20px;"
          v-model="search.searchValue"
          clearable
          maxlength="20"
          show-word-limit
        >
          <el-select class="width120px" v-model="search.searchKey" slot="prepend" clearable>
            <el-option
              v-for="item in searchKeyList"
              :key="item.label"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="onClickSearch"></el-button>
        </el-input>
      </el-row>
      <el-table
        border
        style="width: 100%; margin-bottom: 60px"
        row-key="no"
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :load="load"
        :data="tableData"
      >
        <el-table-column prop="no" label="序号"></el-table-column>
        <el-table-column prop="src" label="来电号码">
          <template slot-scope="scope">{{ scope.row.src | hideInfo("phone") }}</template>
        </el-table-column>
        <el-table-column prop="dst" label="呼叫号码">
          <template slot-scope="scope">{{ scope.row.dst | hideInfo("phone") }}</template>
        </el-table-column>
        <el-table-column prop="calldate" label="呼入时间"></el-table-column>
        <el-table-column prop="callagent" label="工号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{
            scope.row.status == 1 ? "未处理" : "已处理"
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="call(scope.row.src, scope.row)">呼叫</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="tableData.length"
        class="page-custom pageBottom"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="search.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      ></el-pagination>
    </div>
  </section>
</template>
<script>
import Pagination from '@/mixins/pagination'
export default {
  mixins: [Pagination],
  data() {
    return {
      typeList: [
        { label: '未处理', value: 1 },
        { label: '已处理', value: 2 },
      ],
      search: {
        pageNo: 1,
        pageSize: 10,
        status: 1,
        startDate: '',
        endDate: '',
        searchValue: '',
        searchKey: '',
      },
      searchKeyList: [
        { label: '来电号码', value: 'src' },
        { label: '呼叫号码', value: 'dst' },
        { label: '工号', value: 'callagent' },
      ],
      date: '',
      tableData: [],
      total: 0,
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    call(Phone, row) {
      if (Phone) {
        this.$store.commit('ipcc/changeCallOutNumber', Phone)
        // window.parent.postMessage(
        //   JSON.stringify({
        //     method: 'callNumber',
        //     PhoneNumber: Phone,
        //   }),
        //   '*'
        // )
        this.$apis.callOperation({ id: row.id }).then((res) => {
          if (res) {
            row.status = 2
          }
        })
      }
    },
    load(tree, treeNode, resolve) {
      this.$apis
        .getMissInChild({
          src: tree.src,
          id: tree.id,
          status: this.search.status,
          startDate: this.search.startDate,
          endDate: this.search.endDate,
          searchValue: this.search.searchValue,
          searchKey: this.search.searchKey,
        })
        .then((res) => {
          res.forEach((element) => {
            element.no = ''
          })
          resolve(res)
        })
    },
    onSearch() {
      if (this.date) {
        this.search.startDate = this.date[0]
        this.search.endDate = this.date[1]
      } else {
        this.search.startDate = ''
        this.search.endDate = ''
      }

      this.$apis.getMissIn(this.search).then((res) => {
        this.tableData = res.list
        this.total = res.total
        this.tableData.forEach((element, index) => {
          element.no = index + 1
          if (element.callCount > 1) {
            element.hasChildren = true
          }
        })
      })
    },
    onClickSearch() {
      this.tableData = []
      this.search.pageNo = 1
      this.onSearch()
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      this.search.pageNo = 1
      this.onSearch()
    },
    handleCurrentChange(val) {
      this.search.pageNo = val
      this.onSearch()
    },
  },
}
</script>

<style lang="scss" scope>
.routine-new {
  padding: 0px 20px 20px 20px;
  font-size: 14px;
  color: #111;
  .el-input-group__prepend {
    color: rgb(96, 98, 102);
    background-color: #fff;
  }
  .select-time-key {
    .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
  }
  .select-time-val {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .el-table .el-table_1_column_2 {
    .cell.el-tooltip {
      min-width: 300px;
    }
  }
  .missRow {
    padding: 20px 0;
    margin-bottom: 20px;
    background-color: #f8f8f8;
    p {
      margin-left: 20px;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      text-align: right;
    }
  }
}
</style>